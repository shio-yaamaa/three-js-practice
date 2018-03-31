/* global THREE */
/* global TWEEN */

// Constants
// Color/Opacity
const SCENE_BACKGROUND = 0x000000;
const DEFAULT_SPRITE_COLOR = 0xffffff;
const HOVERED_SPRITE_COLOR = 0xe57373;
const VISITED_SPRITE_OPACITY = 0.5;
// Dimension
const SPRITE_MAX_SIZE = 4;
const FOCUSED_SPRITE_MAX_RATIO = 0.7;
// Sprite visibility
const DEFAULT_CAMERA_FAR = 0.1;
const FOG_NEAR = 3;
const DEFAULT_FOG_FAR = 50;
const FOG_FAR_IN_FOCUS_MODE = 10;
const RAYCASTER_FAR = 45;
// Animation
const FLY_CONTROLS_MOVEMENT_SPEED = 30;
const FLY_CONTROLS_ROLL_SPEED = Math.PI / 5; // Math.PI / 6;
const ZOOMIN_DURATION = 800;
const ZOOMOUT_DURATION = 500;

// Fly controls container
const container = document.createElement('div');
document.body.appendChild(container);

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE_BACKGROUND);
scene.fog = new THREE.Fog(scene.background, 3, 50);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, DEFAULT_CAMERA_FAR, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Fly controls
const flyControls = new THREE.FlyControls(camera, container);
const clock = new THREE.Clock();
flyControls.movementSpeed = FLY_CONTROLS_MOVEMENT_SPEED;
const toggleFlyControls = activate => {
	flyControls.movementSpeed = activate ? FLY_CONTROLS_MOVEMENT_SPEED : 0;
	flyControls.rollSpeed = activate ? FLY_CONTROLS_ROLL_SPEED : 0;
};
toggleFlyControls(true);

// Raycaster
const raycaster = new THREE.Raycaster();
raycaster.far = RAYCASTER_FAR;
let intersected; // save the previously intersected object
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', event => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}, false);

// Focus
let focusedSprite;
let previousCameraPosition = camera.position.clone();
let previousCameraQuaternion = camera.quaternion.clone();
let ongoingFocusTween;

// Create and add Sprites
const subwayImgNames = ['american', 'banana_peppers', 'black_forest_ham', 'black_olives', 'chipotle_southwest',
 'cucumbers', 'flatbread', 'green_peppers', 'italian', 'italian_bmt', 'italian_herbs_and_cheese',
 'jalapenos', 'lettuce', 'mayonnaise', 'meatball_marinara', 'monterey_cheddar', 'multi_grain_flatbread',
 'mustard', 'nine_grain_wheat', 'oil', 'oven_roasted_chicken', 'pickles', 'ranch', 'red_onions', 'spinach',
 'sweet_onion', 'sweet_onion_chicken_teriyaki', 'tomatoes', 'tuna', 'turkey_breast', 'vinaigrette', 'vinegar'];
const pepperImgNames = ['square_pepper', 'horizontal_pepper', 'vertical_pepper'];
//const spriteMaps = subwayImgNames.map(name => new THREE.TextureLoader().load(`img/${name}.png`));

for (let i = 0; i < 100; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
		//map: spriteMaps[i % spriteMaps.length],
		//map: spriteMaps[Math.floor(Math.random() * spriteMaps.length)],
		map: new THREE.TextureLoader().load(
			`img/${pepperImgNames[i % pepperImgNames.length]}.png`,
			texture => {
				if (texture.image.width >= texture.image.height) {
					sprite.scale.set(SPRITE_MAX_SIZE, texture.image.height * (SPRITE_MAX_SIZE / texture.image.width));
				} else {
					sprite.scale.set(texture.image.width * (SPRITE_MAX_SIZE / texture.image.height), SPRITE_MAX_SIZE);
				}
			}
		),
		color: DEFAULT_SPRITE_COLOR,
		fog: true
	}));
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	scene.add(sprite);
}

// Animate and Render
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
	TWEEN.update();
  flyControls.update(clock.getDelta());
  
  // Change the hovered sprite's color
  if (!focusedSprite) {
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(scene.children);
		
  	if (intersected && intersected != intersects[0]) {
  		intersected.object.material.color.set(DEFAULT_SPRITE_COLOR); // Reset the previously hovered sprite's color
  	}
		intersected = intersects[0];
		intersected && intersected.object.material.color.set(HOVERED_SPRITE_COLOR);
  }
	
	renderer.render(scene, camera);
};

animate();

// Click event
renderer.domElement.addEventListener('mousedown', event => {
  if (focusedSprite){ // zoom out
    focus(false);
    focusedSprite = null;
  } else if (intersected){ // zoom in
    focusedSprite = intersected.object;
  	focusedSprite.material.color.set(DEFAULT_SPRITE_COLOR);
    previousCameraPosition = camera.position.clone();
    previousCameraQuaternion = camera.quaternion.clone();
    focus(true);
  }
});

const focus = zoomIn => {
	const tweenValues = {};
	const tweenTarget = {};
	
	toggleFlyControls(!zoomIn);
	focusedSprite.material.opacity = zoomIn ? 1 : VISITED_SPRITE_OPACITY;
	
	// Camera settings
	const marginToSprite = computeMarginToSprite(
		renderer.getSize().width, renderer.getSize().height,
		focusedSprite.scale.x, focusedSprite.scale.y,
		FOCUSED_SPRITE_MAX_RATIO
	);
	camera.far = zoomIn ? marginToSprite : DEFAULT_CAMERA_FAR;
	
	// Make the fog denser; the fog should not affect the focused sprite
	focusedSprite.material.fog = !zoomIn;
	tweenValues.fogFar = scene.fog.far;
	tweenTarget.fogFar = zoomIn ? FOG_FAR_IN_FOCUS_MODE : DEFAULT_FOG_FAR;
	
  // Move the camera
	const distance = new THREE.Vector3().subVectors(
		zoomIn ? focusedSprite.position : previousCameraPosition,
		camera.position
	);
	const margin = zoomIn
		? distance.clone().normalize().multiplyScalar(marginToSprite)
		: new THREE.Vector3();
	const targetPos = new THREE.Vector3().addVectors(
		camera.position,
		new THREE.Vector3().subVectors(distance, margin)
	);
	Object.assign(tweenValues, {posX: camera.position.x, posY: camera.position.y, posZ: camera.position.z});
	Object.assign(tweenTarget, {posX: targetPos.x, posY: targetPos.y, posZ: targetPos.z});
  
  // Camera Rotation using Slerp
  const originalQuaternion = camera.quaternion.clone();
  let destinationQuaternion;
  if (zoomIn) {
	  const tempCamera = camera.clone();
	  tempCamera.lookAt(focusedSprite.position);
	  destinationQuaternion = tempCamera.quaternion.clone();
  } else {
  	destinationQuaternion = previousCameraQuaternion;
  }
  tweenValues.slerpT = 0;
  tweenTarget.slerpT = 1;
  let slerpedQuaternion = new THREE.Quaternion();
  
  // Tween everything
	const tween = new TWEEN.Tween(tweenValues)
		.to(tweenTarget, zoomIn ? ZOOMIN_DURATION : ZOOMOUT_DURATION)
		.easing(TWEEN.Easing.Quartic.Out)
		.onUpdate(() => {
			// Fog
			scene.fog.far = tweenValues.fogFar;
			
			// Position
			camera.position.set(tweenValues.posX, tweenValues.posY, tweenValues.posZ);
			
			// Quaternion
			THREE.Quaternion.slerp(originalQuaternion, destinationQuaternion, slerpedQuaternion, tweenValues.slerpT);
			camera.setRotationFromQuaternion(slerpedQuaternion.normalize());
		});
	ongoingFocusTween && ongoingFocusTween.stop();
	ongoingFocusTween = tween;
	tween.start();
};

const computeMarginToSprite = (screenWidth, screenHeight, spriteWidth, spriteHeight, maxRatio) => {
	const visibleHeight = (spriteWidth / screenWidth > spriteHeight / screenHeight)
		? (spriteWidth / maxRatio) / camera.aspect
		: spriteHeight / maxRatio;
	return visibleHeight / (2 * Math.tan((camera.fov * Math.PI / 180) / 2));
};

let wheelTimer;

// Wheel event
renderer.domElement.addEventListener('wheel', event => {
	if (focusedSprite) { return; }
	
	flyControls.moveState.forward = event.wheelDelta > 0 ? 1 : 0;
	flyControls.moveState.back = event.wheelDelta > 0 ? 0 : 1;
	flyControls.updateMovementVector();
	
	clearTimeout(wheelTimer);
	wheelTimer = setTimeout(() => {
		flyControls.moveState.forward = 0;
		flyControls.moveState.back = 0;
		flyControls.updateMovementVector();
	}, 200);
});

// Window adjustments
window.addEventListener('resize', event => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
renderer.domElement.addEventListener('mouseleave', () => {
	toggleFlyControls(false);
});
renderer.domElement.addEventListener('mouseenter', () => {
	focusedSprite || toggleFlyControls(true);
});
/* global THREE */
/* global TWEEN */

// Constants
// Colors
const SCENE_BACKGROUND = 0x000000;
const DEFAULT_SPRITE_COLOR = 0xffffff;
const HOVERED_SPRITE_COLOR = 0xe57373;
// Size
const SPRITE_MAX_SIZE = 4;
// Fog density
const DEFAULT_FOG_DENSITY = 0.02;
const FOG_DENSITY_IN_FOCUS_MODE = 0.2;
// Animation
const FLY_CONTROLS_ROLL_SPEED = Math.PI / 6;
const FOCUS_MODE_ANIMATION_DURATION = 800;

// Fly controls container
const clock = new THREE.Clock();
const container = document.createElement('div');
document.body.appendChild(container);

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE_BACKGROUND);
scene.fog = new THREE.FogExp2(scene.background, DEFAULT_FOG_DENSITY);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Fly controls
const flyControls = new THREE.FlyControls(camera, container);
flyControls.movementSpeed = 30;
const toggleFlyControlsRolling = activate => {
	flyControls.rollSpeed = activate ? FLY_CONTROLS_ROLL_SPEED : 0;
};
toggleFlyControlsRolling(true);

// Raycaster
const raycaster = new THREE.Raycaster();
let intersected; // save the previously intersected object
raycaster.intersectObjects(THREE.Sprite);
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', event => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}, false);

// Focus
let focusedSprite;
let previousCameraPosition;
let ongoingFocusTween;

// Create and add Sprites
const subwayImgNames = ['american', 'banana_peppers', 'black_forest_ham', 'black_olives', 'chipotle_southwest',
 'cucumbers', 'flatbread', 'green_peppers', 'italian', 'italian_bmt', 'italian_herbs_and_cheese',
 'jalapenos', 'lettuce', 'mayonnaise', 'meatball_marinara', 'monterey_cheddar', 'multi_grain_flatbread',
 'mustard', 'nine_grain_wheat', 'oil', 'oven_roasted_chicken', 'pickles', 'ranch', 'red_onions', 'spinach',
 'sweet_onion', 'sweet_onion_chicken_teriyaki', 'tomatoes', 'tuna', 'turkey_breast', 'vinaigrette', 'vinegar'];
const pepperImgNames = ['square_pepper', 'horizontal_pepper', 'vertical_pepper'];
//const spriteMaps = pepperImgNames.map(name => new THREE.TextureLoader().load(`img/${name}.png`));

for (let i = 0; i < 500; i++) {
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
	sprite.scale.set(3, 3);
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	scene.add(sprite);
}

// Animate and Render
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
	camera.updateProjectionMatrix();
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
window.addEventListener('mousedown', event => {
	if (focusedSprite) {
		leaveFocusMode(focusedSprite);
		focusedSprite = null;
	} else if (intersected) {
		focusedSprite = intersected.object;
		enterFocusMode(focusedSprite);
	}
});

const enterFocusMode = focusedSprite => {
	focusedSprite.material.color.set(DEFAULT_SPRITE_COLOR);
	toggleFlyControlsRolling(false);
	
	const tweenValues = {};
	const tweenTarget = {};
	
	// Make the fog denser; the fog should not affect the focused sprite
	focusedSprite.material.fog = false;
	tweenValues.fogDensity = scene.fog.density;
	tweenTarget.fogDensity = FOG_DENSITY_IN_FOCUS_MODE;
	
	// Move the camera
	previousCameraPosition = camera.position.clone();
	const distance = focusedSprite.position.clone().sub(camera.position);
	const margin = distance.clone().normalize().multiplyScalar(3);
	const targetPos = new THREE.Vector3().addVectors(camera.position, new THREE.Vector3().subVectors(distance, margin));
	Object.assign(tweenValues, {posX: camera.position.x, posY: camera.position.y, posZ: camera.position.z});
	Object.assign(tweenTarget, {posX: targetPos.x, posY: targetPos.y, posZ: targetPos.z});
	
	// Rotate the camera
	const dummyCamera = camera.clone();
	dummyCamera.lookAt(focusedSprite.position);
	// Don't tween the 'order' property of Euler
	Object.assign(tweenValues, {rotX: camera.rotation.x, rotY: camera.rotation.y, rotZ: camera.rotation.z});
	Object.assign(tweenTarget, {rotX: dummyCamera.rotation.x, rotY: dummyCamera.rotation.y, rotZ: dummyCamera.rotation.z});
	
	// Tween everything
	const tween = new TWEEN.Tween(tweenValues)
		.to(tweenTarget, FOCUS_MODE_ANIMATION_DURATION)
		.easing(TWEEN.Easing.Quartic.Out);
	tween.onUpdate(() => {
		scene.fog.density = tweenValues.fogDensity;
		Object.assign(camera.position, {x: tweenValues.posX, y: tweenValues.posY, z: tweenValues.posZ});
		Object.assign(camera.rotation, {x: tweenValues.rotX, y: tweenValues.rotY, z: tweenValues.rotZ});
	});
	ongoingFocusTween && ongoingFocusTween.stop();
	ongoingFocusTween = tween;
	tween.start();
};

const leaveFocusMode = focusedSprite => {
	toggleFlyControlsRolling(true);
	
	const tweenValues = {};
	const tweenTarget = {};
	
	// Reset the fog
	focusedSprite.material.fog = true;
	tweenValues.fogDensity = scene.fog.density;
	tweenTarget.fogDensity = DEFAULT_FOG_DENSITY;
	
	// Move the camera back to the original position
	Object.assign(tweenValues, {posX: camera.position.x, posY: camera.position.y, posZ: camera.position.z});
	Object.assign(tweenTarget, {posX: previousCameraPosition.x, posY: previousCameraPosition.y, posZ: previousCameraPosition.z});
	
	// Tween everything
	const tween = new TWEEN.Tween(tweenValues)
		.to(tweenTarget, FOCUS_MODE_ANIMATION_DURATION)
		.easing(TWEEN.Easing.Quartic.Out);
	tween.onUpdate(() => {
		scene.fog.density = tweenValues.fogDensity;
		Object.assign(camera.position, {x: tweenValues.posX, y: tweenValues.posY, z: tweenValues.posZ});
	});
	ongoingFocusTween && ongoingFocusTween.stop();
	ongoingFocusTween = tween;
	tween.start();
};

let wheelTimer;

// Wheel event
renderer.domElement.addEventListener('wheel', event => {
	if (focusedSprite) {
		return;
	}
	
	flyControls.moveState.forward = event.wheelDelta > 0 ? 1 : 0;
	flyControls.moveState.back = event.wheelDelta > 0 ? 0 : 1;
	flyControls.updateMovementVector();
	
	clearTimeout(wheelTimer);
	wheelTimer = setTimeout(
		() => {
			flyControls.moveState.forward = 0;
			flyControls.moveState.back = 0;
			flyControls.updateMovementVector();
		},
		200
	);
});

// Window adjustments
window.addEventListener('resize', event => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
renderer.domElement.addEventListener('mouseleave', () => {
	toggleFlyControlsRolling(false);
});
renderer.domElement.addEventListener('mouseenter', () => {
	focusedSprite || toggleFlyControlsRolling(true);
});
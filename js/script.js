/* global $ */
/* global THREE */
/* global TWEEN */
/* global Region */

// Constants
// Color/Opacity
const SCENE_BACKGROUND = 0x101010;
const DEFAULT_SPRITE_COLOR = 0xffffff;
const HOVERED_SPRITE_COLOR = 0xe57373;
const PADDING_COLOR = 0x424242;
const VISITED_SPRITE_OPACITY = 0.5;
// Dimension
const SPRITE_MAX_DIMENSION = 4;
const FOCUSED_SPRITE_MAX_RATIO = 0.7;
// Region
const REGION_SIZE = 50;
const SPRITE_COUNT_PER_REGION = 40;
// Sprite visibility
const DEFAULT_CAMERA_NEAR = 3;
const FOG_NEAR = 3;
const DEFAULT_FOG_FAR = 50;
const FOG_FAR_IN_FOCUS_MODE = 10;
const RAYCASTER_NEAR = 0.1; // to raycast only on visible objects
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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, DEFAULT_CAMERA_NEAR, 1000);
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
raycaster.near = RAYCASTER_NEAR;
raycaster.far = RAYCASTER_FAR;
let intersected; // save the previously intersected object
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', event => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}, false);

// Focus
let focusedSprite;
let cameraPositionBeforeFocus = camera.position.clone();
let cameraQuaternionBeforeFocus = camera.quaternion.clone();
let ongoingFocusTween;

// Create and add Sprites
const subwayImgNames = ['american', 'banana_peppers', 'black_forest_ham', 'black_olives', 'chipotle_southwest',
 'cucumbers', 'flatbread', 'green_peppers', 'italian', 'italian_bmt', 'italian_herbs_and_cheese',
 'jalapenos', 'lettuce', 'mayonnaise', 'meatball_marinara', 'monterey_cheddar', 'multi_grain_flatbread',
 'mustard', 'nine_grain_wheat', 'oil', 'oven_roasted_chicken', 'pickles', 'ranch', 'red_onions', 'spinach',
 'sweet_onion', 'sweet_onion_chicken_teriyaki', 'tomatoes', 'tuna', 'turkey_breast', 'vinaigrette', 'vinegar'];
const pepperImgNames = ['square_pepper', 'horizontal_pepper', 'vertical_pepper'];
//const spriteMaps = subwayImgNames.map(name => new THREE.TextureLoader().load(`img/${name}.png`));

/*
for (let i = 0; i < 100; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
		//map: spriteMaps[i % spriteMaps.length],
		//map: spriteMaps[Math.floor(Math.random() * spriteMaps.length)],
		map: new THREE.TextureLoader().load(
			`img/${pepperImgNames[i % pepperImgNames.length]}.png`,
			texture => {
				const maxDimension = Math.max(texture.image.height, texture.image.width);
        maxDimension === texture.image.width
          ? sprite.scale.set(SPRITE_MAX_DIMENSION, SPRITE_MAX_DIMENSION * (texture.image.height / maxDimension), 1)
          : sprite.scale.set(SPRITE_MAX_DIMENSION * (texture.image.width / maxDimension), SPRITE_MAX_DIMENSION, 1);
			}
		),
		color: DEFAULT_SPRITE_COLOR,
		fog: true
	}));
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	scene.add(sprite);
}
*/

// Lazy loading setup
const cameraFromTop = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
cameraFromTop.rotation.x = -Math.PI / 2;
cameraFromTop.position.y = 100;

const regions = [];
const previousCameraRegion = {x: undefined, y: undefined, z: undefined};
const computeCameraRegion = () => {
	return {
		x: Math.floor(camera.position.x / REGION_SIZE) * REGION_SIZE,
		y: Math.floor(camera.position.y / REGION_SIZE) * REGION_SIZE,
		z: Math.floor(camera.position.z / REGION_SIZE) * REGION_SIZE
	};
};

// Padding of the focusedSprite
const paddingSprite = new THREE.Sprite(new THREE.SpriteMaterial({color: PADDING_COLOR}));

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
  		//intersected.object.material.color.set(DEFAULT_SPRITE_COLOR); // Reset the previously hovered sprite's color
  	}
		intersected = intersects[0];
		//intersected && intersected.object.material.color.set(HOVERED_SPRITE_COLOR);
		
		renderer.domElement.style.cursor = intersected ? 'pointer' : 'default';
  }
  
  // Lazy loading
  if (!focusedSprite) {
  	const currentCameraRegion = computeCameraRegion();
  	if (currentCameraRegion.x != previousCameraRegion.x
  		|| currentCameraRegion.y != previousCameraRegion.y
  		|| currentCameraRegion.z != previousCameraRegion.z) {
  		console.log('region changed!');
  		
  		regions.forEach(element => element.shouldRemain = false);
  		
  		// Add sprites
			for (let i = 0; i < 27; i++) {
				const currentRegion = { // -1 is to make currentCameraRegion center
					x: currentCameraRegion.x + REGION_SIZE * (Math.floor(i / 9) - 1),
					y: currentCameraRegion.y + REGION_SIZE * (Math.floor(i / 3) % 3 - 1),
					z: currentCameraRegion.z + REGION_SIZE * (i % 3 - 1)
				};
				const isEmptyRegion = regions.reduce((accumulator, currentElement) => {
					const isTheSameBlock = currentElement.x === currentRegion.x
						&& currentElement.y === currentRegion.y
						&& currentElement.z === currentRegion.z;
					if (isTheSameBlock) {
						currentElement.shouldRemain = true;
					}
					return accumulator && !isTheSameBlock;
				}, true);
				isEmptyRegion && regions.push(
					new Region(
						scene,
						new THREE.Vector3(currentRegion.x, currentRegion.y, currentRegion.z),
						REGION_SIZE,
						SPRITE_COUNT_PER_REGION
					)
				);
			}
			
			// Remove sprites
			let regionIndex = regions.length - 1;
			while (regionIndex >= 0) {
			  if (!regions[regionIndex].shouldRemain) {
			  	regions[regionIndex].sprites.forEach(sprite => scene.remove(sprite));
			    regions.splice(regionIndex, 1);
			  }
			  regionIndex -= 1;
			}
  		
  		Object.assign(previousCameraRegion, currentCameraRegion);
  	}
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
    cameraPositionBeforeFocus = camera.position.clone();
    cameraQuaternionBeforeFocus = camera.quaternion.clone();
    focus(true);
  }
});

const focus = zoomIn => {
	const tweenValues = {};
	const tweenTarget = {};
	
	toggleFlyControls(!zoomIn);
	focusedSprite.material.opacity = zoomIn ? 1 : VISITED_SPRITE_OPACITY;
	
	// Padding of the focusedSprite
	if (zoomIn) {
		if (Math.min(focusedSprite.scale.x, focusedSprite.scale.y) < SPRITE_MAX_DIMENSION * 0.5) {
			paddingSprite.position.set(focusedSprite.position.x, focusedSprite.position.y, focusedSprite.position.z);
			paddingSprite.scale.set(
				Math.max(focusedSprite.scale.x, SPRITE_MAX_DIMENSION * 0.7),
				Math.max(focusedSprite.scale.y, SPRITE_MAX_DIMENSION * 0.7),
				1
			);
			scene.add(paddingSprite);
		}
	} else {
		scene.remove(paddingSprite);
	}
	
	// Camera settings
	const marginToSprite = computeMarginToSprite(
		renderer.getSize().width, renderer.getSize().height,
		focusedSprite.scale.x, focusedSprite.scale.y,
		FOCUSED_SPRITE_MAX_RATIO
	);
	camera.near = zoomIn ? marginToSprite * 0.8 : DEFAULT_CAMERA_NEAR;
	camera.updateProjectionMatrix();
	
	// Make the fog denser; the fog should not affect the focused sprite
	focusedSprite.material.fog = !zoomIn;
	tweenValues.fogFar = scene.fog.far;
	tweenTarget.fogFar = zoomIn ? FOG_FAR_IN_FOCUS_MODE : DEFAULT_FOG_FAR;
	
  // Move the camera
	const distance = new THREE.Vector3().subVectors(
		zoomIn ? focusedSprite.position : cameraPositionBeforeFocus,
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
  
  // Rotate the camera
  const originalQuaternion = camera.quaternion.clone();
  let destinationQuaternion;
  if (zoomIn) {
	  const tempCamera = camera.clone();
	  tempCamera.lookAt(focusedSprite.position);
	  destinationQuaternion = tempCamera.quaternion.clone();
  } else {
  	destinationQuaternion = cameraQuaternionBeforeFocus;
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
/* global $ */
/* global THREE */
/* global TWEEN */
/* global Region */

// Fly controls container
const container = document.createElement('div');
document.body.appendChild(container);

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE_BACKGROUND);
scene.fog = new THREE.Fog(scene.background, 3, DEFAULT_FOG_FAR);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, DEFAULT_CAMERA_NEAR, DEFAULT_FOG_FAR);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// FlyControls
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

const sprite = new THREE.Sprite(new THREE.SpriteMaterial({color: 0xff0000}));
sprite.position.set(0, 0, -3);
scene.add(sprite);

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
		//intersected && intersected.object.material.color.set(RAYCASTED_SPRITE_COLOR);
		
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
					const isTheSameRegion = currentElement.position.x === currentRegion.x
						&& currentElement.position.y === currentRegion.y
						&& currentElement.position.z === currentRegion.z;
					if (isTheSameRegion) {
						currentElement.shouldRemain = true;
					}
					return accumulator && !isTheSameRegion;
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
setMousedownListener();
setWheelListener();
setWindowListener();
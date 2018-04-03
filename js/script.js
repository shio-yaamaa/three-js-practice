/* global THREE */
/* global TWEEN */
/* global SphericalLoading */

// Fly controls container
const container = document.createElement('div');
document.body.appendChild(container);

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE_BACKGROUND);
scene.fog = new THREE.Fog(scene.background, 3, DEFAULT_FOG_FAR);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, DEFAULT_CAMERA_NEAR, CAMERA_FAR);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Visualize the main camera
/*
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);
const cameraRig = new THREE.Group();
cameraRig.add(camera);
scene.add(cameraRig);
*/

// Camera from top
const cameraFromTop = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
cameraFromTop.position.set(0, 100, 0);
cameraFromTop.rotation.set(-Math.PI / 2, 0, 0);
console.log(cameraFromTop.rotation);

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

// Focus
let focusedSprite;
let cameraPositionBeforeFocus;
let cameraQuaternionBeforeFocus;
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

// SphericalLoading setup
const sphericalLoading = new SphericalLoading(
	scene,
	SPAWN_RADIUS,
	VIEW_RADIUS,
	new THREE.Vector3().addVectors(
		camera.position,
		new THREE.Vector3(VIEW_RADIUS * 2, VIEW_RADIUS * 2, VIEW_RADIUS * 2)
	), // Initialize far from camera to spawn on start
	SPRITE_COUNT_PER_LOAD
);

// Animate and Render
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
	TWEEN.update();
  flyControls.update(clock.getDelta());
  if (!focusedSprite) {
  	sphericalLoading.update(camera.position);
  }
  
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
	
	renderer.render(scene, cameraFromTop);
};

animate();

// Click event
setMouseMoveListener();
setMousedownListener();
setWheelListener();
setWindowListener();
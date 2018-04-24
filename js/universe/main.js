/* global THREE */
/* global TWEEN */
/* global SphericalLoading */

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE_BACKGROUND);
scene.fog = new THREE.Fog(scene.background, 3, DEFAULT_FOG_FAR);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, DEFAULT_CAMERA_NEAR, CAMERA_FAR);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

// Render
const render = () => {
	// Rotate planes
	if (!focusedSprite) {
		scene.children.forEach(plane => {
			plane.rotation.x = plane.rotation.x + 0.01;
			plane.rotation.y = plane.rotation.y + 0.01;
			plane.rotation.z = plane.rotation.z + 0.01;
		});
	}
	
	TWEEN.update();
  //flyControls.update(clock.getDelta());
  if (!focusedSprite) {
  	sphericalLoading.update(camera.position);
  }
  
  // Raycaster
  raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children);
	// Change the hovered sprite's color
  if (!focusedSprite) {
  	if (intersected && intersected != intersects[0]) {
  		intersected.object.material.color.set(DEFAULT_SPRITE_COLOR); // Reset the previously hovered sprite's color
  	}
		intersects[0] && intersects[0].object.material.color.set(RAYCASTED_SPRITE_COLOR);
		renderer.domElement.style.cursor = intersects[0] ? 'pointer' : 'default';
  }
  intersected = intersects[0];
};

// Rendering
Rendering.renderer = renderer;
const universeRendering = new Rendering(
	scene,
	camera,
	THREE.FlyControls,
	[{key: 'movementSpeed', value: FLY_CONTROLS_MOVEMENT_SPEED}, {key: 'rollSpeed', value: FLY_CONTROLS_ROLL_SPEED}],
	render
);
universeRendering.start();
universeRendering.toggleCameraControls(true);
universeRendering.addEventListeners([
	{type: 'mousemove', listener: mousemoveListener},
	{type: 'mousedown', listener: mousedownListener},
	{type: 'wheel', listener: wheelListener},
	{type: 'resize', listener: resizeListener},
	{type: 'mouseleave', listener: mouseleaveListener},
	{type: 'mouseenter', listener: mouseenterListener}
]);
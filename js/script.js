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

// Gif test
//const imgDom = document.getElementById('seyakate');
//const superGif = new SuperGif({gif: imgDom});
//document.body.removeChild(imgDom);
//superGif.load();
//planeMaterial.map = new THREE.Texture(superGif.get_canvas());
//planeMaterial.displacementMap = planeMaterial.map;
/*
const planeGeometry = new THREE.PlaneGeometry(5, 5, 32);
const planeMaterial = new THREE.MeshBasicMaterial({
	map: new Texture('google.gif'),
	color: 0xffffff,
	side: THREE.DoubleSide
});
console.log(planeMaterial);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, -10);
scene.add(plane);
*/

// Animate and Render
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
	//planeMaterial.map.needsUpdate = true;
	//planeMaterial.displacementScale = 200;
	//planeMaterial.displacementMap.needsUpdate = true;
	//planeMaterial.map.needsUpdate = true;
	
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
  		intersected.object.material.color.set(DEFAULT_SPRITE_COLOR); // Reset the previously hovered sprite's color
  	}
		intersected = intersects[0];
		intersected && intersected.object.material.color.set(RAYCASTED_SPRITE_COLOR);
		
		renderer.domElement.style.cursor = intersected ? 'pointer' : 'default';
  }
	
	renderer.render(scene, camera);
};

animate();

// User interaction events
setMouseMoveListener();
setMousedownListener();
setWheelListener();
setWindowListener();
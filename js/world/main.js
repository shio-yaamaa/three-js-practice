/* global THREE */

// Fly controls container
const container = document.createElement('div');
document.body.appendChild(container);

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE_BACKGROUND);
//scene.background = new THREE.TextureLoader().load('img/universe_background.jpg');
//scene.fog = new THREE.Fog(0x666666/*scene.background*/, 3, DEFAULT_FOG_FAR);
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// FlyControls
const firstPersonControls = new THREE.FirstPersonControls(camera, container);
const clock = new THREE.Clock();
firstPersonControls.movementSpeed = FLY_CONTROLS_MOVEMENT_SPEED;
const toggleFlyControls = activate => {
	firstPersonControls.movementSpeed = activate ? FLY_CONTROLS_MOVEMENT_SPEED : 0;
	firstPersonControls.lookSpeed = activate ? FLY_CONTROLS_ROLL_SPEED / 2 : 0;
};
toggleFlyControls(true);

// Create the world background
const worldBackgroundTexture = new THREE.TextureLoader().load('test.png');
const worldBackground = new THREE.Mesh(
  new THREE.SphereGeometry(50, 32, 32),
  new THREE.MeshBasicMaterial({map: worldBackgroundTexture, side: THREE.BackSide})
);

console.log(worldBackground.position);
scene.add(worldBackground);

// Animate and Render
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

let i = 0;
const render = () => {
  firstPersonControls.update(clock.getDelta());
	renderer.render(scene, camera);
	if (i % 100 === 0) {
	  console.log(camera.position.distanceTo(worldBackground.position));
	  console.log(camera.position);
	}
	i++;
};

animate();
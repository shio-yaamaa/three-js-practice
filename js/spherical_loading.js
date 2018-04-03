/* global THREE */

// Fly controls container
const container = document.createElement('div');
document.body.appendChild(container);

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(scene.background, 3, 50);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);



// Fly controls
const flyControls = new THREE.FlyControls(camera, container);
const clock = new THREE.Clock();
flyControls.movementSpeed = 30;
const toggleFlyControls = activate => {
	flyControls.movementSpeed = activate ? 30 : 0;
	flyControls.rollSpeed = activate ? Math.PI / 6 : 0;
};
toggleFlyControls(true);



const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
	flyControls.update(clock.getDelta());
	
	
	
  renderer.render(scene, camera);
};

animate();
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

// Visualize the camera
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);
const cameraRig = new THREE.Group();
cameraRig.add(camera);
scene.add(cameraRig);

// Camera from top
const cameraFromTop = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
cameraFromTop.position.set(0,1000, 0);
cameraFromTop.rotation.set(-Math.PI / 2, 0, 0);

// Fly controls
const flyControls = new THREE.FlyControls(camera, container);
const clock = new THREE.Clock();
flyControls.movementSpeed = 30;
const toggleFlyControls = activate => {
	flyControls.movementSpeed = activate ? 30 : 0;
	flyControls.rollSpeed = activate ? Math.PI / 6 : 0;
};
toggleFlyControls(true);

// Spherical loading setup
const SPHERE_RADIUS = 20;
const DISTANCE_FROM_SPHERE_CENTER = SPHERE_RADIUS * 0.7;
const SPRITE_COUNT_PER_SPHERE = 500;
const previousSphereCenter = new THREE.Vector3().addVectors(
	camera.position,
	new THREE.Vector3(SPHERE_RADIUS * 2, SPHERE_RADIUS * 2, SPHERE_RADIUS * 2)
); // Make the initial previousSphereCenter far away enough from the camera position

// Sprites
const sphereGeometry = new THREE.SphereGeometry(0.3, 6, 6);

const randomPositionInSquare = (position, radius) => {
	return new THREE.Vector3(
		THREE.Math.randFloatSpread(radius * 2) + position.x,
		THREE.Math.randFloatSpread(radius * 2) + position.y,
		THREE.Math.randFloatSpread(radius * 2) + position.z
	);
};

const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
	flyControls.update(clock.getDelta());
	
	// Spherical loading
	if (camera.position.distanceTo(previousSphereCenter) > DISTANCE_FROM_SPHERE_CENTER) {
		console.log('Sphere changed');
		// Add sprites
		for (let i = 0; i < SPRITE_COUNT_PER_SPHERE; i++) {
			const randomPosition = randomPositionInSquare(camera.position, SPHERE_RADIUS);
			if (randomPosition.distanceTo(camera.position) > SPHERE_RADIUS
				|| randomPosition.distanceTo(previousSphereCenter) < SPHERE_RADIUS) { // condition to reject
				continue;
			}
		  const material = new THREE.MeshBasicMaterial({
		  	color: parseInt(Math.floor(Math.random() * (16 ** 6)).toString(16), 16),
		  	fog: false
		  });
		  const sphere = new THREE.Mesh(sphereGeometry, material);
		  Object.assign(sphere.position, randomPosition);
		  scene.add(sphere);
		}
		
		// Remove sprites
		scene.children.forEach(element => {
			if (element.position.distanceTo(camera.position) > SPHERE_RADIUS) {
				scene.remove(element);
			}
		});
		
		Object.assign(previousSphereCenter, camera.position);
	}
	
  renderer.render(scene, camera);
};

animate();
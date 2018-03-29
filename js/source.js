/* global THREE */
/* global TWEEN */

// fly controls container
const clock = new THREE.Clock();
const container = document.createElement('div');
document.body.appendChild(container);

// scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(scene.background, 0.02);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

let focusedSprite;

let previousCameraPosition;
let previousCameraQuaternion;

// fly controls
const flyControls = new THREE.FlyControls(camera, container);
flyControls.movementSpeed = 0;
flyControls.rollSpeed = Math.PI / 6;

// raycaster
const raycaster = new THREE.Raycaster();
raycaster.intersectObjects(THREE.Sprite);
const mouse = new THREE.Vector2();
let intersects = [];
let intersected;

// create and add sprites
const subwayImgNames = ['american', 'banana_peppers', 'black_forest_ham', 'black_olives', 'chipotle_southwest',
 'cucumbers', 'flatbread', 'green_peppers', 'italian', 'italian_bmt', 'italian_herbs_and_cheese',
 'jalapenos', 'lettuce', 'mayonnaise', 'meatball_marinara', 'monterey_cheddar', 'multi_grain_flatbread',
 'mustard', 'nine_grain_wheat', 'oil', 'oven_roasted_chicken', 'pickles', 'ranch', 'red_onions', 'spinach',
 'sweet_onion', 'sweet_onion_chicken_teriyaki', 'tomatoes', 'tuna', 'turkey_breast', 'vinaigrette', 'vinegar'];
const spriteMaps = subwayImgNames.map(name => new THREE.TextureLoader().load(`img/${name}.png`));

for (let i = 0; i < 500; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
		map: spriteMaps[i % spriteMaps.length],
		//map: spriteMaps[Math.floor(Math.random() * spriteMaps.length)],
		color: 0xffffff,
		fog: true
	}));
	sprite.scale.set(3, 3);
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	scene.add(sprite);
}

// animate loop
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
	camera.updateProjectionMatrix();
	TWEEN.update();
  flyControls.update(clock.getDelta());
  
  // change the color of sprites that are under the mouse
  if (!focusedSprite) {
		raycaster.setFromCamera(mouse, camera);
		intersects = raycaster.intersectObjects(scene.children);
		
		// reset the sprite color
  	if (intersected && intersected != intersects[0]) {
  		intersected.object.material.color.set(0xffffff);
  	}
		
		// change the color
		intersected = intersects[0];
		intersected && intersected.object.material.color.set(0xe57373);
  }
	
	renderer.render(scene, camera);
};

animate();

// resize event
window.addEventListener('resize', event => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

// mousemove event
window.addEventListener('mousemove', event => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}, false);

// mousedown event
window.addEventListener('mousedown', event => {
	if (focusedSprite) {
		leaveFocusMode(focusedSprite);
		focusedSprite = null;
		return;
	}
	
	if (!intersects[0]) {
		return;
	}
	
	focusedSprite = intersects[0].object;
	enterFocusMode(focusedSprite);
});

const enterFocusMode = focusedSprite => {
	focusedSprite.material.color.set(0xffffff);
	
	// stop rolling
	flyControls.rollSpeed = 0;
	
	// make the fog denser
	// fog should not affect the focused sprite
	focusedSprite.material.fog = false;
	const fogForTween = {density: 0.03};
	const fogTween = new TWEEN.Tween(fogForTween).to({density: 0.2});
	fogTween.onUpdate(() => scene.fog.density = fogForTween.density);
	fogTween.start();
	
	// move the camera closer to the sprite
	previousCameraPosition = camera.position.clone();
	const distance = focusedSprite.position.clone().sub(camera.position);
	const minus = distance.clone().multiplyScalar(3 / distance.length());
	distance.sub(minus);
	const cameraPosTween = new TWEEN.Tween(camera.position)
		.to(camera.position.clone().add(distance), 1000)
		.easing(TWEEN.Easing.Quartic.Out);
	cameraPosTween.start();
	
	// rotate the camera
	const dummyCamera = camera.clone();
	dummyCamera.lookAt(focusedSprite.position);
	// don't want to tween the 'order' property of Euler
	const cameraRotationForTween = {x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z};
	const targetCameraRotation = {x: dummyCamera.rotation.x, y: dummyCamera.rotation.y, z: dummyCamera.rotation.z};
	const cameraRotationTween = new TWEEN.Tween(cameraRotationForTween)
		.to(targetCameraRotation, 1000);
	cameraRotationTween.onUpdate(() => {
		camera.rotation.x = cameraRotationForTween.x;
		camera.rotation.y = cameraRotationForTween.y;
		camera.rotation.z = cameraRotationForTween.z;
	});
	cameraRotationTween.start();
};

const leaveFocusMode = focusedSprite => {
	focusedSprite.material.color.set(0xffffff);
	
	// resume rolling
	flyControls.rollSpeed = Math.PI / 6;
		
	// reset the fog
	if (focusedSprite) {
		focusedSprite.material.fog = true;
	}
	scene.fog.density = 0.03;
	
	// move the camera back to the original position
	const cameraPosTween = new TWEEN.Tween(camera.position)
		.to(previousCameraPosition, 1000)
		.easing(TWEEN.Easing.Quartic.Out);
	cameraPosTween.start();
};

renderer.domElement.addEventListener('mouseleave', () => {
	flyControls.rollSpeed = 0;
});
renderer.domElement.addEventListener('mouseenter', () => {
	if (!focusedSprite) {
		flyControls.rollSpeed = Math.PI / 5;
	}
});
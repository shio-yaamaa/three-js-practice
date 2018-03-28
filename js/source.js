/* global THREE */
/* global TWEEN */

// fly controls container
const clock = new THREE.Clock();
const container = document.createElement('div');
document.body.appendChild(container);

// scene, camera, renderer
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.03);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// fly controls
const flyControls = new THREE.FlyControls(camera, container);
flyControls.movementSpeed = 0;
flyControls.rollSpeed = Math.PI / 5;

// raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// create and add sprites
const imgNames = ['american', 'banana_peppers', 'black_forest_ham', 'black_olives', 'chipotle_southwest',
 'cucumbers', 'flatbread', 'green_peppers', 'italian', 'italian_bmt', 'italian_herbs_and_cheese',
 'jalapenos', 'lettuce', 'mayonnaise', 'meatball_marinara', 'monterey_cheddar', 'multi_grain_flatbread',
 'mustard', 'nine_grain_wheat', 'oil', 'oven_roasted_chicken', 'pickles', 'ranch', 'red_onions', 'spinach',
 'sweet_onion', 'sweet_onion_chicken_teriyaki', 'tomatoes', 'tuna', 'turkey_breast', 'vinaigrette', 'vinegar'];
const spriteMaps = imgNames.map(name => new THREE.TextureLoader().load(`img/${name}.png`));

for (let i = 0; i < 1000; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
		map: spriteMaps[Math.floor(Math.random() * spriteMaps.length)],
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

let intersects = [];

const render = () => {
	TWEEN.update();
  flyControls.update(clock.getDelta());
  
  // reset the sprite color
  for (let i = 0; i < scene.children.length; i++) {
  	scene.children[i].material.color.set(0xffffff);
  }
  
  // change the color of sprites that are under the mouse
  if (flyControls.isActive) {
		raycaster.setFromCamera(mouse, camera);
		intersects = raycaster.intersectObjects(scene.children);
		intersects[0] && intersects[0].object.material.color.set(0xe57373);
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

let focusedSprite = null;

// mousedown event
window.addEventListener('mousedown', event => {
	if (!flyControls.isActive) {
		flyControls.resume();
		flyControls.rollSpeed = Math.PI / 5;
		
		// reset the fog
		if (focusedSprite) {
			focusedSprite.material.fog = true;
		}
		scene.fog.density = 0.03;
		return;
	}
	
	if (!intersects[0]) {
		return;
	}
	
	focusedSprite = intersects[0].object;
	
	// disable the flycontrols' mousemove listener
	flyControls.dispose();
	flyControls.rollSpeed = 0;
	
	// make the fog denser
	// fog should not affect the focused sprite
	focusedSprite.material.fog = false;
	const fog = {density: 0.03};
	const fogTween = new TWEEN.Tween(fog).to({density: 0.2});
	fogTween.onUpdate(() => scene.fog.density = fog.density);
	fogTween.start();
	
	// move the camera closer to the sprite
	const cameraPos = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
	
	const objectVec = new THREE.Vector3(focusedSprite.position.x, focusedSprite.position.y, focusedSprite.position.z);
	const cameraVec = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
	const distance = objectVec.sub(cameraVec);
	const minus = distance.clone().multiplyScalar(3 / distance.length());
	distance.sub(minus);
	
	const cameraPosTween = new TWEEN.Tween(cameraPos)
		.to({x: camera.position.x + distance.x, y: camera.position.y + distance.y, z: camera.position.z + distance.z}, 1000)
		.easing(TWEEN.Easing.Quartic.Out);
	cameraPosTween.onUpdate(() => {
	  camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
	});
	cameraPosTween.start();
});
// to check which object comes first in the intersects list

/* global THREE */
/* global TWEEN */

// scene, camera, renderer
const scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2(0x000000, 0.03);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// fly controls
const clock = new THREE.Clock();
const flyControls = new THREE.FlyControls(camera);
const container = document.createElement('div');
flyControls.domElement = container;
flyControls.movementSpeed = 30;
flyControls.rollSpeed = Math.PI / 5;

flyControls.mousemove = null;

// raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.body.appendChild(container);
container.appendChild(renderer.domElement);

// create and add sprites
const spriteMap = new THREE.TextureLoader().load('texture.jpg');

/*
for (let i = 0; i < 1000; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff, fog: true}));
	sprite.scale.set(5, 3);
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	scene.add(sprite);
}*/

for (let i = 0; i < 100; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff, fog: true}));
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	const distance = sprite.position.x ** 2 + sprite.position.y ** 2 + sprite.position.z ** 2;
	sprite.scale.set(distance * 0.01, distance * 0.01);
	scene.add(sprite);
}

// animate loop
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
  flyControls.update(clock.getDelta());
  
  // reset the sprite color
  for (let i = 0; i < scene.children.length; i++) {
  	scene.children[i].material.color.set(0xffffff);
  }
  
  // change the color of sprites that are under the mouse
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length < scene.children.length) {
		/*
		for (let i = 0; i < intersects.length; i++) {
			intersects[i].object.material.color.set(0xff0000);
		}*/
		intersects[0] && intersects[0].object.material.color.set(0xff0000);
		intersects[1] && intersects[1].object.material.color.set(0x0000ff);
		intersects[2] && intersects[2].object.material.color.set(0xffff00);
		intersects[3] && intersects[3].object.material.color.set(0x00ff00);
		intersects[4] && intersects[4].object.material.color.set(0xff00ff);
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

// mouse move event
window.addEventListener('mousemove', event => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}, false);
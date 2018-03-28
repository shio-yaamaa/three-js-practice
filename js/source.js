/* global THREE */
/* global TWEEN */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var spriteMap = new THREE.TextureLoader().load('texture.jpg');
var spriteMaterial = new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff});

for (let i = 0; i < 1000; i++) {
	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	scene.add(sprite);
}

// animate

const animate = () => {
	TWEEN.update();
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};
animate();

window.addEventListener('resize', event => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

let timer;

renderer.domElement.addEventListener('mousemove', event => {
	const xOffset = (event.clientX - window.innerWidth / 2);
	const yOffset = (event.clientY - window.innerHeight / 2);
	camera.rotation.y -= xOffset / 10000;
	camera.rotation.x -= yOffset / 10000;
	
	clearTimeout(timer);
	timer = setTimeout(
		() => {
			const rotation = {x: camera.rotation.x, y: camera.rotation.y};
			const target = {x: camera.rotation.x - yOffset / 2000, y: camera.rotation.y - xOffset / 2000};
			const tween = new TWEEN.Tween(rotation).to(target, 500).easing(TWEEN.Easing.Quartic.Out);
			tween.onUpdate(function () {
				console.log(rotation.x + ', ' + rotation.y);
		    camera.rotation.x = rotation.x;
		    camera.rotation.y = rotation.y;
			});
			tween.start();
		},
		30
	);
});
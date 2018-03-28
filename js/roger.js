/* global THREE */

var camera, scene, renderer;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var spriteMap = new THREE.TextureLoader().load("texture.jpg");
var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } );
var sprite = new THREE.Sprite( spriteMaterial );
scene.add( sprite );
camera.position.z = 5;

const animate = () => {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};
animate();
/* global THREE */

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = 0xffffff;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Don't forget to check the "Face Materials" checkbox when exporting JSON file from Blender!!
let mesh = null;
const initMesh = () => {
  const loader = new THREE.JSONLoader();
  loader.load('../D_for_three.json', geometry => {
    console.log('load completed');
    mesh = new THREE.Mesh(geometry);
    mesh.position.set(0, 0, -10);
    scene.add(mesh);
  });
}

initMesh();

// Animate and Render
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
  renderer.render(scene, camera);
};

animate();
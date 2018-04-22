/* global THREE */

const switchToDifferentScene = (renderer) => {
  
  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x553300);
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  // Animate and Render
  const animate = () => {
  	requestAnimationFrame(animate);
  	render();
  };
  
  const render = () => {
  	renderer.render(scene, camera);
  };
  
  animate();
}
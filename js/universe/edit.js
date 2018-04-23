/* global THREE */
/* global TWEEN */
/* global SphericalLoading */

// Background
document.body.style.background = `radial-gradient(#09123b, #03020a)`;

// Sideways tracking controls container
const container = document.createElement('div');
document.body.appendChild(container);

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// SidewayTrackingControls
const sidewaysTrackingControls = new THREE.SidewaysTrackingControls(camera, container);
const clock = new THREE.Clock();
const toggleSidewaysTrackingControls = activate => {
	sidewaysTrackingControls.movementSpeed = activate ? FLY_CONTROLS_MOVEMENT_SPEED : 0;
};
toggleSidewaysTrackingControls(true);

const focusedStar = document.getElementById('focused-star');

const ignoreZ = vector => {
  return new THREE.Vector3(vector.x, vector.y, 0);
};

// Raycaster
const raycaster = new THREE.Raycaster();
//raycaster.near = RAYCASTER_NEAR;
//raycaster.far = RAYCASTER_FAR;
let intersected; // save the previously intersected object
const mouse = new THREE.Vector2();
// Update mouse position for raycasting
window.addEventListener('mousemove', event => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}, false);

// Focus
let focusedSprite;

// Constellation
const texts = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
const constellation = new Constellation(texts, data.mamuka[1], scene, -15, 3);

// Animate and Render
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
  TWEEN.update();
  sidewaysTrackingControls.update(clock.getDelta());
  
  raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children);
	// Hover event
	if (intersects[0]) { // When something is hovered
	  if (!intersected || intersects[0].object != intersected.object) { // When something has started to be hovered
	    const star = constellation.getStarBySprite(intersects[0].object);
	    console.log(star);
	    if (star && star instanceof ChildStar) {star.startBob()}
	  }
	  if (intersected && intersects[0].object != intersected.object) { // When something is unhovered
	    const star = constellation.getStarBySprite(intersected.object);
	    if (star && star instanceof ChildStar) {star.stopBob()}
	  }
	} else if (intersected) { // When something is unhovered
	  const star = constellation.getStarBySprite(intersected.object);
	  if (star && star instanceof ChildStar) {star.stopBob()}
	}
	/*
	if ((intersects[0] ? intersects[0].sprite : intersects[0]) != (intersected ? intersected.sprite : intersected)) {
	  console.log(intersected, intersects[0]);
	  intersects[0] && (star = constellation.getStarBySprite(intersects[0].sprite)) && star.startBob();
	  intersected && (star = constellation.getStarBySprite(intersected.sprite)) && star.stopBob();
  }*/
	
// 	if (intersects[0] && intersects[0] != intersected) { // New object is hovered
// 	  intersected && constellation.getStarBySprite(intersected).stopBob();
// 	  if (star = constellation.getStarBySprite(intersects[0])) {
// 	    star.startBob();
// 	  }
// 	}
// 	if (!intersects[0] && intersected) { // Object is unhovered
// 	  if ()
// 	}
	
	
  // if (!focusedSprite) {
  // 	if (intersected && intersected != intersects[0]) {
  // 		//intersected.object.material.color.set(DEFAULT_SPRITE_COLOR); // Reset the previously hovered sprite's color
  // 		focusedStar.style.transform = `scale(0)`;
  // 	}
		// if (intersects[0]) {
		//   focusedStar.style.transform = `scale(1)`;
		  
		// }
		// renderer.domElement.style.cursor = intersects[0] ? 'pointer' : 'default';
  // }
  intersected = intersects[0];
  
	renderer.render(scene, camera);
};

animate();
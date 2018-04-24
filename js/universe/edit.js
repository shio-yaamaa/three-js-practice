/* global THREE */
/* global TWEEN */
/* global SphericalLoading */

const createEditRendering = () => { // Created this function to avoid polluting the global frame
  
  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  // Use it later
  const ignoreZ = vector => {
    return new THREE.Vector3(vector.x, vector.y, 0);
  };
  
  // Raycaster
  const raycaster = new THREE.Raycaster();
  let intersected; // save the previously intersected object
  const mouse = new THREE.Vector2();
  // Update mouse position for raycasting
  const mousemoveListener = event => {
  	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  
  // Focus
  let focusedSprite;
  
  // Render
  const render = () => {
    TWEEN.update();
    
    raycaster.setFromCamera(mouse, camera);
  	const intersects = raycaster.intersectObjects(scene.children);
  	// Hover event
  	/*if (intersects[0]) { // When something is hovered
  	  if (!intersected || intersects[0].object != intersected.object) { // When something has started to be hovered
  	    const star = constellation.getStarBySprite(intersects[0].object);
  	    if (star && star instanceof ChildStar) {star.hover()}
  	  }
  	  if (intersected && intersects[0].object != intersected.object) { // When something is unhovered
  	    const star = constellation.getStarBySprite(intersected.object);
  	    if (star && star instanceof ChildStar) {star.unhover()}
  	  }
  	} else if (intersected) { // When something is unhovered
  	  const star = constellation.getStarBySprite(intersected.object);
  	  if (star && star instanceof ChildStar) {star.unhover()}
  	}*/
  	Rendering.renderer.domElement.style.cursor = intersects[0] ? 'pointer' : 'default';
    intersected = intersects[0];
  };
  
  const rendering = new Rendering(
    scene,
  	camera,
  	null,//THREE.SidewaysTrackingControls,
  	null,//[{key: 'movementSpeed', value: FLY_CONTROLS_MOVEMENT_SPEED}],
  	render
  );
  rendering.addEventListeners([{type: 'mousemove', listener: mousemoveListener}]);
  
  return rendering;
};

const editRendering = createEditRendering();
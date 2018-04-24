// Update mouse position for raycasting
const mousemoveListener = event => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const mousedownListener = event => {
  if (intersected && intersected.object === focusedSprite) { // If the zoomed object is clicked, do nothing
    return;
  }
  
  if (focusedSprite){ // zoom out
    zoom(false);
    focusedSprite = null;
    
    hideZoomMenu();
  } else if (intersected){ // zoom in
    focusedSprite = intersected.object;
  	focusedSprite.material.color.set(DEFAULT_SPRITE_COLOR);
  	renderer.domElement.style.cursor = 'default';
    cameraPositionBeforeFocus = camera.position.clone();
    cameraQuaternionBeforeFocus = camera.quaternion.clone();
    zoom(true);
    
    showZoomMenu(focusedSprite.mamukType, focusedSprite.mamukData);
  }
};

let wheelTimer;
const wheelListener = event => {
  // Wheel event
  renderer.domElement.addEventListener('wheel', event => {
  	if (focusedSprite) { return; }
  	
  	flyControls.moveState.forward = event.wheelDelta > 0 ? 1 : 0;
  	flyControls.moveState.back = event.wheelDelta > 0 ? 0 : 1;
  	flyControls.updateMovementVector();
  	
  	clearTimeout(wheelTimer);
  	wheelTimer = setTimeout(() => {
  		flyControls.moveState.forward = 0;
  		flyControls.moveState.back = 0;
  		flyControls.updateMovementVector();
  	}, 200);
  });
};

// Window adjustments
const resizeListener = event => {
  camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
};

const mouseleaveListener = event => {
  universeRendering.toggleCameraControls(false);
};

const mouseenterListener = event => {
  focusedSprite || universeRendering.toggleCameraControls(true);
}
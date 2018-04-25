/*// Window listeners

// Resize window
window.addEventListener('resize', () => {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  View.renderer.setSize(window.innerWidth, window.innerHeight);
});

//Toggle controls when mouse leaves window
window.addEventListener('mouseleave', () => {
  this.toggleCameraControls(false);
});
window.addEventListener('mouseenter', () => {
  if (!this.isInFocus){
    focusedSprite || this.toggleCameraControls(true);
  }
});*/
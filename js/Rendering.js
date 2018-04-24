/* global THREE */

class Rendering {
  constructor(scene, camera, cameraControlsClass, cameraControlsDefaultProperties, renderFunction) {
    if (!Rendering.renderer) {
      console.log('Set the renderer before creating any Rendering object!');
    }
    
    this.scene = scene;
    this.camera = camera;
    this.cameraControls;
    this.cameraControlsClass = cameraControlsClass;
    this.cameraControlsDefaultProperties = cameraControlsDefaultProperties; // [{key: 'movementSpeed', value: 20}, ...]
    this.clock = new THREE.Clock();
    this.renderFunction = renderFunction; // Do not call renderer.render and cameraControls.update()
    this.requestAnimationFrameId = null;
    this.eventListeners = [];
  }
  
  start() {
    Rendering.currentRendering && Rendering.currentRendering.stop();
    
    this.setCameraControls();
    const animate = () => {
      this.requestAnimationFrameId = requestAnimationFrame(animate);
      this.cameraControls && this.cameraControls.update(this.clock.getDelta());
      this.renderFunction();
      Rendering.renderer.render(this.scene, this.camera);
    };
    animate();
    
    Rendering.currentRendering = this;
  }
  
  stop() { // Don't need to be explicitly called when switching Renderings
    // Stop tweens?
    this.cameraControls && this.cameraControls.dispose();
    this.requestAnimationFrameId && cancelAnimationFrame(this.requestAnimationFrameId);
    this.requestAnimationFrameId = null;
    this.eventListeners.forEach(eventListener => {
      Rendering.renderer.domElement.removeEventListener(eventListener.type, eventListener.function);
    });
    Rendering.currentRendering = null;
  }
  
  setCameraControls() {
    if (this.cameraControlsClass) {
      this.cameraControls = new this.cameraControlsClass(this.camera);
    }
  }
  
  toggleCameraControls(toBeActive) {
    if (this.cameraControls) {
      this.cameraControlsDefaultProperties.forEach(property => {
        this.cameraControls[property.key] = toBeActive ? property.value : 0;
      });
    }
  }
  
  // listeners: [{type: 'mousemove', listener: function}, {type: 'mousedown', listener: function}, ...]
  addEventListeners(eventListeners) {
    eventListeners.forEach(eventListener => {
      this.eventListeners.push(eventListener);
      Rendering.renderer.domElement.addEventListener(eventListener.type, event => eventListener.listener(event));
    });
  }
}

Rendering.currentRendering = null;
Rendering.setRenderer = renderer => {Rendering.renderer = renderer};
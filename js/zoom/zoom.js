const computeMarginToSprite = (screenWidth, screenHeight, spriteWidth, spriteHeight, maxRatio) => {
  const visibleHeight = (spriteWidth / screenWidth > spriteHeight / screenHeight)
  	? (spriteWidth / maxRatio) / camera.aspect
  	: spriteHeight / maxRatio;
  return visibleHeight / (2 * Math.tan(THREE.Math.degToRad(camera.fov) / 2));
};

const zoom = zoomIn => {
  const tweenValues = {};
  const tweenTarget = {};
  
  universeRendering.toggleCameraControls(!zoomIn);
  focusedSprite.material.opacity = zoomIn ? 1 : VISITED_SPRITE_OPACITY;
  
  // Camera settings
  const marginToSprite = computeMarginToSprite(
  	renderer.getSize().width, renderer.getSize().height,
  	focusedSprite.scale.x, focusedSprite.scale.y,
  	FOCUSED_SPRITE_WINDOW_RATIO
  );
  camera.near = zoomIn ? marginToSprite * 0.8 : DEFAULT_CAMERA_NEAR;
  camera.updateProjectionMatrix();
  
  // Make the fog denser; the fog should not affect the focused sprite
  focusedSprite.material.fog = !zoomIn;
  tweenValues.fogNear = scene.fog.near;
  tweenValues.fogFar = scene.fog.far;
  tweenTarget.fogNear = zoomIn ? FOG_NEAR_IN_FOCUS_MODE : DEFAULT_FOG_NEAR;
  tweenTarget.fogFar = zoomIn ? FOG_FAR_IN_FOCUS_MODE : DEFAULT_FOG_FAR;
  
// Move the camera
  const distance = new THREE.Vector3().subVectors(
  	zoomIn ? focusedSprite.position : cameraPositionBeforeFocus,
  	camera.position
  );
  const margin = zoomIn
  	? distance.clone().normalize().multiplyScalar(marginToSprite)
  	: new THREE.Vector3();
  const targetPos = new THREE.Vector3().addVectors(
  	camera.position,
  	new THREE.Vector3().subVectors(distance, margin)
  );
  Object.assign(tweenValues, {posX: camera.position.x, posY: camera.position.y, posZ: camera.position.z});
  Object.assign(tweenTarget, {posX: targetPos.x, posY: targetPos.y, posZ: targetPos.z});

// Rotate the camera
const originalQuaternion = camera.quaternion.clone();
let destinationQuaternion;
if (zoomIn) {
    const tempCamera = camera.clone();
    tempCamera.lookAt(focusedSprite.position);
    destinationQuaternion = tempCamera.quaternion.clone();
} else {
	destinationQuaternion = cameraQuaternionBeforeFocus;
}
tweenValues.slerpT = 0;
tweenTarget.slerpT = 1;
let slerpedQuaternion = new THREE.Quaternion();

// Tween everything
  const tween = new TWEEN.Tween(tweenValues)
  	.to(tweenTarget, zoomIn ? ZOOMIN_DURATION : ZOOMOUT_DURATION)
  	.easing(TWEEN.Easing.Quartic.Out)
  	.onUpdate(() => {
  		// Fog
  		scene.fog.near = tweenValues.fogNear;
  		scene.fog.far = tweenValues.fogFar;
  		
  		// Position
  		camera.position.set(tweenValues.posX, tweenValues.posY, tweenValues.posZ);
  		
  		// Quaternion
  		THREE.Quaternion.slerp(originalQuaternion, destinationQuaternion, slerpedQuaternion, tweenValues.slerpT);
  		camera.setRotationFromQuaternion(slerpedQuaternion.normalize());
  	});
  ongoingFocusTween && ongoingFocusTween.stop();
  ongoingFocusTween = tween;
  tween.start();
};
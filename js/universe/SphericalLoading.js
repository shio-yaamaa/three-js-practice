/* global THREE */

class SphericalLoading {
  constructor(scene, spawnRadius, viewRadius, initialSphereCenter, spriteCount) {
    this.scene = scene;
    this.spawnRadius = spawnRadius;
    this.viewRadius = viewRadius;
    this.previousSphereCenter = initialSphereCenter;
    this.spriteCount = spriteCount;
    this.geometry = new THREE.SphereGeometry(0.3, 6, 6);
  }
  
  randomPositionInSquare(position, radius) {
  	return new THREE.Vector3(
  		THREE.Math.randFloatSpread(radius * 2) + position.x,
  		THREE.Math.randFloatSpread(radius * 2) + position.y,
  		THREE.Math.randFloatSpread(radius * 2) + position.z
  	);
  }
  
  addSprites(currentCameraPosition) {
		for (let i = 0; i < this.spriteCount; i++) {
			const randomPosition = this.randomPositionInSquare(currentCameraPosition, this.spawnRadius);
			if (randomPosition.distanceTo(currentCameraPosition) > this.spawnRadius
				|| randomPosition.distanceTo(this.previousSphereCenter) < this.spawnRadius) { // condition to reject
				continue;
			}
      const frameCount = 8;
		  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({color: 0xffffff, fog: true}));
    	sprite.scale.set(4, 4, 1);
		  Object.assign(sprite.position, randomPosition);
		  this.scene.add(sprite);
		}
  }
  
  removeSprites(currentCameraPosition) {
		this.scene.children.forEach(element => {
			if (element.position.distanceTo(currentCameraPosition) > this.spawnRadius) {
				this.scene.remove(element);
			}
		});
  }
  
  update(currentCameraPosition) {
  	if (currentCameraPosition.distanceTo(this.previousSphereCenter) > this.viewRadius) {
  	  const asyncAddSprites = () => {
      	return new Promise((resolve, reject) => {
        	this.addSprites(currentCameraPosition);
        	console.log('add sprites done');
        	resolve();
        });
      };
      asyncAddSprites().then(() => {
      	this.removeSprites(currentCameraPosition);
      	console.log('remove sprites done');
      	Object.assign(this.previousSphereCenter, currentCameraPosition);
      });
  	}
  }
}
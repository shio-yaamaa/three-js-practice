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
  
  randomPositionInSquare (position, radius) {
  	return new THREE.Vector3(
  		THREE.Math.randFloatSpread(radius * 2) + position.x,
  		THREE.Math.randFloatSpread(radius * 2) + position.y,
  		THREE.Math.randFloatSpread(radius * 2) + position.z
  	);
  }
  
  addSprites (currentCameraPosition) {
		for (let i = 0; i < this.spriteCount; i++) {
			const randomPosition = this.randomPositionInSquare(currentCameraPosition, this.spawnRadius);
			if (randomPosition.distanceTo(currentCameraPosition) > this.spawnRadius
				|| randomPosition.distanceTo(this.previousSphereCenter) < this.spawnRadius) { // condition to reject
				continue;
			}
		  const material = new THREE.MeshBasicMaterial({
		  	color: parseInt(Math.floor(Math.random() * (16 ** 6)).toString(16), 16),
		  	fog: false
		  });
		  const sphere = new THREE.Mesh(this.geometry, material);
		  Object.assign(sphere.position, randomPosition);
		  this.scene.add(sphere);
		}
  }
  
  removeSprites (currentCameraPosition) {
    console.log(this.scene.children.length);
		this.scene.children.forEach(element => {
			if (element.position.distanceTo(currentCameraPosition) > this.spawnRadius) {
				this.scene.remove(element);
			}
		});
		console.log(this.scene.children.length);
		/*
		console.log(currentCameraPosition);
		console.log(this.scene.children.map(element => {
		  if (element.position.distanceTo(currentCameraPosition) > this.spawnRadius) {
		    return element.position;
		  }
		}));*/
  }
  
  update(currentCameraPosition) {
  	if (currentCameraPosition.distanceTo(this.previousSphereCenter) > this.viewRadius) {
  		console.log('Sphere changed');
  		this.addSprites(currentCameraPosition);
  		this.removeSprites(currentCameraPosition);
  		Object.assign(this.previousSphereCenter, currentCameraPosition);
  	}
  }
}
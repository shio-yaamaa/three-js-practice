/* global THREE */
/* global data */

class SphericalLoading {
  constructor(scene, spawnRadius, viewRadius, initialSphereCenter, spriteCount) {
    this.scene = scene;
    this.spawnRadius = spawnRadius;
    this.viewRadius = viewRadius;
    this.previousSphereCenter = initialSphereCenter;
    this.spriteCount = spriteCount;
    this.geometry = new THREE.SphereGeometry(0.3, 6, 6);
    
    this.textureLoader = new THREE.TextureLoader();
  }
  
  randomPositionInCube(position, radius) {
  	return new THREE.Vector3(
  		THREE.Math.randFloatSpread(radius * 2) + position.x,
  		THREE.Math.randFloatSpread(radius * 2) + position.y,
  		THREE.Math.randFloatSpread(radius * 2) + position.z
  	);
  }
  
  createTexture(sprite, character) {
    return this.textureLoader.load(
      character.image,
      texture => {
        const isBoundByWidth = texture.image.width >= texture.image.height;
        sprite.scale.set(
          isBoundByWidth ? SPRITE_FRAME_DIMENSION : texture.image.width * (SPRITE_FRAME_DIMENSION / texture.image.height),
          isBoundByWidth ? texture.image.height * (SPRITE_FRAME_DIMENSION / texture.image.width) : SPRITE_FRAME_DIMENSION,
          1
        );
        this.scene.add(sprite);
      }
    );
  }
  
  createSpritesByInterval(currentCount, currentCameraPosition, previousSphereCenter) {
    for (let i = 0; i < 5; i++) {
      const randomPosition = this.randomPositionInCube(currentCameraPosition, this.spawnRadius);
  		if (randomPosition.distanceTo(currentCameraPosition) < this.spawnRadius
  			&& randomPosition.distanceTo(previousSphereCenter) > this.spawnRadius) {
  			const mamuka = data.mamuka[Math.floor(Math.random() * data.mamuka.length)];
  		  const sprite = new THREE.Sprite();
    	  const material = new THREE.SpriteMaterial({map: this.createTexture(sprite, mamuka), fog: true});
    	  
    	  // Plane
    	  //const sprite = new THREE.Mesh(new THREE.PlaneGeometry(1, 1));
    	  //this.scene.add(sprite);
    	  //const material = new THREE.MeshBasicMaterial({map: this.createTexture(sprite, mamuka), transparent: true, side: THREE.DoubleSide});
    	  
    	  sprite.material = material;
    	  sprite.mamukType = 'mamuka';
    	  sprite.mamukData = mamuka;
    	  sprite.position.copy(randomPosition);
    	  
    	  sprite.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
  		}
    }
    if (currentCount < this.spriteCount) {
      setTimeout(() => this.createSpritesByInterval(currentCount + 5, currentCameraPosition, previousSphereCenter), 1);
    }
  }
  
  createSprites(currentCameraPosition) {
		this.createSpritesByInterval(0, currentCameraPosition, this.previousSphereCenter.clone());
		/*
    const worker = new Worker('js/universe/SphericalLoadWorker.js');
    worker.addEventListener('message', function(e) {
      //console.log('received ', e.data);
    }, false);
    worker.postMessage(JSON.stringify(this.scene));
    */
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
  	  this.createSprites(currentCameraPosition);
      this.removeSprites(currentCameraPosition);
      Object.assign(this.previousSphereCenter, currentCameraPosition);
  	}
  }
}
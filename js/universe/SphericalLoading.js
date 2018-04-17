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
          isBoundByWidth ? SPRITE_MAX_DIMENSION : texture.image.width * (SPRITE_MAX_DIMENSION / texture.image.height),
          isBoundByWidth ? texture.image.height * (SPRITE_MAX_DIMENSION / texture.image.width) : SPRITE_MAX_DIMENSION
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
  			const character = data.characters[Math.floor(Math.random() * data.characters.length)];
  			const sprite = new THREE.Sprite();
    	  const material = new THREE.SpriteMaterial({map: this.createTexture(sprite, character), fog: true});
    	  sprite.material = material;
    	  sprite.mamukType = 'character';
    	  sprite.mamukData = character;
    	  Object.assign(sprite.position, randomPosition);
  		}
    }
    if (currentCount < this.spriteCount) {
      setTimeout(() => this.createSpritesByInterval(currentCount + 5, currentCameraPosition, previousSphereCenter), 1);
    }
  }
  
  createSprites(currentCameraPosition) {
		this.createSpritesByInterval(0, currentCameraPosition, this.previousSphereCenter.clone());
		//workerオブジェクト
    const worker = new Worker('js/universe/SphericalLoadWorker.js');
  
    //処理結果、受信イベント
    worker.addEventListener('message', function(e) {
      //console.log('received ', e.data);
    }, false);
  
    //処理命令
    worker.postMessage(JSON.stringify(this.scene));
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
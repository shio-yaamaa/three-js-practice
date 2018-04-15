/* global THREE */

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
  
  randomPositionInSquare(position, radius) {
  	return new THREE.Vector3(
  		THREE.Math.randFloatSpread(radius * 2) + position.x,
  		THREE.Math.randFloatSpread(radius * 2) + position.y,
  		THREE.Math.randFloatSpread(radius * 2) + position.z
  	);
  }
  
  createTexture(sprite) {
    const characterIndex = Math.floor(Math.random() * data.characters.length);
    return this.textureLoader.load(
      data.characters[characterIndex].image,
      texture => {
        const isBoundByWidth = texture.image.width >= texture.image.height;
        sprite.scale.set(
          isBoundByWidth ? SPRITE_MAX_DIMENSION : texture.image.width * (SPRITE_MAX_DIMENSION / texture.image.height),
          isBoundByWidth ? texture.image.height * (SPRITE_MAX_DIMENSION / texture.image.width) : SPRITE_MAX_DIMENSION
        );
      }
    );
  }
  
  createSingleSprite(index, currentCameraPosition, previousSphereCenter) {
    const randomPosition = this.randomPositionInSquare(currentCameraPosition, this.spawnRadius);
		if (randomPosition.distanceTo(currentCameraPosition) < this.spawnRadius
			&& randomPosition.distanceTo(previousSphereCenter) > this.spawnRadius) {
			const sprite = new THREE.Sprite();
  	  const material = new THREE.SpriteMaterial({map: this.createTexture(sprite)/*, fog: true*/});
  	  sprite.material = material;
  	  Object.assign(sprite.position, randomPosition);
  	  this.scene.add(sprite);
		}
    if (index < this.spriteCount) {
      //this.createSingleSprite(index + 1, currentCameraPosition, previousSphereCenter);
      setTimeout(() => this.createSingleSprite(++index, currentCameraPosition, previousSphereCenter), 1);
    } else {
      console.log('●');
    }
  }
  
  createSprites(currentCameraPosition) {
    console.log('○');
    //const previousSphereCenter = this.previousSphereCenter;
		this.createSingleSprite(0, currentCameraPosition, Object.assign({}, this.previousSphereCenter));
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
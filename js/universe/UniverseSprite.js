/* global THREE */

class UniverseSprite extends THREE.Sprite {
  constructor(imageName, spriteMaxDimension) {
    super(new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load(
  			imageName,
  			texture => {
  				const textureMaxDimension = Math.max(texture.image.height, texture.image.width);
          textureMaxDimension === texture.image.width
            ? this.scale.set(spriteMaxDimension, spriteMaxDimension * (texture.image.height / textureMaxDimension), 1)
            : this.scale.set(spriteMaxDimension * (texture.image.width / textureMaxDimension), spriteMaxDimension, 1);
  			}
  		),
  		fog: true
    }));
  }
  
  addToScene(scene) {
    this.scene = scene;
    scene.add(this);
  }
  
  removeFromScene() {
    // Stop all animations and timers
    
    this.scene.remove(this);
  }
}
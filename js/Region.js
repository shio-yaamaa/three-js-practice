/* global THREE */

class Region {
  constructor(scene, position, size, spriteCount) {
    this.scene = scene;
    this.position = position;
    this.sprites = this.createSprites(scene, position, size, spriteCount);
    this.shouldRemain = true;
  }
  createSprites(scene, position, size, spriteCount) {
    const sprites = [];
    const sphereGeometry = new THREE.SphereGeometry(1, 6, 6);
  	for (let i = 0; i < spriteCount; i++) {
  		const material = new THREE.MeshBasicMaterial({
  			color: parseInt(Math.floor(Math.random() * (16 ** 6)).toString(16), 16),
  			fog: false
  		});
  		const sphere = new THREE.Mesh(sphereGeometry, material);
  		sphere.position.set(
  			Math.random() * size + position.x,
  			Math.random() * size + position.y,
  			Math.random() * size + position.z
  		);
  		scene.add(sphere);
  		sprites.push(sphere);
  	}
  	return sprites;
  }
  remove() {
    this.sprites.forEach(sprite => {
      this.scene.remove(sprite);
    });
  }
  updateNextRegions(nextRegions) {
    
  }
}
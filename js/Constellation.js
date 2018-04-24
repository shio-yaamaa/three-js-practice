/* global THREE */

class Constellation {
  constructor(texts, mamuka, scene, camera, z, layerThickness, color) {
    this.scene = scene;
    this.z = z;
    this.color = color;
    
    // Stars
    this.root = new RootStar(scene, camera, mamuka, new THREE.Vector3().setZ(z), this.color);
    this.stars = [this.root];
    this.layerThickness = layerThickness;
    
    this.addLayer(0, texts.length);
  }
  
  addLayer(layerIndex, remainingStarCount) {
    const defaultStarCountInLayer = Math.floor(3 + layerIndex * 6);
    const starCountInLayer = Math.min(defaultStarCountInLayer, remainingStarCount); // Randomize??
    const innerRadius = this.root.radius + this.layerThickness * layerIndex;
    const sectionAngle = Math.PI * 2 / defaultStarCountInLayer;
    
    for (let i = 0; i < starCountInLayer; i++) {
      // Set position
      const radius = THREE.Math.randFloat(innerRadius, innerRadius + this.root.radius);
      const theta = THREE.Math.randFloat(sectionAngle * i, sectionAngle * (i + 1));
      const x = Math.sin(theta) * radius;
      const y = Math.cos(theta) * radius;
      const z = this.z; // Needs to be randomized, but should not be taken into consideration when calculating the distance between two stars
      const position = new THREE.Vector3(x, y, z);
      
      // Choose a parent
      const parent = layerIndex === 0 ? this.root : this.stars.reduce((accumulator, parentCandidate) => {
        const isAccumulatorCloser = accumulator
          && accumulator.sprite.position.distanceTo(position)
            < parentCandidate.sprite.position.distanceTo(position);
        return isAccumulatorCloser ? accumulator : parentCandidate;
      });
      
      const star = new ChildStar('', this.scene, this.root, parent, position, this.color);
      parent && parent.children.push(star);
      this.stars.push(star);
    }
    if (remainingStarCount - starCountInLayer > 0) {
      this.addLayer(layerIndex + 1, remainingStarCount - starCountInLayer);
    }
  }
  
  addStar(text, position) {}
  
  getStarBySprite(sprite) {
    for (const star of this.stars) {
      if (star.sprite === sprite) {
        return star;
      }
    }
    return null;
  }
  
  show() {
    this.root.show();
  }
  
  close(callback) {
    this.stars.forEach(star => star.hide());
    callback();
  }
}
/* global THREE */

class Constellation {
  constructor(texts, mamuka, scene, z, layerThickness) {
    this.scene = scene;
    this.z = z;
    
    // Stars
    this.stars = [new RootStar(scene, mamuka, new THREE.Vector3().setZ(z))];
    this.layerThickness = layerThickness;
    
    // test
    this.texts = texts;
    
    this.addLayer(0, texts.length);
    this.show();
  }
  
  addLayer(layerIndex, remainingStarCount) {
    const defaultStarCountInLayer = Math.floor(3 + layerIndex * 6);
    const starCountInLayer = Math.min(defaultStarCountInLayer, remainingStarCount); // Randomize??
    const innerRadius = this.stars[0].radius + this.layerThickness * layerIndex;
    const sectionAngle = Math.PI * 2 / defaultStarCountInLayer;
    
    for (let i = 0; i < starCountInLayer; i++) {
      this.texts.splice(0, 1);
      // Set position
      const radius = THREE.Math.randFloat(innerRadius, innerRadius + this.stars[0].radius);
      const theta = THREE.Math.randFloat(sectionAngle * i, sectionAngle * (i + 1));
      const x = Math.sin(theta) * radius;
      const y = Math.cos(theta) * radius;
      const z = this.z; // Needs to be randomized, but should not be taken into consideration when calculating the distance between two stars
      const position = new THREE.Vector3(x, y, z);
      
      // Choose a parent
      const parent = layerIndex === 0 ? this.stars[0] : this.stars.reduce((accumulator, parentCandidate) => {
        const isAccumulatorCloser = accumulator
          && accumulator.sprite.position.distanceTo(position)
            < parentCandidate.sprite.position.distanceTo(position);
        return isAccumulatorCloser ? accumulator : parentCandidate;
      });
      
      const star = new ChildStar('', this.scene, parent, position);
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
    for (let i = 0; i < 3; i++) {
      this.stars[i].show();
    }
  }
}
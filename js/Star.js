class Star {
  constructor() {}
}

class RootStar extends Star {
  constructor(scene, mamuka, position) {
    super();
    this.mamuka = mamuka;
    this.children = [];
    this.radius;
    this.sprite = this.createSprite(scene, mamuka, position);
  }
  
  createSprite(scene, mamuka, position) {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({map: new THREE.TextureLoader().load(mamuka.image), color: 0xffffff})
    );
    sprite.position.set(position.x, position.y, position.z);
    sprite.scale.set(5, 5, 1);
    scene.add(sprite);
    this.radius = sprite.scale.x / 2 * Math.sqrt(2);
    return sprite;
  }
  
  show() {
    this.children.forEach(child => child.show());
  }
}

class ChildStar extends Star {
  constructor(text, scene, parent, position) {
    super();
    this.text = text;
    this.sprite = this.createSprite(scene, position);
    this.parent = parent; // Can be null
    this.children = [];
    //this.generation = parent.generation + 1; // iranakune???
    this.line = this.createLine(scene, parent.sprite.position, position);
    this.lineEnd;
    
    // Bob Animation
    this.originalPosition = position;
    this.currentBobTweens = [];
  }
  
  createSprite(scene, position) {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({map: Star.starTexture, color: 0xffffff})
    );
    sprite.position.set(position.x, position.y, position.z);
    sprite.visible = false;
    scene.add(sprite);
    return sprite;
  }
  
  createLine(scene, parentPosition, childPosition) {
    const lineGeometry = new THREE.Geometry();
    const start = parentPosition.clone();
    const end = childPosition.clone();
    const distanceVector = new THREE.Vector3().subVectors(end, start);
    const startCorrection = distanceVector.clone().normalize().multiplyScalar(
      this.parent instanceof RootStar ? this.parent.radius : 0.3
    );
    const endCorrection = distanceVector.clone().normalize().multiplyScalar(0.3);
    const correctedStart = new THREE.Vector3().addVectors(start, startCorrection);
    const correctedEnd = new THREE.Vector3().subVectors(end, endCorrection);
    this.lineEnd = correctedEnd;
    lineGeometry.vertices.push(correctedStart.clone(), correctedStart.clone());
    const line = new THREE.Line(lineGeometry, Star.lineMaterial);
    scene.add(line);
    
    return line;
  }
  
  show() {
    const lineTween = new TWEEN.Tween(this.line.geometry.vertices[1])
      .to(this.lineEnd, 300)
      .onUpdate(() => {
        this.line.geometry.verticesNeedUpdate = true;
      })
      .onComplete(() => {
        this.sprite.visible = true;
        this.children.forEach(child => child.show());
      })
      .start();
  }
  
  startBob() {
    this.stopBob();
    const bobUpTween = new TWEEN.Tween(this.sprite.position)
      .to(this.originalPosition.clone().setY(this.originalPosition.y + 0.2), 300);
    const bobDownTween = new TWEEN.Tween(this.sprite.position)
      .to(this.originalPosition.clone().setY(this.originalPosition.y - 0.2), 300);
    bobUpTween.chain(bobDownTween);
    bobDownTween.chain(bobUpTween);
    bobUpTween.start();
    this.currentBobTweens.push(bobUpTween, bobDownTween);
  }
  
  stopBob() {
    this.currentBobTweens.forEach(bobTween => bobTween.stop());
    this.sprite.position.set(this.originalPosition.x, this.originalPosition.y, this.originalPosition.z);
    this.currentBobTweens = [];
  }
  
  remove() {}
}

Star.starTexture = new THREE.TextureLoader().load('img/star.png');
Star.lineMaterial = new THREE.LineBasicMaterial({color: 0xf0feff});
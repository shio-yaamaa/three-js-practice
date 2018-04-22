/* global THREE */
/* global TWEEN */
/* global SphericalLoading */

// Background
document.body.style.background = `radial-gradient(#09123b, #03020a)`;

// Sideways tracking controls container
const container = document.createElement('div');
document.body.appendChild(container);

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// SidewayTrackingControls
const sidewaysTrackingControls = new THREE.SidewaysTrackingControls(camera, container);
const clock = new THREE.Clock();
const toggleSidewaysTrackingControls = activate => {
	sidewaysTrackingControls.movementSpeed = activate ? FLY_CONTROLS_MOVEMENT_SPEED : 0;
};
toggleSidewaysTrackingControls(true);

const doTwoSquaresOverlap = (leftTop1, rightBottom1, leftTop2, rightBottom2) => {
  if (leftTop1[0] > rightBottom2[0] || leftTop2[0] > rightBottom1[0]) {
    return false;
  }
  if (leftTop1[1] > rightBottom2[1] || leftTop2[1] > rightBottom1[1]) {
    return false;
  }
  return true;
};

const starPlane = -20;
const mamukaSprite = new THREE.Sprite(
  new THREE.SpriteMaterial({map: new THREE.TextureLoader().load('img/mamuka/joy.png'), color: 0xffffff})
);
mamukaSprite.position.set(0, 0, starPlane);
mamukaSprite.scale.set(8, 8, 1);
scene.add(mamukaSprite);
console.log(mamukaSprite.position);
const mamukaXRange = [-4, 4];
const mamukaYRange = [-4, 4];

// Add stars
const starTexture = new THREE.TextureLoader().load('img/star.png');
const starGridSize = 5;
const starXRange = [-20, 20];
const starYRange = [-20, 20];
const starGenerateProbability = 1;
const stars = [];
const lineMaterial = new THREE.LineBasicMaterial({color: 0xf0feff});
for (let i = 0; i < (starXRange[1] - starXRange[0]) / starGridSize * (starYRange[1] - starYRange[0]) / starGridSize; i++) {
  if (Math.random() > starGenerateProbability) {
    continue;
  }
  const gridXIndex = i % ((starXRange[1] - starXRange[0]) / starGridSize);
  const gridYIndex = Math.floor(i / ((starYRange[1] - starYRange[0]) / starGridSize));
  console.log(gridXIndex, gridYIndex);
  const xPositionRange = [starXRange[0] + gridXIndex * starGridSize, starXRange[0] + (gridXIndex + 1) * starGridSize];
  const yPositionRange = [starYRange[0] + gridYIndex * starGridSize, starYRange[0] + (gridYIndex + 1) * starGridSize];
  if (doTwoSquaresOverlap(
    [xPositionRange[0], yPositionRange[0]], [xPositionRange[1], yPositionRange[1]],
    [mamukaXRange[0], mamukaYRange[0]], [mamukaXRange[1], mamukaYRange[1]])) {
    continue;
  }
  const xPosition = Math.random() * (xPositionRange[1] - xPositionRange[0]) + xPositionRange[0];
  const yPosition = Math.random() * (yPositionRange[1] - yPositionRange[0]) + yPositionRange[1];
  const zPosition = starPlane - Math.random();
  
  const star = new THREE.Sprite(
    new THREE.SpriteMaterial({map: starTexture, color: 0xffffff})
  );
  star.position.set(xPosition, yPosition, zPosition);
  scene.add(star);
  stars.push(star);
}

stars.forEach(star => {
  const nearerStars = stars.filter(nearerStarCandidate => { // nearerStars: stars that is closer to the origin than the current star is
    return nearerStarCandidate.position.length() < star.position.length();
  }); // If we use the closest nearer star as the parent, just use reduce
  let parent;
  if (nearerStars.length > 0) {
    parent = nearerStars.reduce((accumulator, currentStar) => {
      if (accumulator && accumulator.position.distanceTo(star.position) < currentStar.position.distanceTo(star.position)) {
        return accumulator;
      } else {
        return currentStar;
      }
    }, undefined);
  } else {
    parent = mamukaSprite;
  }
    
  // Create a line object
  const lineGeometry = new THREE.Geometry();
  const start = star.position.clone();
  const end = parent.position.clone();
  const clip = new THREE.Vector3().subVectors(end, start).clampLength(0.3, 0.3);
  lineGeometry.vertices.push(
  	new THREE.Vector3().addVectors(start, clip),
  	new THREE.Vector3().subVectors(end, clip)
  );
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
});

// Animate and Render
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
  TWEEN.update();
  sidewaysTrackingControls.update(clock.getDelta());
	renderer.render(scene, camera);
};

animate();
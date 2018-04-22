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

const ignoreZ = vector => {
  return new THREE.Vector3(vector.x, vector.y, 0);
};

// Constellation setup & Create MaMuka
const constellationPlane = -30;
const mamukaSprite = new THREE.Sprite(
  new THREE.SpriteMaterial({map: new THREE.TextureLoader().load('img/mamuka/joy.png'), color: 0xffffff})
);
mamukaSprite.position.set(0, 0, constellationPlane);
mamukaSprite.scale.set(8, 8, 1);
scene.add(mamukaSprite);
const mamukaRadius = 6;

// Star setup
const starLayerThickness = 5;
const starGenerateProbability = 1; // kesu???
/*
  {
    sprite: THREE.Sprite,
    parent: star object (null in the first layer),
    generation: Integer,
    line: THREE.Line,
    lineEnd: THREE.Vector3
  }
*/
const stars = []; 
const starCount = 80;
const starTexture = new THREE.TextureLoader().load('img/star.png');
const lineMaterial = new THREE.LineBasicMaterial({color: 0xf0feff});

const addLayer = (layerIndex, remainingStarCount) => {
  const starCountInLayer = Math.min(Math.floor(layerIndex + 3 + layerIndex * 5), remainingStarCount); // Randomize??
  const innerRadius = mamukaRadius + starLayerThickness * layerIndex;
  const sectionAngle = Math.PI * 2 / starCountInLayer;
  for (let i = 0; i < starCountInLayer; i++) {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({map: starTexture, color: 0xffffff})
    );
    sprite.visible = false;
    
    // Set position
    const radius = THREE.Math.randFloat(innerRadius, innerRadius + mamukaRadius);
    const theta = THREE.Math.randFloat(sectionAngle * i, sectionAngle * (i + 1));
    const x = Math.sin(theta) * radius;
    const y = Math.cos(theta) * radius;
    const z = constellationPlane; // Needs to be randomized, but should not be taken into consideration when calculating the distance between two stars
    sprite.position.set(x, y, z);
    scene.add(sprite);
    
    // Set parent
    let parent = null;
    let parentSprite;
    if (layerIndex === 0) {
      parentSprite = mamukaSprite;
    } else {
      parent = stars.reduce((accumulator, parentCandidate) => {
        const isAccumulatorCloser = accumulator
          && accumulator.sprite.position.distanceTo(sprite.position)
            < parentCandidate.sprite.position.distanceTo(sprite.position);
        return isAccumulatorCloser ? accumulator : parentCandidate;
      }, null);
      parentSprite = parent.sprite;
    }
    
    // Draw line
    const lineGeometry = new THREE.Geometry();
    const start = parentSprite.position.clone();
    const end = sprite.position.clone();
    const clip = new THREE.Vector3().subVectors(end, start).clampLength(0.3, 0.3);
    const clippedStart = new THREE.Vector3().addVectors(start, clip);
    const clippedEnd = new THREE.Vector3().subVectors(end, clip);
    lineGeometry.vertices.push(clippedStart.clone(), clippedStart.clone());
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    
    stars.push({
      sprite: sprite,
      parent: parent,
      generation: layerIndex === 0 ? 0 : (parent.generation + 1),
      line: line,
      lineEnd: clippedEnd
    });
  }
  if (remainingStarCount - starCountInLayer > 0) {
    addLayer(layerIndex + 1, remainingStarCount - starCountInLayer);
  }
};

addLayer(0, starCount);

// Star connections will look weird when a star get removed and its children get connected to their nearest neighbor.
// Should I avoid stars that belong to the same layer??

const showGeneration = generationIndex => {
  const starsOfGeneration = stars.filter(star => star.generation === generationIndex);
  starsOfGeneration.forEach((star, starIndex) => {
    const lineTween = new TWEEN.Tween(star.line.geometry.vertices[1])
      .to(star.lineEnd, 300)
      .onUpdate(() => {
        star.line.geometry.verticesNeedUpdate = true;
      })
      .onComplete(() => {
        star.sprite.visible = true;
        if (starIndex === 0) {
          showGeneration(generationIndex + 1);
        }
      })
      .start();
  });
};

showGeneration(0);

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
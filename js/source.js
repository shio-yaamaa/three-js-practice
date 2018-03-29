/* global THREE */
/* global TWEEN */

// fly controls container
const clock = new THREE.Clock();
const container = document.createElement('div');
document.body.appendChild(container);

// scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(scene.background, 0.02);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

let focusedSprite;

let previousCameraPosition;
let previousCameraQuaternion;

// fly controls
const flyControls = new THREE.FlyControls(camera, container);
let isFlyControlsActive = true;
flyControls.movementSpeed = 0;
flyControls.rollSpeed = Math.PI / 6;

// raycaster
const raycaster = new THREE.Raycaster();
raycaster.intersectObjects(THREE.Sprite);
const mouse = new THREE.Vector2();
let intersects = [];
let intersected;

// create and add sprites
const subwayImgNames = ['american', 'banana_peppers', 'black_forest_ham', 'black_olives', 'chipotle_southwest',
 'cucumbers', 'flatbread', 'green_peppers', 'italian', 'italian_bmt', 'italian_herbs_and_cheese',
 'jalapenos', 'lettuce', 'mayonnaise', 'meatball_marinara', 'monterey_cheddar', 'multi_grain_flatbread',
 'mustard', 'nine_grain_wheat', 'oil', 'oven_roasted_chicken', 'pickles', 'ranch', 'red_onions', 'spinach',
 'sweet_onion', 'sweet_onion_chicken_teriyaki', 'tomatoes', 'tuna', 'turkey_breast', 'vinaigrette', 'vinegar'];
const starImgNames = ['jupiter', 'moon'];
const spriteMaps = subwayImgNames.map(name => new THREE.TextureLoader().load(`img/${name}.png`));

for (let i = 0; i < 500; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
		map: spriteMaps[i % spriteMaps.length],
		//map: spriteMaps[Math.floor(Math.random() * spriteMaps.length)],
		color: 0xffffff,
		fog: true
	}));
	sprite.scale.set(3, 3);
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	scene.add(sprite);
}

// animate loop
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
	camera.updateProjectionMatrix();
	TWEEN.update();
  flyControls.update(clock.getDelta());
  
  // change the color of sprites that are under the mouse
  if (!focusedSprite) {
		raycaster.setFromCamera(mouse, camera);
		intersects = raycaster.intersectObjects(scene.children);
		
		// reset the sprite color
  	if (intersected && intersected != intersects[0]) {
  		intersected.object.material.color.set(0xffffff);
  	}
		
		// change the color
		intersected = intersects[0];
		intersected && intersected.object.material.color.set(0xe57373);
  }
	
	renderer.render(scene, camera);
};

animate();

// resize event
window.addEventListener('resize', event => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

// mousemove event
window.addEventListener('mousemove', event => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}, false);

// mousedown event
window.addEventListener('mousedown', event => {
	if (focusedSprite) {
		leaveFocusMode(focusedSprite);
		focusedSprite = null;
		return;
	}
	
	if (!intersects[0]) {
		return;
	}
	
	focusedSprite = intersects[0].object;
	enterFocusMode(focusedSprite);
});

const enterFocusMode = focusedSprite => {
	focusedSprite.material.color.set(0xffffff);
	
	// stop rolling
	flyControls.rollSpeed = 0;
	
	// make the fog denser
	// fog should not affect the focused sprite
	focusedSprite.material.fog = false;
	const fogForTween = {density: 0.03};
	const fogTween = new TWEEN.Tween(fogForTween).to({density: 0.2});
	fogTween.onUpdate(() => scene.fog.density = fogForTween.density);
	fogTween.start();
	
	// move the camera closer to the sprite
	previousCameraPosition = camera.position.clone();
	const cameraPosForTween = camera.position;
	const distance = focusedSprite.position.clone().sub(camera.position);
	const minus = distance.clone().multiplyScalar(3 / distance.length());
	console.log(minus.length());
	distance.sub(minus);
	const cameraPosTween = new TWEEN.Tween(cameraPosForTween)
		.to(cameraPosForTween.clone().add(distance), 1000)
		.easing(TWEEN.Easing.Quartic.Out);
	cameraPosTween.start();
	
	// lookAt
	previousCameraQuaternion = camera.quaternion.clone();
	const m4 = new THREE.Matrix4();
	m4.lookAt(camera.position, focusedSprite.position, camera.up);
	const targetCameraQuaternion = applyRotationMatrix(m4);
	
	// tween lookAt and zoom
	/*const cameraForTween = {
		zoom: camera.zoom,
		_w: camera.quaternion._w, _x: camera.quaternion._x, _y: camera.quaternion._y, _z: camera.quaternion._z
	};
	const cameraTarget = {
		zoom: camera.zoom * 2,
		_w: targetCameraQuaternion._w, _x: targetCameraQuaternion._x, _y: targetCameraQuaternion._y, _z: targetCameraQuaternion._z
	}
	const cameraTween = new TWEEN.Tween(cameraForTween)
		.to(cameraTarget, 1000)
		.easing(TWEEN.Easing.Quartic.Out);
	cameraTween.onUpdate(() => {
		console.log('updated');
    camera.zoom = cameraTween.zoom;
    camera.quaternion._w = cameraForTween._w;
    camera.quaternion._x = cameraForTween._x;
    camera.quaternion._y = cameraForTween._y;
    camera.quaternion._z = cameraForTween._z;
	});
	cameraTween.start();*/
};

const leaveFocusMode = focusedSprite => {
	focusedSprite.material.color.set(0xffffff);
	
	// resume rolling
	flyControls.rollSpeed = Math.PI / 6;
		
	// reset the fog
	if (focusedSprite) {
		focusedSprite.material.fog = true;
	}
	scene.fog.density = 0.03;
	
	// move the camera back to the original position
	const cameraPosForTween = camera.position;
	const cameraPosTween = new TWEEN.Tween(cameraPosForTween)
		.to(previousCameraPosition, 1000)
		.easing(TWEEN.Easing.Quartic.Out);
	cameraPosTween.start();
	
	// go back to the original quaternion
	const cameraRotationTween = new TWEEN.Tween(camera.quaternion)
		.to(previousCameraQuaternion, 1000)
		.easing(TWEEN.Easing.Quartic.Out);
	//cameraRotationTween.start();
};

renderer.domElement.addEventListener('mouseleave', () => {
	flyControls.rollSpeed = 0;
});
renderer.domElement.addEventListener('mouseenter', () => {
	if (!focusedSprite) {
		flyControls.rollSpeed = Math.PI / 5;
	}
});


const applyRotationMatrix = matrix => {
	const rotation = {};
	
	const m11 = matrix.elements[0], m12 = matrix.elements[4], m13 = matrix.elements[8],
				m21 = matrix.elements[1], m22 = matrix.elements[5], m23 = matrix.elements[9],
				m31 = matrix.elements[2], m32 = matrix.elements[6], m33 = matrix.elements[10];

	const trace = m11 + m22 + m33;
	let s;

	if (trace > 0) {
		s = 0.5 / Math.sqrt( trace + 1.0 );
		rotation._w = 0.25 / s;
		rotation._x = ( m32 - m23 ) * s;
		rotation._y = ( m13 - m31 ) * s;
		rotation._z = ( m21 - m12 ) * s;
	} else if ( m11 > m22 && m11 > m33 ) {
		s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );
		rotation._w = ( m32 - m23 ) / s;
		rotation._x = 0.25 * s;
		rotation._y = ( m12 + m21 ) / s;
		rotation._z = ( m13 + m31 ) / s;
	} else if ( m22 > m33 ) {
		s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );
		rotation._w = ( m13 - m31 ) / s;
		rotation._x = ( m12 + m21 ) / s;
		rotation._y = 0.25 * s;
		rotation._z = ( m23 + m32 ) / s;
	} else {
		s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );
		rotation._w = ( m21 - m12 ) / s;
		rotation._x = ( m13 + m31 ) / s;
		rotation._y = ( m23 + m32 ) / s;
		rotation._z = 0.25 * s;
	}
	
	return rotation;
};
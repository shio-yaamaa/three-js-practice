// to check which object comes first in the intersects list

/* global THREE */
/* global TWEEN */

// scene, camera, renderer
const scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2(0x000000, 0.03);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// fly controls
const clock = new THREE.Clock();
const flyControls = new THREE.FlyControls(camera);
const container = document.createElement('div');
flyControls.domElement = container;
flyControls.movementSpeed = 30;
flyControls.rollSpeed = Math.PI / 5;

flyControls.mousemove = null;

// raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.body.appendChild(container);
container.appendChild(renderer.domElement);

// create and add sprites
const spriteMap = new THREE.TextureLoader().load('texture.jpg');

/*
for (let i = 0; i < 1000; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff, fog: true}));
	sprite.scale.set(5, 3);
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	scene.add(sprite);
}*/

for (let i = 0; i < 100; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff, fog: true}));
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	const distance = sprite.position.x ** 2 + sprite.position.y ** 2 + sprite.position.z ** 2;
	sprite.scale.set(distance * 0.01, distance * 0.01);
	scene.add(sprite);
}

// animate loop
const animate = () => {
	requestAnimationFrame(animate);
	render();
};

const render = () => {
  flyControls.update(clock.getDelta());
  
  // reset the sprite color
  for (let i = 0; i < scene.children.length; i++) {
  	scene.children[i].material.color.set(0xffffff);
  }
  
  // change the color of sprites that are under the mouse
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length < scene.children.length) {
		/*
		for (let i = 0; i < intersects.length; i++) {
			intersects[i].object.material.color.set(0xff0000);
		}*/
		intersects[0] && intersects[0].object.material.color.set(0xff0000);
		intersects[1] && intersects[1].object.material.color.set(0x0000ff);
		intersects[2] && intersects[2].object.material.color.set(0xffff00);
		intersects[3] && intersects[3].object.material.color.set(0x00ff00);
		intersects[4] && intersects[4].object.material.color.set(0xff00ff);
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

// mouse move event
window.addEventListener('mousemove', event => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}, false);

lookAt: function () {
	var x = new Vector3();
	var y = new Vector3();
	var z = new Vector3();

	return function lookAt( eye, target, up ) {
		var te = this.elements;
		z.subVectors( eye, target );
		if ( z.lengthSq() === 0 ) {
			// eye and target are in the same position
			z.z = 1;
		}
		z.normalize();
		x.crossVectors( up, z );

		if ( x.lengthSq() === 0 ) {
			// up and z are parallel
			if ( Math.abs( up.z ) === 1 ) {
				z.x += 0.0001;
			} else {
				z.z += 0.0001;
			}
			z.normalize();
			x.crossVectors( up, z );
		}

		x.normalize();
		y.crossVectors( z, x );

		te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
		te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
		te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

		return this;
	};
}(),

lookAt: function () {
	// This method does not support objects with rotated and/or translated parent(s)
	var m1 = new Matrix4();
	var vector = new Vector3();

	return function lookAt( x, y, z ) {
		vector.set( x, y, z );
		m1.lookAt( this.position, vector, this.up );
		
		this.quaternion.setFromRotationMatrix( m1 );
	};
}(),

setFromRotationMatrix: function ( m ) {
	const te = m.elements;

	const m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
				m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
				m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

	const trace = m11 + m22 + m33;
	let s;

	if ( trace > 0 ) {
		s = 0.5 / Math.sqrt( trace + 1.0 );
		this._w = 0.25 / s;
		this._x = ( m32 - m23 ) * s;
		this._y = ( m13 - m31 ) * s;
		this._z = ( m21 - m12 ) * s;
	} else if ( m11 > m22 && m11 > m33 ) {
		s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );
		this._w = ( m32 - m23 ) / s;
		this._x = 0.25 * s;
		this._y = ( m12 + m21 ) / s;
		this._z = ( m13 + m31 ) / s;
	} else if ( m22 > m33 ) {
		s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );
		this._w = ( m13 - m31 ) / s;
		this._x = ( m12 + m21 ) / s;
		this._y = 0.25 * s;
		this._z = ( m23 + m32 ) / s;
	} else {
		s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );
		this._w = ( m21 - m12 ) / s;
		this._x = ( m13 + m31 ) / s;
		this._y = ( m23 + m32 ) / s;
		this._z = 0.25 * s;
	}
}
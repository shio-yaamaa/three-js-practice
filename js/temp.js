// Create and add Sprites
const subwayImgNames = ['american', 'banana_peppers', 'black_forest_ham', 'black_olives', 'chipotle_southwest',
 'cucumbers', 'flatbread', 'green_peppers', 'italian', 'italian_bmt', 'italian_herbs_and_cheese',
 'jalapenos', 'lettuce', 'mayonnaise', 'meatball_marinara', 'monterey_cheddar', 'multi_grain_flatbread',
 'mustard', 'nine_grain_wheat', 'oil', 'oven_roasted_chicken', 'pickles', 'ranch', 'red_onions', 'spinach',
 'sweet_onion', 'sweet_onion_chicken_teriyaki', 'tomatoes', 'tuna', 'turkey_breast', 'vinaigrette', 'vinegar'];
const pepperImgNames = ['square_pepper', 'horizontal_pepper', 'vertical_pepper'];
//const spriteMaps = subwayImgNames.map(name => new THREE.TextureLoader().load(`img/${name}.png`));

/*
for (let i = 0; i < 100; i++) {
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
		//map: spriteMaps[i % spriteMaps.length],
		//map: spriteMaps[Math.floor(Math.random() * spriteMaps.length)],
		map: new THREE.TextureLoader().load(
			`img/${pepperImgNames[i % pepperImgNames.length]}.png`,
			texture => {
				const maxDimension = Math.max(texture.image.height, texture.image.width);
        maxDimension === texture.image.width
          ? sprite.scale.set(SPRITE_MAX_DIMENSION, SPRITE_MAX_DIMENSION * (texture.image.height / maxDimension), 1)
          : sprite.scale.set(SPRITE_MAX_DIMENSION * (texture.image.width / maxDimension), SPRITE_MAX_DIMENSION, 1);
			}
		),
		color: DEFAULT_SPRITE_COLOR,
		fog: true
	}));
	sprite.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
	scene.add(sprite);
}
*/

// RootStar
// For creating speech balloon
  getTopPositionOnScreen(camera) {
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;
    const topPosition = this.sprite.position.clone().setY(this.sprite.position.y + this.radius);
    topPosition.project(camera);
    return new THREE.Vector2(
      (topPosition.x * widthHalf) + widthHalf,
      -(topPosition.y * heightHalf) + heightHalf
    );
  }
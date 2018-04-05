# Todo

- gif support
- file.IO
- Asynchronous addition and deletion
- sidebar

- Can we make the adding and removing process asynchronous? (When addtion is finished, removal starts)
- Make click easier
- Can we use OrbitControls to move camera on wheeling?
- Can we use spread operator to add multiple objects to the scene at a time?
  [Example](https://codepen.io/looeee/pen/VbWLeM)
- Favorite -> Transformation

# Problems

- Sprites can overlap
- Remove doesn't work sometimes

# Animate sprites

## Use libraries with gif support

GLGif (https://github.com/JordiRos/GLGif): The official examples doesn't work.

SuperGif: Requires an <img> dom element. Shows a big animating svg image and nothing else.
  [examle](http://www.desolidstate.com/gif-canv-txtr.html)

Nunustudio: Recognizes the file as gif, and updates the texture, but the texture doesn't animate.
  (Requires Base64Utils, FileSystem, Image, Resource, Texture class)

## Use animated SVG

SVG animation works using the normal TextureLoader, but transparent areas are rendered black.
SVGLoader didn't work because:
  - ```onLoad``` is mandatory
  - ```load()``` returns nothing
  - Even if I make load method return something, some errors occur in three.min.js

## Use png image with all the frames aligned horizontally

https://stackoverflow.com/questions/32187035/three-js-make-image-texture-fit-object-without-distorting-or-repeating

```javascript
this.map.repeat.set(1 / frameCount, 1);
setInterval(() => {
  this.map.offset.x = (this.map.offset.x + 1 / frameCount) % (1 - 1 / frameCount)
}, 100);
```

Clear the interval when the sprite is removed.
Do the textures need to be disposed???

How many frames there are in an image must be specified.
I don't know if it is more efficient to use tween.

## Just rotate and resize the sprites

The most efficient but not flexible

# Asynchronous sprite manipulation

```javascript
const addSprites = () => {
	return new Promise((resolve, reject) => {
  	console.log('adding sprites');
  	resolve();
  });
};

addSprites().then(() => {
	console.log('removing sprites');
});
```
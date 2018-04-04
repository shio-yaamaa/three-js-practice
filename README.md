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
- Add gray paddings - Should I move the padding a bit?
- Favorite -> Transformation

# Problems

- Sprites can overlap
- Remove doesn't work sometimes

# Gif

SuperGif: requires an <img> dom element. It showed a big animating svg image and nothing else
Nunustudio: recognizes the file as a gif, and updates the texture, but the texture doesn't animate
    (requires Base64Utils, FileSystem, Image, Resource, Texture class)

http://www.desolidstate.com/gif-canv-txtr.html

svg animation works using normal TextureLoader, but transparent areas are rendered black
SVGLoader didn't work because:
    - I didn't pass onLoad
    - the load method returns nothing
    - even if I make load method return something, some errors occur in three.min.js

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
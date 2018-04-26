# If we make the MaMuka to speak, and when the MaMuka is out of the screen, users cannot see what he says.
I might not need to pass camera object to the RootStar and the RootStar to the ChildStars

# Problems with Planes

Before using Workers, we have to decide on what parameters the worker computes, which depends on whether we use planes or sprites. 

- Because of the camera.near and camera.far, planes are clipped
- Need to completely revise the way of zooming
- Look messy because of the inconsistency

# Todo

- different MuMu sizes -> different image sizes and new property
- tween camera.near
- Text 行送り
- Pass callback to focus function (fog, camera movement/rotation)
- Worker to do asynchronous tasks

- Icon License

- animation
- file.IO
- sidebar

- When the camera moves in the world view, there appears a hall in the middle of the screen.
- [Panorama Viewer using Three.js](http://www.emanueleferonato.com/2014/12/10/html5-webgl-360-degrees-panorama-viewer-with-three-js/)

- Can we make the adding and removing process asynchronous? (When addtion is finished, removal starts)
- Make click easier
- Can we use OrbitControls to move camera on wheeling?
- Can we use spread operator to add multiple objects to the scene at a time?
  [Example](https://codepen.io/looeee/pen/VbWLeM)
- Favorite -> Transformation

# Problems

- Sprites can overlap
- Removal of sprites sometimes doesn't work

- Fast mouse move -> Disable camera rotation for 0.25 seconds. Didn't work probably because of the way to set the timer.

# Animate sprites

## Use libraries with gif support

GLGif (https://github.com/JordiRos/GLGif): The official examples don't work.

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
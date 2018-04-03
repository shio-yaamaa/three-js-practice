# Todo

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
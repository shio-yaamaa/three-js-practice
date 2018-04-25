/* global THREE */
/* global View */

class EditView extends View {
  constructor(scene, camera, cameraControlsClass, mamuka) {
    super(scene, camera, cameraControlsClass);

    this.mamuka = mamuka;
    this.constellation;

    this.init();
    this.setRenderFunction(this.render);
    
    this.mamukaSprite = this.createMamukaSprite();
    this.setEventListeners(this.defineListeners());
    
    // DOM
    this.editTopicButtonContainer = $('#edit-topics');
    this.speechBalloon = $('#edit-speech-balloon');
    
    // Input
    this.currentTopic;
    this.currentSelectedStar;
  }

  init() {
    this.camera.position.z = 30;
  }
  
  defineListeners() {
    const resizeListener = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      View.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    // for raycaster's mouse position
    const raymouseListener = event => {
      this.raymouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.raymouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Scroll to move forward/backward
    // const wheelListener = event => {
    //   if (this.zoomManager.isInFocus) {return;}
    //   this.cameraControls.moveState.forward = event.wheelDelta > 0 ? 1 : 0;
    //   this.cameraControls.moveState.back = event.wheelDelta < 0 ? 1 : 0;
    //   this.cameraControls.updateMovementVector();

    //   clearTimeout(this.wheelTimer);
    //   this.wheelTimer = setTimeout(() => {
    //     this.cameraControls.moveState.forward = 0;
    //     this.cameraControls.moveState.back = 0;
    //     this.cameraControls.updateMovementVector();
    //   }, 200);
    // };
    
    const mouseDownListener = event => {
      if (this.intersected.object === this.mamukaSprite) {
        this.closeConstellation(() => {
          this.editTopicButtonContainer.css('visibility', 'visible'); // TODO: doesn't work
        });
      } else {
        const star = this.constellation.getStarBySprite(this.intersected.object);
        if (star) {
          star.click();
        } else { // Empty space is clicked
          this.currentSelectedStar = null;
          
        }
      }
    }

    return [
      {target: window, type: 'resize', listener: resizeListener},
      {target: View.renderer.domElement, type: 'mousemove', listener: raymouseListener},
      {target: View.renderer.domElement, type: 'mousedown', listener: mouseDownListener}
    ];
  }
  
  createMamukaSprite() {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial(
      {map: new THREE.TextureLoader().load(this.mamuka.image)}
    ));
    sprite.scale.set(MAMUKA_SPRITE_RADIUS * 2, MAMUKA_SPRITE_RADIUS * 2, 0);
    this.scene.add(sprite);
    return sprite;
  }

  drawConstellation(type) {
    this.closeConstellation(null);
    this.constellation = new Constellation(this.scene, this.mamuka, type);
  }

  closeConstellation(callback) {
    if (this.constellation) {
      this.constellation.close(callback);
    }
  }
  
  mamukaTalk(text) {
    this.speechBalloon.text(text);
    this.speechBalloon.fadeIn();
  }
  
  mamukaStopTalking() {
    this.speechBalloon.fadeOut();
  }

  render() {
    this.raycaster.setFromCamera(this.raymouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    //console.log(intersects[0]);
    
    // ChildStar's hover animation
    if (this.constellation) {
      const currentIntersectStar = intersects[0]
        ? this.constellation.getStarBySprite(intersects[0].object)
        : null;
      const previousIntersectStar = this.intersected
        ? this.constellation.getStarBySprite(this.intersected.object)
        : null;
      //console.log(currentIntersectStar, previousIntersectStar);
      if (currentIntersectStar && previousIntersectStar && currentIntersectStar != previousIntersectStar) { // The hovered star is changed
        currentIntersectStar.hover();
        previousIntersectStar.unhover();
      } else if (currentIntersectStar && !previousIntersectStar) { // A star is hovered
        currentIntersectStar.hover();
        console.log(currentIntersectStar);
      } else if (!currentIntersectStar && previousIntersectStar) { // A star is unhovered
        previousIntersectStar.unhover();
      }
    }
    
    $('body').css('cursor', intersects[0] ? 'pointer' : 'default');
    this.intersected = intersects[0];

    TWEEN.update();
  }
}
/*// Color
const SCENE_BACKGROUND = 0x050e10;
const DEFAULT_SPRITE_COLOR = 0xffffff;
const RAYCASTED_SPRITE_COLOR = 0xe57373;

// Opacity
const VISITED_SPRITE_OPACITY = 0.5;

// Dimension
const SPRITE_MAX_DIMENSION = 10;
const FOCUSED_SPRITE_WINDOW_RATIO = 0.7;

// Region
const REGION_SIZE = 50;
const SPRITE_COUNT_PER_REGION = 40;

// Camera
const DEFAULT_CAMERA_NEAR = 3;
const CAMERA_FAR = 50;

// Fog
const DEFAULT_FOG_NEAR = DEFAULT_CAMERA_NEAR;
const DEFAULT_FOG_FAR = CAMERA_FAR;
const FOG_NEAR_IN_FOCUS_MODE = 0;
const FOG_FAR_IN_FOCUS_MODE = 1;

// Raycaster
const RAYCASTER_NEAR = DEFAULT_CAMERA_NEAR;
const RAYCASTER_FAR = 45;

// Animation duration
const FADE_DURATION = 200;
const TYPEWRITE_INTERVAL = 10;
const HOME_LINK_DURATION = 600;
const ZOOMIN_DURATION = 800;
const ZOOMOUT_DURATION = 1000;

// FlyControls
const FLY_CONTROLS_MOVEMENT_SPEED = 20;
const FLY_CONTROLS_ROLL_SPEED = Math.PI / 5; // Math.PI / 6;

// SphericalLoading
const SPAWN_RADIUS = CAMERA_FAR * 2;
const VIEW_RADIUS = SPAWN_RADIUS * 0.5;
const SPRITE_COUNT_PER_LOAD = 500;

// Constellation
const CONSTELLATION_COLOR = {
  like: 0xffd3d3,
  dislike: 0xfffbb7,
  wishe: 0xd3e2ff
};*/

// Color
const SCENE_BACKGROUND = 0x050e10;
const DEFAULT_SPRITE_COLOR = 0xffffff;
const RAYCASTED_SPRITE_COLOR = 0xe57373;

// Opacity
const VISITED_SPRITE_OPACITY = 0.5;

// Sprite
const SPRITE_FRAME_DIMENSION = 7;
const FOCUSED_SPRITE_WINDOW_RATIO = 0.7;
const SPRITE_SPAWN_PER_LOAD = 750;

// Camera & Fog & Raycaster
const DEFAULT_NEAR = 3;
const DEFAULT_FAR = 50;
const FOCUS_FOG_FAR = 1;
const FOCUS_FOG_NEAR = 0;

// Spawning
const VIEW_RADIUS = DEFAULT_FAR * 0.5;
const SPAWN_RADIUS = DEFAULT_FAR * 2.0;
const ASSET_SPAWN_RATIO = 0.02;

// Animation durations
const TWEEN_ZOOM_IN = 1000;
const TWEEN_ZOOM_OUT = 500;
const FADE_DURATION = 200;
const HOME_LINK_DURATION = 600;
const TYPEWRITE_INTERVAL = 10;

// Controls
const DEFAULT_ROLL_SPEED = Math.PI/6;
const DEFAULT_MOVEMENT_SPEED = 30;
const ZOOM_IN_DURATION = 800;
const ZOOM_OUT_DURATION = 500;

// Constellation & Stars
const MAMUKA_SPRITE_RADIUS = 4;
const CONSTELLATION_COLOR = {
  like: 0xffd3d3,
  dislike: 0xfffbb7,
  wish: 0xd3e2ff
};
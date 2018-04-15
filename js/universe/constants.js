// Color
const SCENE_BACKGROUND = 0x101010;
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
const ZOOMIN_DURATION = 800;
const ZOOMOUT_DURATION = 1000;

// FlyControls
const FLY_CONTROLS_MOVEMENT_SPEED = 30;
const FLY_CONTROLS_ROLL_SPEED = Math.PI / 5; // Math.PI / 6;

// SphericalLoading
const SPAWN_RADIUS = CAMERA_FAR * 2;
const VIEW_RADIUS = SPAWN_RADIUS * 0.5;
const SPRITE_COUNT_PER_LOAD = 300;
let mapEl = null
let roomContainer = null
let pauseContainer = null
let uiEl = null
let currentRoom = null
let currentRoomSolid = []
let currentRoomLoaders = []
let currentRoomEnemies = []
let currentRoomBullets = []
let currentRoomFlames = []
let currentRoomPoisons = []
let currentRoomThrowables = []
let currentRoomExplosions = []
let currentRoomDoors = []
let currentRoomPowerUps = []
let player = null
let grabBar = null
let healthStatusContainer = null
let shadowContainer = null
let mainMenuEl = null
let movementJoyStick = null
let aimJoyStick = null
let sprintButton = null
let interactButton = null
let pauseButton = null
let reloadButton = null
let slotsContainer = null
let grenadeButton = null
let flashbangButton = null

export const getMapEl = () => mapEl
export const setMapEl = value => (mapEl = value)
export const getRoomContainer = () => roomContainer
export const setRoomContainer = value => (roomContainer = value)
export const getPauseContainer = () => pauseContainer
export const setPauseContainer = value => (pauseContainer = value)
export const getUiEl = () => uiEl
export const setUiEl = value => (uiEl = value)
export const getCurrentRoom = () => currentRoom
export const setCurrentRoom = value => (currentRoom = value)
export const getCurrentRoomSolid = () => currentRoomSolid
export const setCurrentRoomSolid = value => (currentRoomSolid = value)
export const getCurrentRoomLoaders = () => currentRoomLoaders
export const setCurrentRoomLoaders = value => (currentRoomLoaders = value)
export const getCurrentRoomEnemies = () => currentRoomEnemies
export const setCurrentRoomEnemies = value => (currentRoomEnemies = value)
export const getCurrentRoomBullets = () => currentRoomBullets
export const setCurrentRoomBullets = value => (currentRoomBullets = value)
export const getCurrentRoomFlames = () => currentRoomFlames
export const setCurrentRoomFlames = value => (currentRoomFlames = value)
export const getCurrentRoomPoisons = () => currentRoomPoisons
export const setCurrentRoomPoisons = value => (currentRoomPoisons = value)
export const getCurrentRoomThrowables = () => currentRoomThrowables
export const setCurrentRoomThrowables = value => (currentRoomThrowables = value)
export const getCurrentRoomExplosions = () => currentRoomExplosions
export const setCurrentRoomExplosions = value => (currentRoomExplosions = value)
export const getCurrentRoomDoors = () => currentRoomDoors
export const setCurrentRoomDoors = value => (currentRoomDoors = value)
export const getCurrentRoomPowerUps = () => currentRoomPowerUps
export const setCurrentRoomPowerUps = value => (currentRoomPowerUps = value)
export const getPlayer = () => player
export const setPlayer = value => (player = value)
export const getGrabBar = () => grabBar
export const setGrabBar = value => (grabBar = value)
export const getHealthStatusContainer = () => healthStatusContainer
export const setHealthStatusContainer = value => (healthStatusContainer = value)
export const getShadowContainer = () => shadowContainer
export const setShadowContainer = value => (shadowContainer = value)
export const getMainMenuEl = () => mainMenuEl
export const setMainMenuEl = value => (mainMenuEl = value)
export const getMovementJoystick = () => movementJoyStick
export const setMovementJoystick = value => (movementJoyStick = value)
export const getAimJoystick = () => aimJoyStick
export const setAimJoystick = value => (aimJoyStick = value)
export const getSprintButton = () => sprintButton
export const setSprintButton = value => (sprintButton = value)
export const getInteractButton = () => interactButton
export const setInteractButton = value => (interactButton = value)
export const getPauseButton = () => pauseButton
export const setPauseButton = value => (pauseButton = value)
export const getReloadButton = () => reloadButton
export const setReloadButton = value => (reloadButton = value)
export const getSlotsContainer = () => slotsContainer
export const setSlotsContainer = value => (slotsContainer = value)
export const getGrenadeButton = () => grenadeButton
export const setGrenadeButton = value => (grenadeButton = value)
export const getFlashbangButton = () => flashbangButton
export const setFlashbangButton = value => (flashbangButton = value)

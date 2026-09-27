const state = {
    mapX: 0,
    mapY: 0,
    playerX: 0,
    playerY: 0,
    currentRoomId: 1,
    roomTop: 0,
    roomLeft: 0,
    upPressed: false,
    downPressed: false,
    rightPressed: false,
    leftPressed: false,
    playerSpeed: 5,
    allowMove: true,
    sprint: false,
    playerAngle: 0,
    playerAngleState: 0,
    playerAimAngle: 0,
    maxHealth: 300,
    health: 300,
    maxStamina: 600,
    stamina: 600,
    refillStamina: false,
    sprintPressed: false,
    aimMode: false,
    weaponWheel: [],
    equippedWeaponId: null,
    pause: false,
    pauseCause: null,
    mouseX: null,
    mouseY: null,
    reloading: false,
    shootPressed: false,
    shooting: false,
    shootCounter: 0,
    noOffenseCounter: 0,
    stunnedCounter: 0,
    grabbed: false,
    burning: 0,
    poisoned: false,
    poisonCounter: 0,
    explosionDamageCounter: 0,
    criticalChance: 0.01,
    animatedElements: [],
    waitingFunctions: [],
    timesSaved: 0,
    gameId: null,
    playthroughId: null,
    targets: [],
    aimJoystickAngle: null,
    foundTarget: null,
    suitableTargetAngle: null,
    isSearching4Target: false,
}

const accessors = [
    'mapX',
    'mapY',
    'playerX',
    'playerY',
    'currentRoomId',
    'roomTop',
    'roomLeft',
    'upPressed',
    'downPressed',
    'rightPressed',
    'leftPressed',
    'playerSpeed',
    'allowMove',
    'sprint',
    'playerAngle',
    'playerAngleState',
    'playerAimAngle',
    'maxHealth',
    'health',
    'maxStamina',
    'stamina',
    'refillStamina',
    'sprintPressed',
    'aimMode',
    'weaponWheel',
    'equippedWeaponId',
    'pause',
    'pauseCause',
    'mouseX',
    'mouseY',
    'reloading',
    'shootPressed',
    'shooting',
    'shootCounter',
    'noOffenseCounter',
    'stunnedCounter',
    'grabbed',
    'burning',
    'poisoned',
    'poisonCounter',
    'explosionDamageCounter',
    'criticalChance',
    'animatedElements',
    'waitingFunctions',
    'timesSaved',
    'gameId',
    'playthroughId',
    'targets',
    'aimJoystickAngle',
    'foundTarget',
    'suitableTargetAngle',
    'isSearching4Target',
]

// Explicit named exports below keep ES-module consumers statically analyzable.
export const getMapX = () => state.mapX
export const setMapX = value => (state.mapX = value)
export const getMapY = () => state.mapY
export const setMapY = value => (state.mapY = value)
export const getPlayerX = () => state.playerX
export const setPlayerX = value => (state.playerX = value)
export const getPlayerY = () => state.playerY
export const setPlayerY = value => (state.playerY = value)
export const getCurrentRoomId = () => state.currentRoomId
export const setCurrentRoomId = value => (state.currentRoomId = value)
export const getRoomTop = () => state.roomTop
export const setRoomTop = value => (state.roomTop = value)
export const getRoomLeft = () => state.roomLeft
export const setRoomLeft = value => (state.roomLeft = value)
export const getUpPressed = () => state.upPressed
export const setUpPressed = value => (state.upPressed = value)
export const getDownPressed = () => state.downPressed
export const setDownPressed = value => (state.downPressed = value)
export const getRightPressed = () => state.rightPressed
export const setRightPressed = value => (state.rightPressed = value)
export const getLeftPressed = () => state.leftPressed
export const setLeftPressed = value => (state.leftPressed = value)
export const getPlayerSpeed = () => state.playerSpeed
export const setPlayerSpeed = value => (state.playerSpeed = value)
export const getAllowMove = () => state.allowMove
export const setAllowMove = value => (state.allowMove = value)
export const getSprint = () => state.sprint
export const setSprint = value => (state.sprint = value)
export const getPlayerAngle = () => state.playerAngle
export const setPlayerAngle = value => (state.playerAngle = value)
export const getPlayerAngleState = () => state.playerAngleState
export const setPlayerAngleState = value => (state.playerAngleState = value)
export const getPlayerAimAngle = () => state.playerAimAngle
export const setPlayerAimAngle = value => (state.playerAimAngle = value)
export const getMaxHealth = () => state.maxHealth
export const setMaxHealth = value => (state.maxHealth = value)
export const getHealth = () => state.health
export const setHealth = value => (state.health = value)
export const getMaxStamina = () => state.maxStamina
export const setMaxStamina = value => (state.maxStamina = value)
export const getStamina = () => state.stamina
export const setStamina = value => (state.stamina = value)
export const getRefillStamina = () => state.refillStamina
export const setRefillStamina = value => (state.refillStamina = value)
export const getSprintPressed = () => state.sprintPressed
export const setSprintPressed = value => (state.sprintPressed = value)
export const getAimMode = () => state.aimMode
export const setAimMode = value => (state.aimMode = value)
export const getWeaponWheel = () => state.weaponWheel
export const setWeaponWheel = value => (state.weaponWheel = value)
export const getEquippedWeaponId = () => state.equippedWeaponId
export const setEquippedWeaponId = value => (state.equippedWeaponId = value)
export const getPause = () => state.pause
export const setPause = value => (state.pause = value)
export const getPauseCause = () => state.pauseCause
export const setPauseCause = value => (state.pauseCause = value)
export const getMouseX = () => state.mouseX
export const setMouseX = value => (state.mouseX = value)
export const getMouseY = () => state.mouseY
export const setMouseY = value => (state.mouseY = value)
export const getReloading = () => state.reloading
export const setReloading = value => (state.reloading = value)
export const getShootPressed = () => state.shootPressed
export const setShootPressed = value => (state.shootPressed = value)
export const getShooting = () => state.shooting
export const setShooting = value => (state.shooting = value)
export const getShootCounter = () => state.shootCounter
export const setShootCounter = value => (state.shootCounter = value)
export const getNoOffenseCounter = () => state.noOffenseCounter
export const setNoOffenseCounter = value => (state.noOffenseCounter = value)
export const getStunnedCounter = () => state.stunnedCounter
export const setStunnedCounter = value => (state.stunnedCounter = value)
export const getGrabbed = () => state.grabbed
export const setGrabbed = value => (state.grabbed = value)
export const getBurning = () => state.burning
export const setBurning = value => (state.burning = value)
export const getPoisoned = () => state.poisoned
export const setPoisoned = value => (state.poisoned = value)
export const getPoisonCounter = () => state.poisonCounter
export const setPoisonCounter = value => (state.poisonCounter = value)
export const getExplosionDamageCounter = () => state.explosionDamageCounter
export const setExplosionDamageCounter = value => (state.explosionDamageCounter = value)
export const getCriticalChance = () => state.criticalChance
export const setCriticalChance = value => (state.criticalChance = value)
export const getAnimatedElements = () => state.animatedElements
export const setAnimatedElements = value => (state.animatedElements = value)
export const getWaitingFunctions = () => state.waitingFunctions
export const setWaitingFunctions = value => (state.waitingFunctions = value)
export const getTimesSaved = () => state.timesSaved
export const setTimesSaved = value => (state.timesSaved = value)
export const getGameId = () => state.gameId
export const setGameId = value => (state.gameId = value)
export const getPlaythroughId = () => state.playthroughId
export const setPlaythroughId = value => (state.playthroughId = value)
export const getTargets = () => state.targets
export const setTargets = value => (state.targets = value)
export const getAimJoystickAngle = () => state.aimJoystickAngle
export const setAimJoystickAngle = value => (state.aimJoystickAngle = value)
export const getFoundTarget = () => state.foundTarget
export const setFoundTarget = value => (state.foundTarget = value)
export const getSuitableTargetAngle = () => state.suitableTargetAngle
export const setSuitableTargetAngle = value => (state.suitableTargetAngle = value)
export const getIsSearching4Target = () => state.isSearching4Target
export const setIsSearching4Target = value => (state.isSearching4Target = value)

export const getSerializableVariables = () =>
    Object.fromEntries(accessors.filter(key => !['gameId', 'animatedElements', 'waitingFunctions', 'targets'].includes(key)).map(key => [key, state[key]]))

export const restoreSerializableVariables = values => {
    Object.entries(values ?? {}).forEach(([key, value]) => {
        if (accessors.includes(key)) state[key] = value
    })
}

export const resetTransientVariables = () => {
    ;[
        'upPressed',
        'downPressed',
        'rightPressed',
        'leftPressed',
        'sprint',
        'sprintPressed',
        'aimMode',
        'pause',
        'reloading',
        'shootPressed',
        'shooting',
        'grabbed',
        'isSearching4Target',
    ].forEach(key => (state[key] = false))
    state.pauseCause = null
    state.targets = []
    state.animatedElements = []
    state.waitingFunctions = []
    state.foundTarget = null
    state.suitableTargetAngle = null
    state.noOffenseCounter = 0
    state.stunnedCounter = 0
    state.explosionDamageCounter = 0
}

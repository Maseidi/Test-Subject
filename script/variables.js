let mapX = -50000
export const setMapX = (val) => {
    mapX = val
}
export const getMapX = () => mapX

let mapY = -50000
export const setMapY = (val) => {
    mapY = val
}
export const getMapY = () => mapY

let playerX = 50750
export const setPlayerX = (val) => {
    playerX = val
}
export const getPlayerX = () => playerX

let playerY = 50400
export const setPlayerY = (val) => {
    playerY = val
}
export const getPlayerY = () => playerY

let currentRoomId = 1
export const setCurrentRoomId = (val) => {
    currentRoomId = val
}
export const getCurrentRoomId = () => currentRoomId

let roomTop = 49500
export const setRoomTop = (val) => {
    roomTop = val
}
export const getRoomTop = () => roomTop

let roomLeft = 50500
export const setRoomLeft = (val) => {
    roomLeft = val
}
export const getRoomLeft = () => roomLeft

let upPressed = false
export const setUpPressed = (val) => {
    upPressed = val
}
export const getUpPressed = () => upPressed

let downPressed = false
export const setDownPressed = (val) => {
    downPressed = val
}
export const getDownPressed = () => downPressed

let rightPressed = false
export const setRightPressed = (val) => {
    rightPressed = val
}
export const getRightPressed = () => rightPressed

let leftPressed = false
export const setLeftPressed = (val) => {
    leftPressed = val
}
export const getLeftPressed = () => leftPressed

let playerSpeed = 5
export const setPlayerSpeed = (val) => {
    playerSpeed = val
}
export const getPlayerSpeed = () => playerSpeed

let allowMove = true
export const setAllowMove = (val) => {
    allowMove = val
}
export const getAllowMove = () => allowMove

let sprint = false
export const setSprint = (val) => {
    sprint = val
}
export const getSprint = () => sprint

let playerAngle = 0
export const setPlayerAngle = (val) => {
    playerAngle = val
}
export const getPlayerAngle = () => playerAngle

let playerAngleState = 0
export const setPlayerAngleState = (val) => {
    playerAngleState = val
}
export const getPlayerAngleState = () => playerAngleState

let playerAimAngle = 0
export const setPlayerAimAngle = (val) => {
    playerAimAngle = val
}
export const getPlayerAimAngle = () => playerAimAngle

let maxStamina = 600
export const setMaxStamina = (val) => {
    maxStamina = val
}
export const getMaxStamina = () => maxStamina

let stamina = 600
export const setStamina = (val) => {
    stamina = val
}
export const getStamina = () => stamina

let maxHealth = 100
export const setMaxHealth = (val) => {
    maxHealth = val
}
export const getMaxHealth = () => maxHealth

let health = 100
export const setHealth = (val) => {
    health = val
}
export const getHealth = () => health

let refillStamina = false
export const setRefillStamina = (val) => {
    refillStamina = val
}
export const getRefillStamina = () => refillStamina

let sprintPressed = false
export const setSprintPressed = (val) => {
    sprintPressed = val
}
export const getSprintPressed = () => sprintPressed

let aimMode = false
export const setAimMode = (val) => {
    aimMode = val
}
export const getAimMode = () => aimMode

let weaponWheel = [null, null, null, null]
export const setWeaponWheel = (val) => {
    weaponWheel = val
}
export const getWeaponWheel = () => weaponWheel

let equippedWeaponId = null
export const setEquippedWeaponId = (val) => {
    equippedWeaponId = val
}
export const getEquippedWeaponId = () => equippedWeaponId

let EquippedWeaponObject = null
export const setEquippedWeaponObject = (val) => {
    EquippedWeaponObject = val
}
export const getEquippedWeaponObject = () => EquippedWeaponObject

let intObj = null
export const setElementInteractedWith = (val) => {
    intObj = val
}
export const getElementInteractedWith = () => intObj

let targets = []
export const setTargets = (val) => {
    targets = val
}
export const getTargets = () => targets

let pause = false
export const setPause = (val) => {
    pause = val
}
export const getPause = () => pause

let pauseCause = null
export const setPauseCause = (val) => {
    pauseCause = val
}
export const getPauseCause = () => pauseCause

let draggedItem = null
export const setDraggedItem = (val) => {
    draggedItem = val
}
export const getDraggedItem = () => draggedItem

let mouseX = null
export const setMouseX = (val) => {
    mouseX = val
}
export const getMouseX = () => mouseX

let mouseY = null
export const setMouseY = (val) => {
    mouseY = val
}
export const getMouseY = () => mouseY

let reloading = false
export const setReloading = (val) => {
    reloading = val
}
export const getReloading = () => reloading

let shootPressed = false
export const setShootPressed = (val) => {
    shootPressed = val
}
export const getShootPressed = () => shootPressed

let shooting = false
export const setShooting = (val) => {
    shooting = val
}
export const getShooting = () => shooting

let shootCounter = 0
export const setShootCounter = (val) => {
    shootCounter = val
}
export const getShootCounter = () => shootCounter

let noOffenseCounter = 0
export const setNoOffenseCounter = (val) => {
    noOffenseCounter = val
}
export const getNoOffenseCounter = () => noOffenseCounter

let stunnedCounter = 0
export const setStunnedCounter = (val) => {
    stunnedCounter = val
}
export const getStunnedCounter = () => stunnedCounter

let entityId = 1
export const setEntityId = (val) => {
    entityId = val
}
export const getEntityId = () => entityId

let grabbed = false
export const setGrabbed = (val) => {
    grabbed = val
}
export const getGrabbed = () => grabbed

let burning = 0
export const setBurning = (val) => {
    burning = val
}
export const getBurning = () => burning

let poisoned = false
export const setPoisoned = (val) => {
    poisoned = val
}
export const getPoisoned = () => poisoned

let throwCounter = 0
export const setThrowCounter = (val) => {
    throwCounter = val
}
export const getThrowCounter = () => throwCounter

let explosionDamageCounter = 0
export const setExplosionDamageCounter = (val) => {
    explosionDamageCounter = val
}
export const getExplosionDamageCounter = () => explosionDamageCounter

let criticalChance = 0.01
export const setCriticalChance = (val) => {
    criticalChance = val
}
export const getCriticalChance = () => criticalChance

let adrenalinesDropped = 0
export const setAdrenalinesDropped = (val) => {
    adrenalinesDropped = val
}
export const getAdrenalinesDropped = () => adrenalinesDropped

let healthPotionsDropped = 0
export const setHealthPotionsDropped = (val) => {
    healthPotionsDropped = val
}
export const getHealthPotionsDropped = () => healthPotionsDropped

let LuckPillsDropped = 0
export const setLuckPillsDropped = (val) => {
    LuckPillsDropped = val
}
export const getLuckPillsDropped = () => LuckPillsDropped

let energyDrinksDropped = 0
export const setEnergyDrinksDropped = (val) => {
    energyDrinksDropped = val
}
export const getEnergyDrinksDropped = () => energyDrinksDropped

let logCounter = 0
export const setLogCounter = (val) => {
    logCounter = val
}
export const getLogCounter = () => logCounter

let infection = []
export const setInfection = (val) => {
    infection = val
}
export const getInfection = () => infection

let animatedLimbs = []
export const setAnimatedLimbs = (val) => {
    animatedLimbs = val
}
export const getAnimatedLimbs = () => animatedLimbs

let dirtyRooms = []
export const setDirtyRooms = (val) => {
    dirtyRooms = val
}
export const getDirtyRooms = () => dirtyRooms
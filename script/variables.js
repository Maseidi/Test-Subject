let mapX = -50000
export const setMapX = (val) => {
    mapX = val
}
export const getMapX = () => {
    return mapX
}

let mapY = -50000
export const setMapY = (val) => {
    mapY = val
}
export const getMapY = () => {
    return mapY
}

let playerX = 50750
export const setPlayerX = (val) => {
    playerX = val
}
export const getPlayerX = () => {
    return playerX
}

let playerY = 50400
export const setPlayerY = (val) => {
    playerY = val
}
export const getPlayerY = () => {
    return playerY
}

let prevRoomId
export const setPrevRoomId = (val) => {
    prevRoomId = val
}
export const getPrevRoomId = () => {
    return prevRoomId
}

let currentRoomId = "room-1"
export const setCurrentRoomId = (val) => {
    currentRoomId = val
}
export const getCurrentRoomId = () => {
    return currentRoomId
}

let roomTop = 50000
export const setRoomTop = (val) => {
    roomTop = val
}
export const getRoomTop = () => {
    return roomTop
}

let roomLeft = 50217.5
export const setRoomLeft = (val) => {
    roomLeft = val
}
export const getRoomLeft = () => {
    return roomLeft
}

let upPressed = false
export const setUpPressed = (val) => {
    upPressed = val
}
export const getUpPressed = () => {
    return upPressed
}

let downPressed = false
export const setDownPressed = (val) => {
    downPressed = val
}
export const getDownPressed = () => {
    return downPressed
}

let rightPressed = false
export const setRightPressed = (val) => {
    rightPressed = val
}
export const getRightPressed = () => {
    return rightPressed
}

let leftPressed = false
export const setLeftPressed = (val) => {
    leftPressed = val
}
export const getLeftPressed = () => {
    return leftPressed
}

let playerAngleState = 0
export const setPlayerAngleState = (val) => {
    playerAngleState = val
}
export const getPlayerAngleState = () => {
    return playerAngleState
}

let playerAngle = 0
export const setPlayerAngle = (val) => {
    playerAngle = val
}
export const getPlayerAngle = () => {
    return playerAngle
}

let aimingPlayerAngle = 0
export const setAimingPlayerAngle = (val) => {
    aimingPlayerAngle = val
}
export const getAimingPlayerAngle = () => {
    return aimingPlayerAngle
}

let playerSpeed = 5
export const setPlayerSpeed = (val) => {
    playerSpeed = val
}
export const getPlayerSpeed = () => {
    return playerSpeed
}

let allowMove = true
export const setAllowMove = (val) => {
    allowMove = val
}
export const getAllowMove = () => {
    return allowMove
}

let sprint = false
export const setSprint = (val) => {
    sprint = val
}
export const getSprint = () => {
    return sprint
}

let stamina = 600
export const setStamina = (val) => {
    stamina = val
}

export const getStamina = () => {
    return stamina
}

let refillStamina = false
export const setRefillStamina = (val) => {
    refillStamina = val
}

export const getRefillStamina = () => {
    return refillStamina
}

let sprintPressed = false
export const setSprintPressed = (val) => {
    sprintPressed = val
}

export const getSprintPressed = () => {
    return sprintPressed
}

let aimMode = false
export const setAimMode = (val) => {
    aimMode = val
}
export const getAimMode = () => {
    return aimMode
}

let weaponWheel = [null, null, null, null]
export const setWeaponWheel = (val) => {
    weaponWheel = val
}
export const getWeaponWheel = () => {
    return weaponWheel
}

let equippedWeapon = null
export const setEquippedWeapon = (val) => {
    equippedWeapon = val
}
export const getEquippedWeapon = () => {
    return equippedWeapon
}

let intObj
export const setIntObj = (val) => {
    intObj = val
}
export const getIntObj = () => {
    return intObj
}

let lootId = 0
export const setLootId = (val) => {
    lootId = val
}
export const getLootId = () => {
    return lootId
}

let target
export const setTarget = (val) => {
    target = val
}
export const getTarget = () => {
    return target
}

let pause = false
export const setPause = (val) => {
    pause = val
}
export const getPause = () => {
    return pause
}
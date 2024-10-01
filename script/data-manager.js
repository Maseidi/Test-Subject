import { getStash, initialStash, setStash } from './stash.js'
import { getProgress, setProgress } from './progress-manager.js'
import { getPasswords, initPasswords } from './password-manager.js'
import { getInventory, initialInventory, setInventory } from './inventory.js'
import { getShopItems, initialShopItems, setShopItems } from './shop-item.js'
import { 
    getEnemies,
    getInteractables,
    initEnemies,
    initialInteractables,
    initLoaders,
    rooms,
    setEnemies,
    setInteractables,
    setLoaders } from './entities.js'
import { 
    getAdrenalinesDropped,
    getAimMode,
    getBurning,
    getCriticalChance,
    getCurrentRoomId,
    getDifficulty,
    getEnergyDrinksDropped,
    getEntityId,
    getEquippedTorchId,
    getEquippedWeaponId,
    getHealth,
    getHealthPotionsDropped,
    getInfection,
    getLuckPillsDropped,
    getMapX,
    getMapY,
    getMaxHealth,
    getMaxStamina,
    getPlayerAimAngle,
    getPlayerAngle,
    getPlayerAngleState,
    getPlayerSpeed,
    getPlayerX,
    getPlayerY,
    getPoisoned,
    getRefillStamina,
    getRoomLeft,
    getRoomTop,
    getRoundsFinished,
    getStamina,
    getTimesSaved,
    getWeaponWheel,
    setAdrenalinesDropped,
    setAimMode,
    setAllowMove,
    setAnimatedLimbs,
    setBurning,
    setCriticalChance,
    setCurrentRoomId,
    setDifficulty,
    setDownPressed,
    setDraggedItem,
    setElementInteractedWith,
    setEnergyDrinksDropped,
    setEntityId,
    setEquippedTorchId,
    setEquippedWeaponId,
    setExplosionDamageCounter,
    setGrabbed,
    setHealth,
    setHealthPotionsDropped,
    setInfection,
    setLeftPressed,
    setLuckPillsDropped,
    setMapX,
    setMapY,
    setMaxHealth,
    setMaxStamina,
    setMouseX,
    setMouseY,
    setNoOffenseCounter,
    setPause,
    setPauseCause,
    setPlayerAimAngle,
    setPlayerAngle,
    setPlayerAngleState,
    setPlayerSpeed,
    setPlayerX,
    setPlayerY,
    setPlayingDialogue,
    setPoisoned,
    setRefillStamina,
    setReloading,
    setRightPressed,
    setRoomLeft,
    setRoomTop,
    setRoundsFinished,
    setShootCounter,
    setShooting,
    setShootPressed,
    setSprint,
    setSprintPressed,
    setStamina,
    setStunnedCounter,
    setTargets,
    setThrowCounter,
    setTimesSaved,
    setUpPressed,
    setWaitingFunctions, 
    setWeaponWheel } from './variables.js'

export const prepareNewGameData = (difficulty) => {
    initPasswords()
    initNewGameLoaders()
    initNewGameProgress()
    initNewGameInventory()
    initNewGameStash()
    initNewGameShop()
    initNewGameVariables(difficulty)
    initNewGameEntities()
    initConstants()
}

const initNewGameLoaders = () => setLoaders(initLoaders())

const initNewGameProgress = () =>
    setProgress({
            [Number.MAX_SAFE_INTEGER] : true
        }
    )

const initNewGameInventory = () => setInventory(initialInventory)

const initNewGameStash = () => setStash(initialStash) 

const initNewGameShop = () => setShopItems(initialShopItems)

const initNewGameEntities = () => {
    initNewGameEnemies()
    initNewGameInteractables()
}

const initNewGameEnemies = () => setEnemies(initEnemies())

const initNewGameInteractables = () => setInteractables(initialInteractables)

const initConstants = () => {
    setUpPressed(false)
    setDownPressed(false)
    setLeftPressed(false)
    setRightPressed(false)
    setAllowMove(true)
    setSprint(false)
    setSprintPressed(false)
    setElementInteractedWith(null)
    setTargets([])
    setPause(false)
    setPauseCause(null)
    setDraggedItem(null)
    setMouseX(null)
    setMouseY(null)
    setReloading(false)
    setShootPressed(false)
    setShooting(false)
    setShootCounter(0)
    setGrabbed(false)
    setThrowCounter(0)
    setExplosionDamageCounter(0)
    setAnimatedLimbs([])
    setWaitingFunctions([])
    setPlayingDialogue(null)
    setNoOffenseCounter(0)
    setStunnedCounter(0)
    setPlayerAngle(0)
    setPlayerAngleState(0)
    setPlayerAimAngle(0)
    setAimMode(false)
}

const initNewGameVariables = (difficulty) => {
    const newGameVariables = {
        mapX : 0,
        mapY : 0,
        playerX : 50750,
        playerY : 50400,
        currentRoomId : 1,
        roomTop : 49500,
        roomLeft : 50500,
        playerSpeed : 5,
        maxStamina : 600,
        stamina : 600,
        maxHealth : 100,
        health : 100,
        refillStamina : false,
        weaponWheel : [null, null, null, null],
        equippedWeaponId : null,
        noOffenseCounter : 0,
        stunnedCounter : 0,
        entityId : 1,
        burning : 0,
        poisoned : false,
        criticalChance : 0.01,
        adrenalinesDropped : 0,
        healthPotionsDropped : 0,
        luckPillsDropped : 0,
        energyDrinksDropped : 0,
        infection : [],
        equippedTorchId : null,
        roundsFinished : 0,
        timesSaved: 0,
        difficulty,
    }
    setVariables(newGameVariables)
}

const setVariables = (variables) => {
    setMapX(                variables.mapX)
    setMapY(                variables.mapY)
    setPlayerX(             variables.playerX)
    setPlayerY(             variables.playerY)
    setCurrentRoomId(       variables.currentRoomId)
    setRoomTop(             variables.roomTop)
    setRoomLeft(            variables.roomLeft)
    setPlayerSpeed(         variables.playerSpeed)
    setPlayerAngle(         variables.playerAngle)
    setPlayerAngleState(    variables.playerAngleState)
    setPlayerAimAngle(      variables.playerAimAngle)
    setMaxStamina(          variables.maxStamina)
    setStamina(             variables.stamina)
    setMaxHealth(           variables.maxHealth)
    setHealth(              variables.health)
    setRefillStamina(       variables.refillStamina)
    setAimMode(             variables.aimMode),
    setWeaponWheel(         variables.weaponWheel)
    setEquippedWeaponId(    variables.equippedWeaponId)
    setStunnedCounter(      variables.stunnedCounter)
    setEntityId(            variables.entityId)
    setBurning(             variables.burning)
    setPoisoned(            variables.poisoned)
    setCriticalChance(      variables.criticalChance)
    setAdrenalinesDropped(  variables.adrenalinesDropped)
    setHealthPotionsDropped(variables.healthPotionsDropped)
    setLuckPillsDropped(    variables.luckPillsDropped)
    setEnergyDrinksDropped( variables.energyDrinksDropped)
    setInfection(           variables.infection)
    setEquippedTorchId(     variables.equippedTorchId)
    setRoundsFinished(      variables.roundsFinished)
    setDifficulty(          variables.difficulty)
    setTimesSaved(          variables.timesSaved)
}

export const saveAtSlot = (slotNumber) => {
    setTimesSaved(getTimesSaved() + 1)

    savePasswords(    slotNumber)
    saveStats(        slotNumber)
    saveProgress(     slotNumber)
    saveInteractables(slotNumber)
    saveEnemies(      slotNumber)
    saveVariables(    slotNumber)
    saveShopItems(    slotNumber)
    saveInventory(    slotNumber)
    saveStash(        slotNumber)
}

const savePasswords = (slotNumber) => saveMapAsString(slotNumber, 'passwords', getPasswords(``))

const saveMapAsString = (slotNumber, entityType, entities) => {
    let data2save = {}
    for ( const [key, entitiesOfKey] of entities.entries() ) {
        data2save = {
            ...data2save,
            [key] : entitiesOfKey
        }
    }
    localStorage.setItem('slot-' + slotNumber + '-' + entityType, JSON.stringify(data2save))
}

const saveStats = (slotNumber) =>
    localStorage.setItem('slot-' + slotNumber, JSON.stringify({
        timeStamp: Date.now(),
        room: rooms.get(getCurrentRoomId()).label,
        saves: getTimesSaved(),
        difficulty: getDifficulty(),
        rounds: getRoundsFinished()
    }))

const saveProgress = (slotNumber) => simpleSave(slotNumber, 'progress', getProgress())

const saveInteractables = (slotNumber) => simpleSave(slotNumber, 'interactables', getInteractables())

const simpleSave = (slotNumber, postfix, data2save) => 
    localStorage.setItem('slot-' + slotNumber + '-' + postfix, JSON.stringify(data2save))

const saveEnemies = (slotNumber) => {
    let data2save = {}
    for ( const [roomId, enemies] of getEnemies().entries() ) {
        data2save = {
            ...data2save,
            [roomId] : enemies.map(enemy => {
                let result = {}
                Object.getOwnPropertyNames(enemy).forEach(name => {
                    if ( name.toLowerCase().includes('service') ) return
                    result = {
                        ...result,
                        [name]: enemy[name]
                    }
                })
                return result
            })
        }
    }

    localStorage.setItem('slot-' + slotNumber + '-enemies', JSON.stringify(data2save))
}

const saveVariables = (slotNumber) => {
    localStorage.setItem('slot-' + slotNumber + '-variables', JSON.stringify({
        mapX :                 getMapX(),
        mapY :                 getMapY(),
        playerX :              getPlayerX(),
        playerY :              getPlayerY(),
        currentRoomId :        getCurrentRoomId(),
        roomTop :              getRoomTop(),
        roomLeft :             getRoomLeft(),
        playerSpeed :          getPlayerSpeed(),
        playerAngle :          getPlayerAngle(),
        playerAngleState :     getPlayerAngleState(),
        playerAimAngle :       getPlayerAimAngle(),
        maxStamina :           getMaxStamina(),
        stamina :              getStamina(),
        maxHealth :            getMaxHealth(),
        health :               getHealth(),
        refillStamina :        getRefillStamina(),
        aimMode :              getAimMode(),
        weaponWheel :          getWeaponWheel(),
        equippedWeaponId :     getEquippedWeaponId(),
        entityId :             getEntityId(),
        burning :              getBurning(),
        poisoned :             getPoisoned(),
        criticalChance :       getCriticalChance(),
        adrenalinesDropped :   getAdrenalinesDropped(),
        healthPotionsDropped : getHealthPotionsDropped(),
        luckPillsDropped :     getLuckPillsDropped(),
        energyDrinksDropped :  getEnergyDrinksDropped(),
        infection :            getInfection(),
        equippedTorchId :      getEquippedTorchId(),
        roundsFinished :       getRoundsFinished(),
        timesSaved:            getTimesSaved(),
        difficulty:            getDifficulty(),
    }))
}

const saveShopItems = (slotNumber) => simpleSave(slotNumber, 'shop-items', getShopItems())

const saveInventory = (slotNumber) => simpleSave(slotNumber, 'inventory', getInventory())

const saveStash = (slotNumber) => simpleSave(slotNumber, 'stash', getStash())

export const loadGameFromSlot = (slotNumber) => {
    initConstants()
    
}
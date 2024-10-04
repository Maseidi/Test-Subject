import { buildEnemy } from './enemy/enemy-factory.js'
import { getStash, initStash, setStash } from './stash.js'
import { getInventory, initInventory, setInventory } from './inventory.js'
import { getShopItems, initShopItems, setShopItems } from './shop-item.js'
import { getProgress, initProgress, setProgress } from './progress-manager.js'
import { getPasswords, initPasswords, setPasswords } from './password-manager.js'
import { 
    getEnemies,
    getInteractables,
    initEnemies,
    initInteractables,
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
    getPlaythroughId,
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
    setPlaythroughId,
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

const initNewGameProgress = () => setProgress(initProgress())

const initNewGameInventory = () => setInventory(initInventory())

const initNewGameStash = () => setStash(initStash())

const initNewGameShop = () => setShopItems(initShopItems())

const initNewGameEntities = () => {
    initNewGameEnemies()
    initNewGameInteractables()
}

const initNewGameEnemies = () => setEnemies(initEnemies())

const initNewGameInteractables = () => setInteractables(initInteractables())

const initConstants = () => {
    setUpPressed(             false)
    setDownPressed(           false)
    setLeftPressed(           false)
    setRightPressed(          false)
    setAllowMove(             true)
    setSprint(                false)
    setSprintPressed(         false)
    setElementInteractedWith( null)
    setTargets(               [])
    setPause(                 false)
    setPauseCause(            null)
    setDraggedItem(           null)
    setMouseX(                null)
    setMouseY(                null)
    setReloading(             false)
    setShootPressed(          false)
    setShooting(              false)
    setShootCounter(          0)
    setGrabbed(               false)
    setThrowCounter(          0)
    setExplosionDamageCounter(0)
    setAnimatedLimbs(         [])
    setWaitingFunctions(      [])
    setPlayingDialogue(       null)
    setNoOffenseCounter(      0)
    setStunnedCounter(        0)
    setPlayerAngle(           0)
    setPlayerAngleState(      0)
    setPlayerAimAngle(        0)
    setAimMode(               false)
}

const initNewGameVariables = (difficulty) => {
    const newGameVariables = {
        mapX :                 0,
        mapY :                 0,
        playerX :              750,
        playerY :              400,
        currentRoomId :        1,
        roomTop :              -500,
        roomLeft :             500,
        playerSpeed :          5,
        maxStamina :           600,
        stamina :              600,
        maxHealth :            100,
        health :               100,
        refillStamina :        false,
        weaponWheel :          [null, null, null, null],
        equippedWeaponId :     null,
        noOffenseCounter :     0,
        stunnedCounter :       0,
        entityId :             1,
        burning :              0,
        poisoned :             false,
        criticalChance :       0.01,
        adrenalinesDropped :   0,
        healthPotionsDropped : 0,
        luckPillsDropped :     0,
        energyDrinksDropped :  0,
        infection :            [],
        equippedTorchId :      null,
        roundsFinished :       0,
        timesSaved:            0,
        playthroughId:         Date.now(),
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
    setPlaythroughId(       variables.playthroughId)
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
    localStorage.setItem('last-slot-used', slotNumber)
}

const savePasswords = (slotNumber) => saveMapAsString(slotNumber, 'passwords', getPasswords())

const saveMapAsString = (slotNumber, entityType, entities) => {
    let data2save = {}
    for ( const [key, entitiesOfKey] of entities.entries() ) {
        data2save = {
            ...data2save,
            [key] : entitiesOfKey
        }
    }
    localStorage.setItem(`slot-${slotNumber}-${entityType}`, JSON.stringify(data2save))
}

const saveStats = (slotNumber) =>
    localStorage.setItem(`slot-${slotNumber}`, JSON.stringify({
        timeStamp: Date.now(),
        room: rooms.get(getCurrentRoomId()).label,
        saves: getTimesSaved(),
        difficulty: getDifficulty(),
        rounds: getRoundsFinished()
    }))

const saveProgress = (slotNumber) => simpleSave(slotNumber, 'progress', getProgress())

const saveInteractables = (slotNumber) => saveMapAsString(slotNumber, 'interactables', getInteractables())

const simpleSave = (slotNumber, postfix, data2save) => 
    localStorage.setItem(`slot-${slotNumber}-${postfix}`, JSON.stringify(data2save))

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

    localStorage.setItem(`slot-${slotNumber}-enemies`, JSON.stringify(data2save))
}

const saveVariables = (slotNumber) => {
    localStorage.setItem(`slot-${slotNumber}-variables`, JSON.stringify({
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
        playthroughId:         getPlaythroughId()
    }))
}

const saveShopItems = (slotNumber) => simpleSave(slotNumber, 'shop-items', getShopItems())

const saveInventory = (slotNumber) => simpleSave(slotNumber, 'inventory', getInventory())

const saveStash = (slotNumber) => simpleSave(slotNumber, 'stash', getStash())

export const loadGameFromSlot = (slotNumber) => {
    initConstants()
    loadPasswords(    slotNumber)
    loadStats(        slotNumber)
    laodProgress(     slotNumber)
    loadInteractables(slotNumber)
    loadEnemies(      slotNumber)
    loadVariables(    slotNumber)
    loadShopItems(    slotNumber)
    loadInventory(    slotNumber)
    loadStash(        slotNumber)
    setLoaders(       initLoaders())
    localStorage.setItem('last-slot-used', slotNumber)
}

const loadPasswords = (slotNumber) => loadStringAsMap(slotNumber, 'passwords', setPasswords, false)

const loadStringAsMap = (slotNumber, entityType, setter, toNumber = true) => {
    const data2Load = new Map([])
    const data = JSON.parse(localStorage.getItem(`slot-${slotNumber}-${entityType}`))
    Object.getOwnPropertyNames(data).forEach(name => data2Load.set(toNumber ? Number(name) : name, data[name]))
    setter(data2Load)
}

const loadStats = (slotNumber) => {
    const { saves, difficulty, rounds } = JSON.parse(localStorage.getItem(`slot-${slotNumber}`))
    setTimesSaved(saves)
    setDifficulty(difficulty)
    setRoundsFinished(rounds)
}

const laodProgress = (slotNumber) => simpleLoad(slotNumber, 'progress', setProgress)

const simpleLoad = (slotNumber, postfix, setter) =>
    setter(JSON.parse(localStorage.getItem(`slot-${slotNumber}-${postfix}`)))

const loadInteractables = (slotNumber) => loadStringAsMap(slotNumber, 'interactables', setInteractables)

const loadEnemies = (slotNumber) => {
    const data2Load = new Map([])
    const data = JSON.parse(localStorage.getItem(`slot-${slotNumber}-enemies`))
    Object.getOwnPropertyNames(data).forEach(name => {
        data2Load.set(Number(name), data[name].map(enemy => buildEnemy(enemy)))
    })
    setEnemies(data2Load)
}

const loadVariables = (slotNumber) => setVariables(JSON.parse(localStorage.getItem(`slot-${slotNumber}-variables`)))

const loadShopItems = (slotNumber) => simpleLoad(slotNumber, 'shop-items', setShopItems)

const loadInventory = (slotNumber) => simpleLoad(slotNumber, 'inventory', setInventory)

const loadStash = (slotNumber) => simpleLoad(slotNumber, 'stash', setStash)
import { Wall } from './wall.js'
import { Room } from './room.js'
import { object2Element } from './util.js'
import { buildEnemy } from './enemy/enemy-factory.js'
import { getStash, initStash, setStash } from './stash.js'
import { getShopItems, initShopItems, setShopItems } from './shop-item.js'
import { getProgress, initProgress, setProgress } from './progress-manager.js'
import { getPasswords, initPasswords, setPasswords } from './password-manager.js'
import { getInventory, initInventory, pickupDrop, setInventory } from './inventory.js'
import { getChaos, getRandomizedWeapons, setChaos, setEnemyId, setRandomizedWeapons, setSpawnCounter } from './survival/variables.js'
import { GunDrop, Lever, PC, PistolAmmo, Stash, VendingMachine } from './interactables.js'
import {
    getEnemies,
    getInteractables,
    getLoaders,
    getRooms,
    getWalls,
    initEnemies,
    initInteractables,
    initLoaders,
    setEnemies,
    setInteractables,
    setLoaders,
    setRooms,
    setWalls
} from './entities.js'
import { 
    ARCTIC_WARFERE,
    BENELLI_M4,
    GLOCK,
    M1911,
    MAUSER,
    MP5K,
    P90,
    PARKER_HALE_M_85,
    PPSH,
    REMINGTON_1858,
    REMINGTON_870,
    REVOLVER,
    SPAS,
    STEYR_SSG_69,
    UZI } from './loot.js'
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
    setWeaponWheel
} from './variables.js'

export const prepareNewGameData = (difficulty) => {
    initRooms()
    initWalls()
    initPasswords()
    initNewGameLoaders()
    initNewGameProgress()
    initNewGameInventory()
    initNewGameStash()
    initNewGameShop()
    initNewGameVariables(undefined, undefined, difficulty)
    initNewGameEntities()
    initConstants()
    pickupDrop(object2Element(new PistolAmmo(null, null, 30)))
}

const initRooms = () => setRooms(new Map([[1, new Room(1, 3000, 2000, 'Main Hall', 10)]]))

const initWalls = () => setWalls(new Map([
    [1, [
        new Wall(200, 200, 200, null, 200),
        new Wall(200, 200, 200, null, null, 200),
        new Wall(100, 500, 800, null, null, 500),
        new Wall(200, 200, null, 200, 200),
        new Wall(200, 200, null, 200, null, 200),
        new Wall(100, 500, null, 800, 500),
        new Wall(500, 100, 1000, null, 200),
        new Wall(500, 100, null, 1000, null, 200),
        ]
    ]
]) )

const initNewGameLoaders = () => setLoaders(initLoaders())

const initNewGameProgress = () => setProgress(initProgress())

const initNewGameInventory = () => setInventory(initInventory())

const initNewGameStash = () => setStash(initStash())

const initNewGameShop = () => setShopItems(initShopItems())

const initNewGameEntities = () => {
    initEnemies(new Map([[1, []]]))
    initInteractables(new Map([[1, [new PC(20, 20), new Stash(2900, 1950), new VendingMachine(2950, 50), new Lever(1400, 1000), new GunDrop(1400, 1200, GLOCK, 10, 1, 1, 1, 1, 1)]]]))
}

export const initConstants = () => {
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

export const initNewGameVariables = (spawnX = 1500, spawnY = 1000, difficulty) => {
    const newGameVariables = {
        mapX :                 0,
        mapY :                 0,
        playerX :              2 * spawnX,
        playerY :              2 * spawnY,
        currentRoomId :        1,
        roomTop :              spawnY,
        roomLeft :             spawnX,
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
        entityId :             6,
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
        enemyId:               0,
        spawnCounter:          0,
        chaos:                 0,
        randomizedWeapons:     getRandomWeaponOrder(),
        difficulty,
    }
    setVariables(newGameVariables)
}

const getRandomWeaponOrder = () => 
    [
        MP5K, REMINGTON_870, ARCTIC_WARFERE, M1911, UZI, SPAS, STEYR_SSG_69, 
        REVOLVER, MAUSER, PPSH, BENELLI_M4, PARKER_HALE_M_85, P90, REMINGTON_1858
    ].sort(() => Math.random() - 0.5)

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
    setEnemyId(             variables.enemyId)
    setSpawnCounter(        variables.spawnCounter)
    setChaos(               variables.chaos)
    setRandomizedWeapons(   variables.randomizedWeapons)
}

export const saveAtSlot = (slotNumber) => {
    setTimesSaved(getTimesSaved() + 1)
    saveRooms(        slotNumber)
    saveWalls(        slotNumber)
    saveLoaders(      slotNumber)
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

const saveRooms = (slotNumber) => saveMapAsString(slotNumber, 'rooms', getRooms())

const saveWalls = (slotNumber) => saveMapAsString(slotNumber, 'walls', getWalls())

const saveLoaders = (slotNumber) => saveMapAsString(slotNumber, 'loaders', getLoaders())

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
        room: getRooms().get(getCurrentRoomId()).label,
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
        playthroughId:         getPlaythroughId(),
        chaos:                 getChaos(),
        randomizedWeapons:     getRandomizedWeapons()
    }))
}

const saveShopItems = (slotNumber) => simpleSave(slotNumber, 'shop-items', getShopItems())

const saveInventory = (slotNumber) => simpleSave(slotNumber, 'inventory', getInventory())

const saveStash = (slotNumber) => simpleSave(slotNumber, 'stash', getStash())

export const loadGameFromSlot = (slotNumber) => {
    initConstants()
    loadRooms(        slotNumber)
    loadPasswords(    slotNumber)
    loadLoaders(      slotNumber)
    loadWalls(        slotNumber)
    loadStats(        slotNumber)
    loadProgress(     slotNumber)
    loadInteractables(slotNumber)
    loadEnemies(      slotNumber)
    loadVariables(    slotNumber)
    loadShopItems(    slotNumber)
    loadInventory(    slotNumber)
    loadStash(        slotNumber)
    localStorage.setItem('last-slot-used', slotNumber)
}

const loadRooms = (slotNumber) => loadStringAsMap(slotNumber, 'rooms', setRooms)

const loadWalls = (slotNumber) => loadStringAsMap(slotNumber, 'walls', setWalls)

const loadLoaders = (slotNumber) => loadStringAsMap(slotNumber, 'loaders', setLoaders)

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

const loadProgress = (slotNumber) => simpleLoad(slotNumber, 'progress', setProgress)

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
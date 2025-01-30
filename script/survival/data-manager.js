import { buildEnemy } from '../enemy/enemy-factory.js'
import {
    getDialogues,
    getEnemies,
    getInteractables,
    getLoaders,
    getPopups,
    getRooms,
    getWalls,
    initEnemies,
    initInteractables,
    initLoaders,
    setDialogues,
    setEnemies,
    setInteractables,
    setLoaders,
    setPopups,
    setRooms,
    setWalls,
} from '../entities.js'
import { getGunUpgradableDetail } from '../gun-details.js'
import { GunDrop, Lever, Note, PC, PistolAmmo, Stash, VendingMachine } from '../interactables.js'
import { getInventory, initInventory, pickupDrop, setInventory } from '../inventory.js'
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
    UZI,
} from '../loot.js'
import { getPasswords, initPasswords, setPasswords } from '../password-manager.js'
import { Popup } from '../popup-manager.js'
import { getProgress, initProgress, setProgress } from '../progress-manager.js'
import { Progress } from '../progress.js'
import { Room } from '../room.js'
import { IS_MOBILE } from '../script.js'
import { getShopItems, initShopItems, setShopItems } from '../shop-item.js'
import { getStash, initStash, setStash } from '../stash.js'
import { difficulties, object2Element } from '../util.js'
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
    setAimJoystickAngle,
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
    setFoundTarget,
    setGrabbed,
    setHealth,
    setHealthPotionsDropped,
    setInfection,
    setIsSearching4Target,
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
    setSuitableTargetAngle,
    setTargets,
    setThrowCounter,
    setTimesSaved,
    setUpPressed,
    setWaitingFunctions,
    setWeaponWheel,
} from '../variables.js'
import { Wall } from '../wall.js'
import {
    getChaos,
    getRandomizedWeapons,
    setChaos,
    setCurrentChaosEnemies,
    setCurrentChaosSpawned,
    setEnemiesKilled,
    setRandomizedWeapons,
    setSpawnCounter,
} from './variables.js'

let startingPistol = null
export const prepareNewSurvivalData = () => {
    startingPistol = getRandomStartingPistol()
    initNewSurvivalVariables(undefined, undefined, difficulties.MIDDLE)
    initRooms()
    initWalls()
    initPasswords()
    initNewSurvivalLoaders()
    initNewSurvivalProgress()
    initNewSurvivalInventory()
    initNewSurvivalStash()
    initNewSurvivalShop()
    initNewSurvivalEntities()
    initConstants()
    pickupDrop(object2Element(new PistolAmmo(null, null, 30)))
    if (!IS_MOBILE) {
        pickupDrop(
            object2Element(
                new Note(
                    null,
                    null,
                    'Controls',
                    'Explanation of game controls',
                    `
                    <div>W , A , S , D => Movement</div>
                    <div>F => Interact</div>
                    <div>Shift => Sprint</div>
                    <div>Tab => Open inventory</div>
                    <div>1, 2, 3, 4 , Mouse wheel => Switch weapon slot</div>
                    <div>Right click => Aim</div>
                    <div>Left click + Aim => shoot</div>
                    <div>H => Use bandage</div>
                    `,
                    Progress.builder().setOnExamineProgress2Active('1005'),
                ),
            ),
        )
    }
    initNewSurvivalPopups()
    initNewSurvivalDialogues()
}

const initRooms = () =>
    setRooms(
        new Map([
            [1, new Room(1, 3000, 2000, 'Main Hall', 10, Progress.builder().setProgress2Active('1000'), '#9ea395')],
        ]),
    )

const initWalls = () =>
    setWalls(
        new Map([
            [
                1,
                [
                    new Wall(200, 200, 200, null, 200),
                    new Wall(200, 200, 200, null, null, 200),
                    new Wall(100, 500, 800, null, null, 500),
                    new Wall(200, 200, null, 200, 200),
                    new Wall(200, 200, null, 200, null, 200),
                    new Wall(100, 500, null, 800, 500),
                    new Wall(500, 100, 1000, null, 200),
                    new Wall(500, 100, null, 1000, null, 200),
                ],
            ],
        ]),
    )

const initNewSurvivalLoaders = () => setLoaders(initLoaders())

const initNewSurvivalProgress = () => setProgress(initProgress())

const initNewSurvivalInventory = () => setInventory(initInventory())

const initNewSurvivalStash = () => setStash(initStash())

const initNewSurvivalShop = () => setShopItems(initShopItems())

const initNewSurvivalEntities = () => {
    initEnemies(new Map([[1, []]]))
    initInteractables(
        new Map([
            [
                1,
                [
                    new PC(20, 20),
                    new Stash(100, 20),
                    new VendingMachine(200, 20),
                    new Lever(1400, 1000),
                    new GunDrop(
                        1400,
                        1200,
                        startingPistol,
                        getGunUpgradableDetail(startingPistol, 'magazine', 1),
                        1,
                        1,
                        1,
                        1,
                        1,
                    ),
                ],
            ],
        ]),
    )
}

const initNewSurvivalPopups = () => {
    setPopups([])
    if (localStorage.getItem('survival-tutorial-done') === 'DONE') return
    getPopups().push(new Popup(`Welcome to survival mode!`, { renderProgress: '1000', progress2Active: '1001' }, 3000))
    getPopups().push(
        new Popup(
            `In this mode, you need to survive as many chaos waves as possible`,
            { renderProgress: '1001', progress2Active: '1002' },
            10000,
        ),
    )
    getPopups().push(
        new Popup(
            `To end a chaos, you need to defeat all the enemies`,
            { renderProgress: '1002', progress2Active: '1003' },
            10000,
        ),
    )
    getPopups().push(
        new Popup(
            `Earn resources and money during chaos waves and manage your items to prepare for the next chaos`,
            { renderProgress: '1003', progress2Active: '1004' },
            10000,
        ),
    )
    if (!IS_MOBILE) {
        getPopups().push(
            new Popup(
                `Use <span>Tab</span> to open inventory and view controls in the note`,
                { renderProgress: '1004' },
                10000,
            ),
        )
    }
    getPopups().push(
        new Popup(
            `Trigger a chaos by toggling the lever when you are ready`,
            { renderProgress: IS_MOBILE ? '1004' : '1005' },
            10000,
        ),
    )
}

const initNewSurvivalDialogues = () => setDialogues([])

export const initConstants = () => {
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
    setEnemiesKilled(0)
    setCurrentChaosEnemies(null)
    setCurrentChaosSpawned(null)
    setSpawnCounter(0)
    setIsSearching4Target(false)
    setFoundTarget(null)
    setSuitableTargetAngle(null)
    setAimJoystickAngle(null)
}

export const initNewSurvivalVariables = (spawnX = 1500, spawnY = 1000, difficulty) => {
    const NewSurvivalVariables = {
        mapX: 0,
        mapY: 0,
        playerX: 2 * spawnX,
        playerY: 2 * spawnY,
        currentRoomId: 1,
        roomTop: spawnY,
        roomLeft: spawnX,
        playerSpeed: 5,
        maxStamina: 600,
        stamina: 600,
        maxHealth: 100,
        health: 100,
        refillStamina: false,
        weaponWheel: [null, null, null, null],
        equippedWeaponId: null,
        noOffenseCounter: 0,
        stunnedCounter: 0,
        entityId: 6,
        burning: 0,
        poisoned: false,
        criticalChance: 0.01,
        adrenalinesDropped: 0,
        healthPotionsDropped: 0,
        luckPillsDropped: 0,
        energyDrinksDropped: 0,
        infection: [],
        equippedTorchId: null,
        roundsFinished: 0,
        timesSaved: 0,
        playthroughId: Date.now(),
        chaos: 0,
        randomizedWeapons: getRandomWeaponOrder(),
        difficulty,
    }
    setVariables(NewSurvivalVariables)
}

const getRandomStartingPistol = () => [GLOCK, M1911, MAUSER].sort(() => Math.random() - 0.5)[0]

const getRandomWeaponOrder = () =>
    [
        GLOCK,
        MP5K,
        REMINGTON_870,
        ARCTIC_WARFERE,
        M1911,
        UZI,
        SPAS,
        STEYR_SSG_69,
        REVOLVER,
        MAUSER,
        PPSH,
        BENELLI_M4,
        PARKER_HALE_M_85,
        P90,
        REMINGTON_1858,
    ]
        .filter(item => item !== startingPistol)
        .sort(() => Math.random() - 0.5)

const setVariables = variables => {
    setMapX(variables.mapX)
    setMapY(variables.mapY)
    setPlayerX(variables.playerX)
    setPlayerY(variables.playerY)
    setCurrentRoomId(variables.currentRoomId)
    setRoomTop(variables.roomTop)
    setRoomLeft(variables.roomLeft)
    setPlayerSpeed(variables.playerSpeed)
    setPlayerAngle(variables.playerAngle)
    setPlayerAngleState(variables.playerAngleState)
    setPlayerAimAngle(variables.playerAimAngle)
    setMaxStamina(variables.maxStamina)
    setStamina(variables.stamina)
    setMaxHealth(variables.maxHealth)
    setHealth(variables.health)
    setRefillStamina(variables.refillStamina)
    setAimMode(variables.aimMode), setWeaponWheel(variables.weaponWheel)
    setEquippedWeaponId(variables.equippedWeaponId)
    setStunnedCounter(variables.stunnedCounter)
    setEntityId(variables.entityId)
    setBurning(variables.burning)
    setPoisoned(variables.poisoned)
    setCriticalChance(variables.criticalChance)
    setAdrenalinesDropped(variables.adrenalinesDropped)
    setHealthPotionsDropped(variables.healthPotionsDropped)
    setLuckPillsDropped(variables.luckPillsDropped)
    setEnergyDrinksDropped(variables.energyDrinksDropped)
    setInfection(variables.infection)
    setEquippedTorchId(variables.equippedTorchId)
    setRoundsFinished(variables.roundsFinished)
    setDifficulty(variables.difficulty)
    setTimesSaved(variables.timesSaved)
    setPlaythroughId(variables.playthroughId)
    setChaos(variables.chaos)
    setRandomizedWeapons(variables.randomizedWeapons)
}

export const saveSurvivalAtSlot = slotNumber => {
    setTimesSaved(getTimesSaved() + 1)
    saveRooms(slotNumber)
    saveWalls(slotNumber)
    saveLoaders(slotNumber)
    savePasswords(slotNumber)
    saveStats(slotNumber)
    saveProgress(slotNumber)
    saveInteractables(slotNumber)
    saveEnemies(slotNumber)
    saveVariables(slotNumber)
    saveShopItems(slotNumber)
    saveInventory(slotNumber)
    saveStash(slotNumber)
    saveDialogues(slotNumber)
    savePopups(slotNumber)
    localStorage.setItem('last-slot-used', 'survival-' + slotNumber)
}

const saveRooms = slotNumber => saveMapAsString(slotNumber, 'rooms', getRooms())

const saveWalls = slotNumber => saveMapAsString(slotNumber, 'walls', getWalls())

const saveLoaders = slotNumber => saveMapAsString(slotNumber, 'loaders', getLoaders())

const savePasswords = slotNumber => saveMapAsString(slotNumber, 'passwords', getPasswords())

const saveMapAsString = (slotNumber, entityType, entities) => {
    let data2save = {}
    for (const [key, entitiesOfKey] of entities.entries()) {
        data2save = {
            ...data2save,
            [key]: entitiesOfKey,
        }
    }
    localStorage.setItem(`survival-slot-${slotNumber}-${entityType}`, JSON.stringify(data2save))
}

const saveStats = slotNumber =>
    localStorage.setItem(
        `survival-slot-${slotNumber}`,
        JSON.stringify({
            timeStamp: Date.now(),
            saves: getTimesSaved(),
            chaos: getChaos(),
        }),
    )

const saveProgress = slotNumber => simpleSave(slotNumber, 'progress', getProgress())

const saveInteractables = slotNumber => saveMapAsString(slotNumber, 'interactables', getInteractables())

const simpleSave = (slotNumber, postfix, data2save) =>
    localStorage.setItem(`survival-slot-${slotNumber}-${postfix}`, JSON.stringify(data2save))

const saveEnemies = slotNumber => {
    let data2save = {}
    for (const [roomId, enemies] of getEnemies().entries()) {
        data2save = {
            ...data2save,
            [roomId]: enemies.map(enemy => {
                let result = {}
                Object.getOwnPropertyNames(enemy).forEach(name => {
                    if (name.toLowerCase().includes('service')) return
                    result = {
                        ...result,
                        [name]: enemy[name],
                    }
                })
                return result
            }),
        }
    }

    localStorage.setItem(`survival-slot-${slotNumber}-enemies`, JSON.stringify(data2save))
}

const saveVariables = slotNumber => {
    localStorage.setItem(
        `survival-slot-${slotNumber}-variables`,
        JSON.stringify({
            mapX: getMapX(),
            mapY: getMapY(),
            playerX: getPlayerX(),
            playerY: getPlayerY(),
            currentRoomId: getCurrentRoomId(),
            roomTop: getRoomTop(),
            roomLeft: getRoomLeft(),
            playerSpeed: getPlayerSpeed(),
            playerAngle: getPlayerAngle(),
            playerAngleState: getPlayerAngleState(),
            playerAimAngle: getPlayerAimAngle(),
            maxStamina: getMaxStamina(),
            stamina: getStamina(),
            maxHealth: getMaxHealth(),
            health: getHealth(),
            refillStamina: getRefillStamina(),
            aimMode: getAimMode(),
            weaponWheel: getWeaponWheel(),
            equippedWeaponId: getEquippedWeaponId(),
            entityId: getEntityId(),
            burning: getBurning(),
            poisoned: getPoisoned(),
            criticalChance: getCriticalChance(),
            adrenalinesDropped: getAdrenalinesDropped(),
            healthPotionsDropped: getHealthPotionsDropped(),
            luckPillsDropped: getLuckPillsDropped(),
            energyDrinksDropped: getEnergyDrinksDropped(),
            infection: getInfection(),
            equippedTorchId: getEquippedTorchId(),
            roundsFinished: getRoundsFinished(),
            timesSaved: getTimesSaved(),
            difficulty: getDifficulty(),
            playthroughId: getPlaythroughId(),
            chaos: getChaos(),
            randomizedWeapons: getRandomizedWeapons(),
        }),
    )
}

const saveShopItems = slotNumber => simpleSave(slotNumber, 'shop-items', getShopItems())

const saveInventory = slotNumber => simpleSave(slotNumber, 'inventory', getInventory())

const saveStash = slotNumber => simpleSave(slotNumber, 'stash', getStash())

const saveDialogues = slotNumber => simpleSave(slotNumber, 'dialogues', getDialogues())

const savePopups = slotNumber => simpleSave(slotNumber, 'popups', getPopups())

export const loadSurvivalFromSlot = slotNumber => {
    initConstants()
    loadRooms(slotNumber)
    loadPasswords(slotNumber)
    loadLoaders(slotNumber)
    loadWalls(slotNumber)
    loadStats(slotNumber)
    loadProgress(slotNumber)
    loadInteractables(slotNumber)
    loadEnemies(slotNumber)
    loadVariables(slotNumber)
    loadShopItems(slotNumber)
    loadInventory(slotNumber)
    loadStash(slotNumber)
    localStorage.setItem('last-slot-used', 'survival-' + slotNumber)
}

const loadRooms = slotNumber => loadStringAsMap(slotNumber, 'rooms', setRooms)

const loadWalls = slotNumber => loadStringAsMap(slotNumber, 'walls', setWalls)

const loadLoaders = slotNumber => loadStringAsMap(slotNumber, 'loaders', setLoaders)

const loadPasswords = slotNumber => loadStringAsMap(slotNumber, 'passwords', setPasswords, false)

const loadStringAsMap = (slotNumber, entityType, setter, toNumber = true) => {
    const data2Load = new Map([])
    const data = JSON.parse(localStorage.getItem(`survival-slot-${slotNumber}-${entityType}`))
    Object.getOwnPropertyNames(data).forEach(name => data2Load.set(toNumber ? Number(name) : name, data[name]))
    setter(data2Load)
}

const loadStats = slotNumber => {
    const { saves } = JSON.parse(localStorage.getItem(`survival-slot-${slotNumber}`))
    setTimesSaved(saves)
}

const loadProgress = slotNumber => simpleLoad(slotNumber, 'progress', setProgress)

const simpleLoad = (slotNumber, postfix, setter) =>
    setter(JSON.parse(localStorage.getItem(`survival-slot-${slotNumber}-${postfix}`)))

const loadInteractables = slotNumber => loadStringAsMap(slotNumber, 'interactables', setInteractables)

const loadEnemies = slotNumber => {
    const data2Load = new Map([])
    const data = JSON.parse(localStorage.getItem(`survival-slot-${slotNumber}-enemies`))
    Object.getOwnPropertyNames(data).forEach(name => {
        data2Load.set(
            Number(name),
            data[name].map(enemy => buildEnemy(enemy)),
        )
    })
    setEnemies(data2Load)
}

const loadVariables = slotNumber =>
    setVariables(JSON.parse(localStorage.getItem(`survival-slot-${slotNumber}-variables`)))

const loadShopItems = slotNumber => simpleLoad(slotNumber, 'shop-items', setShopItems)

const loadInventory = slotNumber => simpleLoad(slotNumber, 'inventory', setInventory)

const loadStash = slotNumber => simpleLoad(slotNumber, 'stash', setStash)

import { initialStash, setStash } from './stash.js'
import { setProgress } from './progress-manager.js'
import { initPasswords } from './password-manager.js'
import { initialInventory, setInventory } from './inventory.js'
import { initialShopItems, setShopItems } from './shop-item.js'
import { initEnemies, initialInteractables, initLoaders, setEnemies, setInteractables, setLoaders } from './entities.js'
import { 
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
        playerAngle : 0,
        playerAngleState : 0,
        playerAimAngle : 0,
        maxStamina : 600,
        stamina : 600,
        maxHealth : 100,
        health : 100,
        refillStamina : false,
        aimMode : false,
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
    setNoOffenseCounter(    variables.noOffenseCounter)
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
}
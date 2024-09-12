import { getStash } from './stash.js'
import { getInventory } from './inventory.js'
import { getShopItems } from './shop-item.js'
import { enemies } from './enemy/util/enemies.js'
import { interactables } from './interactables.js'
import { getProgress } from './progress-manager.js'
import { 
    getCurrentRoomBullets,
    getCurrentRoomDoors,
    getCurrentRoomExplosions,
    getCurrentRoomFlames,
    getCurrentRoomInteractables,
    getCurrentRoomLoaders,
    getCurrentRoomPoisons,
    getCurrentRoomSolid,
    getCurrentRoomThrowables } from './elements.js'
import { 
    getAdrenalinesDropped,
    getAimMode,
    getBurning,
    getCriticalChance,
    getCurrentRoomId,
    getElementInteractedWith,
    getEnergyDrinksDropped,
    getEntityId,
    getEquippedWeaponId,
    getEquippedWeaponObject,
    getGrabbed,
    getHealth,
    getHealthPotionsDropped,
    getLogCounter,
    getLuckPillsDropped,
    getMaxHealth,
    getMaxStamina,
    getPlayerAimAngle,
    getPlayerAngle,
    getPlayerAngleState,
    getPlayerSpeed,
    getPoisoned,
    getRefillStamina,
    getReloading,
    getShooting,
    getSprintPressed,
    getStamina,
    getTargets,
    getWeaponWheel,
    setLogCounter } from './variables.js'
import { walls } from './walls.js'
import { loaders } from './loaders.js'

export const manageLogs = () => {
    if ( getLogCounter() === 30 ) {
        logInfo()
        setLogCounter(0)
        return
    }
    setLogCounter(getLogCounter() + 1)
}

export const logInfo = () => {
    console.log('progress',                getProgress());
    console.log('inventory',               getInventory());
    console.log('enemies',                 enemies.get(getCurrentRoomId()));
    console.log('bullets',                 getCurrentRoomBullets());
    console.log('doors',                   getCurrentRoomDoors());
    console.log('explosions',              getCurrentRoomExplosions());
    console.log('flames',                  getCurrentRoomFlames());
    console.log('interactables-elements',  getCurrentRoomInteractables());
    console.log('interactable-objects',    interactables.get(getCurrentRoomId()));
    console.log('solid',                   getCurrentRoomSolid());
    console.log('walls',                   walls.get(getCurrentRoomId()));
    console.log('poisons',                 getCurrentRoomPoisons());
    console.log('loader-elements',         getCurrentRoomLoaders());
    console.log('loader-objects',          loaders.get(getCurrentRoomId()));
    console.log('throwables',              getCurrentRoomThrowables());
    console.log('player-speed',            getPlayerSpeed());
    console.log('player-angle',            getPlayerAngle());
    console.log('player-angle-state',      getPlayerAngleState());
    console.log('player-aim-angle',        getPlayerAimAngle());
    console.log('max-stamina',             getMaxStamina());
    console.log('stamina',                 getStamina());
    console.log('max-health',              getMaxHealth());
    console.log('health',                  getHealth());
    console.log('refill-stamina',          getRefillStamina());
    console.log('sprint-pressed',          getSprintPressed());
    console.log('aim-mode',                getAimMode());
    console.log('weapon-wheel',            getWeaponWheel());
    console.log('equipped-weapon-id',      getEquippedWeaponId());
    console.log('equipped-weapon-object',  getEquippedWeaponObject());
    console.log('element-interacted-with', getElementInteractedWith());
    console.log('targets',                 getTargets());
    console.log('reloading',               getReloading());
    console.log('shooting',                getShooting());
    console.log('entity-id',               getEntityId());
    console.log('grabbed',                 getGrabbed());
    console.log('poisoned',                getPoisoned());
    console.log('burning',                 getBurning());
    console.log('critical-chance',         getCriticalChance());
    console.log('adrenalines-dropped',     getAdrenalinesDropped());
    console.log('health-potions-dropped',  getHealthPotionsDropped());
    console.log('luck-pills-dropped',      getLuckPillsDropped());
    console.log('energy-drinks-dropped',   getEnergyDrinksDropped());
    console.log('stash',                   getStash());
    console.log('shop-items',              getShopItems());

    console.log('############################################');
    console.log('############################################');
}
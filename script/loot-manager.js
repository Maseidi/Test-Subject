import { removeDrop } from './inventory.js'
import { element2Object, nextId } from './util.js'
import { renderInteractable } from './room-loader.js'
import { getCurrentRoom, getCurrentRoomSolid, setCurrentRoomSolid } from './elements.js'
import { 
    getAdrenalinesDropped,
    getCurrentRoomId,
    getEnergyDrinksDropped,
    getHealthPotionsDropped,
    getLuckPillsDropped, 
    setAdrenalinesDropped,
    setEnergyDrinksDropped,
    setHealthPotionsDropped,
    setLuckPillsDropped } from './variables.js'
import { 
    AdrenalineDrop,
    Antidote,
    Bandage,
    Coin,
    EnergyDrinkDrop,
    Flashbang,
    Grenade,
    HardDrive,
    HealthPotionDrop,
    interactables,
    LuckPillsDrop,
    MagnumAmmo,
    PistolAmmo,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo, 
    WeaponDrop} from './interactables.js'
import { 
    ADRENALINE,
    ANTIDOTE_LOOT,
    BANDAGE_LOOT,
    COIN_LOOT,
    ENERGY_DRINK,
    FLASHBANG_LOOT,
    GRENADE_LOOT,
    HARDDRIVE_LOOT,
    HEALTH_POTION,
    LUCK_PILLS,
    MAGNUM_AMMO_LOOT,
    PISTOL_AMMO_LOOT,
    RANDOM,
    RIFLE_AMMO_LOOT,
    SHOTGUN_SHELLS_LOOT,
    SMG_AMMO_LOOT } from './loot.js'

export const dropLoot = (rootElem, isEnemy) => {
    const root = element2Object(rootElem)
    const {left, top, loot: decision, 'loot-amount': amount, 'loot-progress': progress2Active } = root
    let loot
    if ( decision === RANDOM ) loot = dropRandomLoot(loot, left, top)
    else if ( !decision ) loot = undefined
    else loot = dropDeterminedLoot(decision, left, top, amount)
    if ( !isEnemy ) removeDrop(rootElem)
    else setCurrentRoomSolid(getCurrentRoomSolid().filter(solid => solid !== rootElem.firstElementChild))
    if ( !loot ) return
    let interactable = {...loot, left: left, top: top, id: nextId()}
    if ( progress2Active !== 'undefined' ) interactable = {...interactable, progress2Active}
    interactables.get(getCurrentRoomId()).push(interactable)
    renderInteractable(getCurrentRoom(), interactable)
}

const dropRandomLoot = (loot, left, top) => {
    if ( !loot ) loot = decideItemDrop(Grenade,       0.01, left, top, 1)
    if ( !loot ) loot = decideItemDrop(Flashbang,     0.01, left, top, 1)
    if ( !loot ) loot = decideItemDrop(MagnumAmmo,    0.02, left, top, 1)
    if ( !loot ) loot = decideItemDrop(HardDrive,     0.04, left, top, 1)
    if ( !loot ) loot = decideItemDrop(Bandage,        0.1, left, top, 1)
    if ( !loot ) loot = decideItemDrop(Antidote,       0.1, left, top, 1)
    if ( !loot ) loot = decideItemDrop(RifleAmmo,      0.1, left, top, 2)
    if ( !loot ) loot = decideItemDrop(ShotgunShells,  0.2, left, top, 5)
    if ( !loot ) loot = decideItemDrop(SmgAmmo,        0.3, left, top, 20)
    if ( !loot ) loot = decideItemDrop(Coin,           0.4, left, top, 1)
    if ( !loot ) loot = decideItemDrop(PistolAmmo,     0.6, left, top, 10)
    if ( !loot && getAdrenalinesDropped()   < 10 ) loot = decideItemDrop(AdrenalineDrop,   0.0001, left, top, 1)    
    if ( !loot && getHealthPotionsDropped() < 10 ) loot = decideItemDrop(HealthPotionDrop, 0.0001, left, top, 1)    
    if ( !loot && getEnergyDrinksDropped()  < 10 ) loot = decideItemDrop(EnergyDrinkDrop,      0.0001, left, top, 1)    
    if ( !loot && getLuckPillsDropped()     < 10 ) loot = decideItemDrop(LuckPillsDrop,    0.0001, left, top, 1)    
    return loot
}

const dropDeterminedLoot = (decision, left, top, amount) => {
    switch ( decision ) {
        case GRENADE_LOOT:
            return decideItemDrop(Grenade,       1, left, top, amount)
        case FLASHBANG_LOOT:
            return decideItemDrop(Flashbang,     1, left, top, amount)    
        case MAGNUM_AMMO_LOOT:
            return decideItemDrop(MagnumAmmo,    1, left, top, amount)
        case HARDDRIVE_LOOT:
            return decideItemDrop(HardDrive,     1, left, top, amount)
        case BANDAGE_LOOT:
            return decideItemDrop(Bandage,       1, left, top, amount)
        case ANTIDOTE_LOOT:
            return decideItemDrop(Antidote,      1, left, top, amount)
        case RIFLE_AMMO_LOOT:
            return decideItemDrop(RifleAmmo,     1, left, top, amount)
        case SHOTGUN_SHELLS_LOOT:
            return decideItemDrop(ShotgunShells, 1, left, top, amount)                   
        case SMG_AMMO_LOOT:
            return decideItemDrop(SmgAmmo,       1, left, top, amount)
        case COIN_LOOT:
            return decideItemDrop(Coin,          1, left, top, amount)
        case PISTOL_AMMO_LOOT:
            return decideItemDrop(PistolAmmo,    1, left, top, amount)
        case ADRENALINE:
            if ( getAdrenalinesDropped()   < 10 ) return decideItemDrop(AdrenalineDrop,   1, left, top, 1)
            break    
        case HEALTH_POTION:
            if ( getHealthPotionsDropped() < 10 ) return decideItemDrop(HealthPotionDrop, 1, left, top, 1)
            break    
        case ENERGY_DRINK:
            if ( getEnergyDrinksDropped()  < 10 ) return decideItemDrop(EnergyDrinkDrop,      1, left, top, 1)
            break    
        case LUCK_PILLS:
            if ( getLuckPillsDropped()     < 10 ) return decideItemDrop(LuckPillsDrop,    1, left, top, 1)
            break       
        default:
            return dropWeaponLoot(left, top, decision)    
    }
}

const decideItemDrop = (drop, chance, left, top, amount) => {
    if ( Math.random() < chance ) var result = new drop(left, top, amount)
    if ( result && result.name === ADRENALINE )    setAdrenalinesDropped(getAdrenalinesDropped()     + 1)            
    if ( result && result.name === HEALTH_POTION ) setHealthPotionsDropped(getHealthPotionsDropped() + 1)            
    if ( result && result.name === ENERGY_DRINK )  setEnergyDrinksDropped(getEnergyDrinksDropped()   + 1)            
    if ( result && result.name === LUCK_PILLS )    setLuckPillsDropped(getLuckPillsDropped()         + 1)            
    return result
}

const dropWeaponLoot = (left, top, name) => new WeaponDrop(left, top, name, 0, 1, 1, 1, 1, 1)
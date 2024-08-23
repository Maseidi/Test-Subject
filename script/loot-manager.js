import { removeDrop } from './inventory.js'
import { getCurrentRoom } from './elements.js'
import { getCurrentRoomId } from './variables.js'
import { element2Object, nextId } from './util.js'
import { renderInteractable } from './room-loader.js'
import { 
    Antidote,
    Bandage,
    Coin,
    Flashbang,
    Grenade,
    HardDrive,
    interactables,
    MagnumAmmo,
    PistolAmmo,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo, 
    WeaponDrop} from './interactables.js'
import { 
    ANTIDOTE_LOOT,
    BANDAGE_LOOT,
    COIN_LOOT,
    FLASHBANG_LOOT,
    GRENADE_LOOT,
    HARDDRIVE_LOOT,
    MAGNUM_AMMO_LOOT,
    PISTOL_AMMO_LOOT,
    RANDOM,
    RIFLE_AMMO_LOOT,
    SHOTGUN_SHELLS_LOOT,
    SMG_AMMO_LOOT } from './loot.js'

export const dropLoot = (rootElem) => {
    const root = element2Object(rootElem)
    const {left, top, loot: decision, 'loot-amount': amount} = root
    let loot
    if ( decision === RANDOM ) loot = dropRandomLoot(loot, left, top)
    else if ( !decision ) loot = undefined
    else loot = dropDeterminedLoot(decision, left, top, amount)
    removeDrop(rootElem)    
    if ( !loot ) return
    const interactable = {...loot, left: left, top: top, id: nextId()}
    interactables.get(getCurrentRoomId()).push(interactable)
    renderInteractable(getCurrentRoom(), interactable)
}

const dropRandomLoot = (loot, left, top) => {
    if ( !loot ) loot = decideItemDrop(Grenade, 0.01, left, top, 1)
    if ( !loot ) loot = decideItemDrop(Flashbang, 0.01, left, top, 1)
    if ( !loot ) loot = decideItemDrop(MagnumAmmo, 0.02, left, top, 1)
    if ( !loot ) loot = decideItemDrop(HardDrive, 0.04, left, top, 1)
    if ( !loot ) loot = decideItemDrop(Bandage, 0.1, left, top, 1)
    if ( !loot ) loot = decideItemDrop(Antidote, 0.1, left, top, 1)
    if ( !loot ) loot = decideItemDrop(RifleAmmo, 0.1, left, top, 2)
    if ( !loot ) loot = decideItemDrop(ShotgunShells, 0.2, left, top, 5)
    if ( !loot ) loot = decideItemDrop(SmgAmmo, 0.3, left, top, 20)
    if ( !loot ) loot = decideItemDrop(Coin, 0.4, left, top, 1)
    if ( !loot ) loot = decideItemDrop(PistolAmmo, 0.6, left, top, 10)
    return loot    
}

const dropDeterminedLoot = (decision, left, top, amount) => {
    switch ( decision ) {
        case GRENADE_LOOT:
            return decideItemDrop(Grenade, 1, left, top, amount)
        case FLASHBANG_LOOT:
            return decideItemDrop(Flashbang, 1, left, top, amount)    
        case MAGNUM_AMMO_LOOT:
            return decideItemDrop(MagnumAmmo, 1, left, top, amount)
        case HARDDRIVE_LOOT:
            return decideItemDrop(HardDrive, 1, left, top, amount)
        case BANDAGE_LOOT:
            return decideItemDrop(Bandage, 1, left, top, amount)
        case ANTIDOTE_LOOT:
            return decideItemDrop(Antidote, 1, left, top, amount)
        case RIFLE_AMMO_LOOT:
            return decideItemDrop(RifleAmmo, 1, left, top, amount)
        case SHOTGUN_SHELLS_LOOT:
            return decideItemDrop(ShotgunShells, 1, left, top, amount)                   
        case SMG_AMMO_LOOT:
            return decideItemDrop(SmgAmmo, 1, left, top, amount)
        case COIN_LOOT:
            return decideItemDrop(Coin, 1, left, top, amount)
        case PISTOL_AMMO_LOOT:
            return decideItemDrop(PistolAmmo, 1, left, top, amount)
        default:
            return dropWeaponLoot(left, top, decision)    
    }
}

const decideItemDrop = (drop, chance, left, top, amount) => {
    if ( Math.random() < chance ) var result = new drop(left, top, amount)        
    return result
}

const dropWeaponLoot = (left, top, name) => new WeaponDrop(left, top, name, 0, 1, 1, 1, 1, 1)
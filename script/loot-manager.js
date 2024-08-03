import { removeDrop } from './inventory.js'
import { getCurrentRoom } from './elements.js'
import { getCurrentRoomId } from './variables.js'
import { elementToObject, nextId } from './util.js'
import { renderInteractable } from './room-loader.js'
import { 
    Antidote,
    Bandage,
    Coin,
    HardDrive,
    interactables,
    MagnumAmmo,
    PistolAmmo,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo } from './interactables.js'

export const dropLoot = (rootElem) => {
    const root = elementToObject(rootElem)
    const {left, top} = root
    let loot
    loot = decideItemDrop(MagnumAmmo, 0.02, left, top, 1)
    if ( !loot ) loot = decideItemDrop(HardDrive, 0.04, left, top, 1)
    if ( !loot ) loot = decideItemDrop(Bandage, 0.1, left, top, 1)
    if ( !loot ) loot = decideItemDrop(Antidote, 0.1, left, top, 1)
    if ( !loot ) loot = decideItemDrop(RifleAmmo, 0.1, left, top, 2)
    if ( !loot ) loot = decideItemDrop(ShotgunShells, 0.2, left, top, 5)
    if ( !loot ) loot = decideItemDrop(SmgAmmo, 0.3, left, top, 20)
    if ( !loot ) loot = decideItemDrop(Coin, 0.4, left, top, 1)
    if ( !loot ) loot = decideItemDrop(PistolAmmo, 0.6, left, top, 10)
    removeDrop(rootElem)
    if ( !loot ) return
    const interactable = {...loot, left: left, top: top, id: nextId()}
    interactables.get(getCurrentRoomId()).push(interactable)
    renderInteractable(getCurrentRoom(), interactable)
}

const decideItemDrop = (drop, chance, left, top, amount) => {
    if ( Math.random() < chance ) var result = new drop(left, top, amount)
    return result
}
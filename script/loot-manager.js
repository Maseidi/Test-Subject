import { elementToObject } from './util.js'
import { getCurrentRoom } from './elements.js'
import { renderInteractable } from './room-loader.js'
import { findSuitableId, removeDrop } from './inventory.js'
import { Bandage, Coin, HardDrive, MagnumAmmo, PistolAmmo, RifleAmmo, ShotgunShells, SmgAmmo } from './interactables.js'

export const dropLoot = (rootElem) => {
    const root = elementToObject(rootElem)
    const {left, top} = root
    let loot
    loot = decideItemDrop(MagnumAmmo, 0.01, left, top, 1)
    if ( !loot ) loot = decideItemDrop(HardDrive, 0.02, left, top, 1)
    if ( !loot ) loot = decideItemDrop(Bandage, 0.05, left, top, 1)
    if ( !loot ) loot = decideItemDrop(RifleAmmo, 0.05, left, top, 2)
    if ( !loot ) loot = decideItemDrop(ShotgunShells, 0.1, left, top, 5)
    if ( !loot ) loot = decideItemDrop(SmgAmmo, 0.15, left, top, 20)
    if ( !loot ) loot = decideItemDrop(Coin, 0.2, left, top, 1)
    if ( !loot ) loot = decideItemDrop(PistolAmmo, 0.3, left, top, 10)
    removeDrop(rootElem)
    if ( !loot ) return
    const interactable = {...loot, left: left, top: top}
    let index = findSuitableId(interactable)
    renderInteractable(getCurrentRoom(), interactable, index)
}

const decideItemDrop = (drop, chance, left, top, amount) => {
    let result
    if ( Math.random() < chance ) result = new drop(left, top, amount)
    return result
}
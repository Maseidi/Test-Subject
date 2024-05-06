import { setPauseCause } from "./variables.js"
import { renderInventory } from "./inventory.js"
import { renderQuit } from "./user-interface.js"
import { getPauseContainer } from "./elements.js"
import { renderStore } from "./vending-machine.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { addClass, appendAll, elementToObject } from "./util.js"

export const renderStats = (item, root) => {
    setPauseCause('stats')
    const itemObj = elementToObject(item)
    const weaponStatsContainer = document.createElement('div')
    addClass(weaponStatsContainer, 'weapon-stats-container')
    addClass(weaponStatsContainer, 'ui-theme')
    const weaponStats = document.createElement('div')
    addClass(weaponStats, 'weapon-stats')
    const imgContainer = document.createElement('div')
    addClass(imgContainer, 'weapon-stats-img-container')
    const img = document.createElement('img')
    img.src = `../assets/images/${itemObj.name}.png`
    imgContainer.append(img)
    const weaponStatsName = document.createElement('div')
    addClass(weaponStatsName, 'weapon-stats-name')
    weaponStatsName.textContent = itemObj.heading
    const weaponStatsDesc = document.createElement('div')
    addClass(weaponStatsDesc, 'weapon-stats-desc')
    weaponStatsDesc.textContent = itemObj.description
    const damage = createStat(itemObj, 'damage', 'damage')
    const range = createStat(itemObj, 'range', 'range')
    const reload = createStat(itemObj, 'reload speed', 'reloadspeed')
    const magazine = createStat(itemObj, 'magazine', 'magazine')
    const firerate = createStat(itemObj, 'fire rate', 'firerate')
    appendAll(weaponStats, [imgContainer, weaponStatsName, weaponStatsDesc, damage, range, reload, magazine, firerate])
    weaponStatsContainer.append(weaponStats)
    getPauseContainer().firstElementChild.remove()
    getPauseContainer().append(weaponStatsContainer)
    renderStastQuit(root)
}

const renderStastQuit = (root) => renderQuit(() => {
    getPauseContainer().firstElementChild.remove()
    if (root === 'inventory') renderInventory()
    else if ( root === 'store' ) renderStore()    
    setPauseCause(root)
})

const createStat = (itemObj, title, name) => {
    const statContainer = document.createElement('div')
    addClass(statContainer, 'stat-container')
    const upper = document.createElement('div')
    addClass(upper, 'upper')
    const upperRight = document.createElement('div')
    addClass(upperRight, 'upper-right')
    const statName = document.createElement('p') 
    addClass(statName, 'stat-name')
    statName.textContent = title
    const statLvl = document.createElement('p')
    addClass(statLvl, 'stat-lvl')
    statLvl.textContent = `Lvl. ${itemObj[name+'lvl']}`
    const value = document.createElement('div')
    addClass(value, 'value')
    value.textContent = `${getValue(itemObj, name)}`
    const lower = document.createElement('div')
    addClass(lower, 'lower')
    for ( let i = 1; i <= 5; i++ ) {
        const level = document.createElement('div')
        if ( i <= itemObj[name+'lvl'] ) addClass(level, 'active')
        else addClass(level, 'inactive')   
        lower.append(level) 
    }
    appendAll(upperRight, [statLvl, value])
    appendAll(upper, [statName, upperRight])
    appendAll(statContainer, [upper, lower])
    return statContainer
}

const getValue = (itemObj, name) => {
    const equippedWeapon = getOwnedWeapons().get(itemObj.id)
    let result
    if ( name === 'damage' ) result = equippedWeapon.getDamage()
    else if ( name === 'range' ) result = equippedWeapon.getRange()
    else if ( name === 'reloadspeed' ) result = equippedWeapon.getReloadSpeed()
    else if ( name === 'magazine' ) result = equippedWeapon.getMagazine()
    else if ( name === 'firerate' ) result = equippedWeapon.getFireRate()
    return result    
}
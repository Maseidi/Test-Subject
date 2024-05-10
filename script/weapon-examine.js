import { getStat, getWeaponSpecs } from "./weapon-specs.js"
import { renderQuit } from "./user-interface.js"
import { getPauseContainer } from "./elements.js"
import {getInventory } from "./inventory.js"
import { addClass, appendAll, createAndAddClass } from "./util.js"

export const renderStats = (itemObj) => {
    const weaponStatsContainer = createAndAddClass('div', 'weapon-stats-container', 'ui-theme')
    const weaponStats = createAndAddClass('div', 'weapon-stats')
    const imgContainer = createAndAddClass('div', 'weapon-stats-img-container')
    const img = document.createElement('img')
    img.src = `../assets/images/${itemObj.name}.png`
    imgContainer.append(img)
    const weaponStatsName = createAndAddClass('div', 'weapon-stats-name')
    weaponStatsName.textContent = itemObj.heading
    weaponStatsName.style.color = `${getWeaponSpecs().get(itemObj.name).antivirus}`
    const weaponStatsDesc = createAndAddClass('div', 'weapon-stats-desc')
    weaponStatsDesc.textContent = itemObj.description
    const damage = createStat(itemObj, 'damage')
    const range = createStat(itemObj, 'range')
    const reload = createStat(itemObj, 'reload speed')
    const magazine = createStat(itemObj, 'magazine')
    const firerate = createStat(itemObj, 'fire rate')
    appendAll(weaponStats, imgContainer, weaponStatsName, weaponStatsDesc, damage, range, reload, magazine, firerate)
    weaponStatsContainer.append(weaponStats)
    getPauseContainer().append(weaponStatsContainer)
    renderQuit()
}

const createStat = (itemObj, name) => {
    const statContainer = createAndAddClass('div', 'stat-container')
    const upper = createAndAddClass('div', 'upper')
    const upperRight = createAndAddClass('div', 'upper-right')
    const statName = createAndAddClass('p', 'stat-name')
    statName.textContent = name
    const statLvl = createAndAddClass('p', 'stat-lvl')
    statLvl.textContent = `Lvl. ${itemObj[name.replace(' ', '').concat('lvl')]}`
    const value = createAndAddClass('div', 'value')
    value.textContent = `${getValue(itemObj, name)}`
    const lower = createAndAddClass('div', 'lower')
    for ( let i = 1; i <= 5; i++ ) {
        const level = document.createElement('div')
        if ( i <= itemObj[name.replace(' ', '').concat('lvl')] ) addClass(level, 'active')
        else addClass(level, 'inactive')   
        lower.append(level) 
    }
    appendAll(upperRight, statLvl, value)
    appendAll(upper, statName, upperRight)
    appendAll(statContainer, upper, lower)
    return statContainer
}

const getValue = (itemObj, name) => {
    let weapon = getInventory().flat().filter(item => item && item !== 'taken' && item.name === itemObj.name)[0]
    if ( !weapon ) 
        weapon = {name: itemObj.name, currmag: 0, damagelvl: 1, rangelvl: 1, reloadspeedlvl: 1, magazinelvl: 1, fireratelvl: 1}  
    return getStat(weapon.name, name.replace(' ', ''), weapon[name.replace(' ', '').concat('lvl')])
}
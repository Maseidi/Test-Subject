import { setExamining } from "./variables.js"
import { renderQuit } from "./user-interface.js"
import { getPauseContainer } from "./elements.js"
import { OwnedWeapon, getOwnedWeapons } from "./owned-weapons.js"
import { addClass, appendAll, createAndAddClass } from "./util.js"

export const renderStats = (itemObj) => {
    setExamining(true)
    const weaponStatsContainer = createAndAddClass('div', 'weapon-stats-container', 'ui-theme')
    const weaponStats = createAndAddClass('div', 'weapon-stats')
    const imgContainer = createAndAddClass('div', 'weapon-stats-img-container')
    const img = document.createElement('img')
    img.src = `../assets/images/${itemObj.name}.png`
    imgContainer.append(img)
    const weaponStatsName = createAndAddClass('div', 'weapon-stats-name')
    weaponStatsName.textContent = itemObj.heading
    const weaponStatsDesc = createAndAddClass('div', 'weapon-stats-desc')
    weaponStatsDesc.textContent = itemObj.description
    const damage = createStat(itemObj, 'damage', 'damage')
    const range = createStat(itemObj, 'range', 'range')
    const reload = createStat(itemObj, 'reload speed', 'reloadspeed')
    const magazine = createStat(itemObj, 'magazine', 'magazine')
    const firerate = createStat(itemObj, 'fire rate', 'firerate')
    appendAll(weaponStats, imgContainer, weaponStatsName, weaponStatsDesc, damage, range, reload, magazine, firerate)
    weaponStatsContainer.append(weaponStats)
    getPauseContainer().append(weaponStatsContainer)
    renderStastQuit()
}

const renderStastQuit = () => renderQuit(() => {
    getPauseContainer().lastElementChild.remove()
    setExamining(false)
})

const createStat = (itemObj, title, name) => {
    const statContainer = createAndAddClass('div', 'stat-container')
    const upper = createAndAddClass('div', 'upper')
    const upperRight = createAndAddClass('div', 'upper-right')
    const statName = createAndAddClass('p', 'stat-name')
    statName.textContent = title
    const statLvl = createAndAddClass('p', 'stat-lvl')
    statLvl.textContent = `Lvl. ${itemObj[name+'lvl']}`
    const value = createAndAddClass('div', 'value')
    value.textContent = `${getValue(itemObj, name)}`
    const lower = createAndAddClass('div', 'lower')
    for ( let i = 1; i <= 5; i++ ) {
        const level = document.createElement('div')
        if ( i <= itemObj[name+'lvl'] ) addClass(level, 'active')
        else addClass(level, 'inactive')   
        lower.append(level) 
    }
    appendAll(upperRight, statLvl, value)
    appendAll(upper, statName, upperRight)
    appendAll(statContainer, upper, lower)
    return statContainer
}

const getValue = (itemObj, name) => {
    let equippedWeapon = getOwnedWeapons().get(itemObj.id)
    if ( !equippedWeapon ) equippedWeapon = new OwnedWeapon(itemObj.name, 0, 1, 1, 1, 1, 1)
    let result
    if ( name === 'damage' ) result = equippedWeapon.getDamage()
    else if ( name === 'range' ) result = equippedWeapon.getRange()
    else if ( name === 'reloadspeed' ) result = equippedWeapon.getReloadSpeed()
    else if ( name === 'magazine' ) result = equippedWeapon.getMagazine()
    else if ( name === 'firerate' ) result = equippedWeapon.getFireRate()
    return result    
}
import { getPlayer } from './elements.js'
import { equippedItem } from './inventory.js'
import { getThrowableSpec } from './throwable-specs.js'
import { containsClass, createAndAddClass } from './util.js'

export const renderThrowable = () => {
    const equippedThrowable = equippedItem()
    const throwable = createAndAddClass('div', 'throwable')
    const laser = createAndAddClass('div', 'laser')
    laser.style.height = `${getThrowableSpec(equippedThrowable.name, 'range')}px`
    laser.style.backgroundColor = 'orange'
    for ( let i = 0; i < 100; i++ ) laser.append(document.createElement('div'))
    throwable.append(laser)
    const throwableImg = createAndAddClass('img', 'throwable-img')
    throwableImg.src = `/assets/images/${equippedThrowable.name}.png` 
    throwable.append(throwableImg)
    getPlayer().children[0].children[0].append(throwable)
}

export const removeThrowable = () => 
    Array.from(getPlayer().firstElementChild.firstElementChild.children)
        .find(child => containsClass(child, 'throwable'))?.remove()
import { getPlayer } from './elements.js'
import { equippedItem } from './inventory.js'
import { getThrowableSpec } from './throwable-specs.js'
import { containsClass, createAndAddClass } from './util.js'

export const renderThrowable = () => {
    const equippedThrowable = equippedItem()
    const throwable = createAndAddClass('div', 'throwable')
    const laser = createAndAddClass('div', 'throwable-laser')
    laser.style.height = `${getThrowableSpec(equippedThrowable.name, 'range')}px`
    for ( let i = 0; i < 100; i++ ) {
        const part = document.createElement('div')
        if ( i % 3 === 0 ) part.style.backgroundColor = 'black'
        laser.append(part)
    }
    throwable.append(laser)
    const throwableImg = createAndAddClass('img', 'throwable-img')
    throwableImg.src = `/assets/images/${equippedThrowable.name}.png` 
    throwable.append(throwableImg)
    getPlayer().children[0].children[0].append(throwable)
}

export const removeThrowable = () => 
    Array.from(getPlayer().firstElementChild.firstElementChild.children)
        .find(child => containsClass(child, 'throwable'))?.remove()
import { getPlayer } from './elements.js'
import { equippedWeaponObj } from './inventory.js'
import { getThrowableDetail } from './throwable-details.js'
import { appendAll, containsClass, createAndAddClass } from './util.js'

export const renderThrowable = () => {
    const equippedThrowable = equippedWeaponObj()
    const throwable = createAndAddClass('div', 'throwable')
    const laser = createAndAddClass('div', 'throwable-laser')
    laser.style.height = `${getThrowableDetail(equippedThrowable.name, 'range')}px`
    for ( let i = 0; i < 100; i++ ) {
        const part = document.createElement('div')
        if ( i % 3 === 0 ) part.style.backgroundColor = 'black'
        laser.append(part)
    }
    const throwableImg = createAndAddClass('img', 'throwable-img')
    throwableImg.src = `/assets/images/${equippedThrowable.name}.png` 
    appendAll(throwable, laser, throwableImg, createAndAddClass('div', 'throw-target'))
    getPlayer().children[0].children[0].append(throwable)
}

export const removeThrowable = () => 
    Array.from(getPlayer().firstElementChild.firstElementChild.children)
        .find(child => containsClass(child, 'throwable'))?.remove()
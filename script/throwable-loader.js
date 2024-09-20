import { getPlayer } from './elements.js'
import { findEquippedWeaponById } from './inventory.js'
import { getThrowableDetail } from './throwable-details.js'
import { appendAll, createAndAddClass, findAttachmentsOnPlayer } from './util.js'

export const renderThrowable = () => {
    const equippedThrowable = findEquippedWeaponById()
    const throwable = createAndAddClass('div', 'throwable')
    const laser = renderLaser(equippedThrowable.name)
    const throwableImg = renderImage(equippedThrowable.name) 
    appendAll(throwable, laser, throwableImg, createAndAddClass('div', 'throw-target'))
    getPlayer().firstElementChild.firstElementChild.append(throwable)
}

const renderLaser = (name) => {
    const laser = createAndAddClass('div', 'throwable-laser')
    laser.style.height = `${getThrowableDetail(name, 'range')}px`
    for ( let i = 0; i < 100; i++ ) {
        const part = document.createElement('div')
        if ( i % 3 === 0 ) part.style.backgroundColor = 'black'
        laser.append(part)
    }
    return laser
}

const renderImage = (name) => {
    const throwableImg = createAndAddClass('img', 'throwable-img')
    throwableImg.src = `/assets/images/${name}.png`
    return throwableImg
}

export const removeThrowable = () => findAttachmentsOnPlayer('throwable')?.remove()
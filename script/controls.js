import { 
    aDown,
    aimAngle,
    aUp,
    clickDown,
    clickUp,
    dDown,
    dUp,
    eDown,
    escapeDown,
    fDown,
    hDown,
    qDown,
    rDown,
    resizeWindow,
    sDown,
    shiftDown,
    shiftUp,
    sUp,
    tabDown,
    wDown,
    weaponSlotDown,
    wUp } from './actions.js'

const keyDown = (e) => {
    e.preventDefault()
    if ( !e.repeat ) {
        switch ( e.code ) {
            case 'KeyW':
                wDown()
                break
            case 'KeyA':
                aDown()
                break
            case 'KeyS':
                sDown()
                break
            case 'KeyD':
                dDown()
                break
            case 'KeyE':
                eDown()
                break
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
                weaponSlotDown(e.key)
                break
            case 'ShiftLeft':
                shiftDown()
                break
            case 'KeyF':
                fDown()
                break   
            case 'Tab':
                tabDown()
                break
            case 'KeyR':
                rDown()
                break
            case 'Escape':
                escapeDown()
                break
            case 'KeyH':
                hDown()
                break  
            case 'KeyQ':
                qDown()
                break
        }
    }
}

const keyUp = (e) => {
    switch ( e.code ) {
        case 'KeyW':
            wUp()
            break
        case 'KeyA':
            aUp()
            break
        case 'KeyS':
            sUp()
            break
        case 'KeyD':
            dUp()
            break
        case 'ShiftLeft':
            shiftUp()
            break                      
    }
}

export const addControls = () => {
    window.addEventListener('keydown',   keyDown,      true)
    window.addEventListener('keyup',     keyUp,        true)
    window.addEventListener('mousemove', aimAngle,     true)
    window.addEventListener('mousedown', clickDown,    true)
    window.addEventListener('mouseup',   clickUp,      true)
    window.addEventListener('resize',    resizeWindow, true)
}

export const removeControls = () => {
    window.removeEventListener('keydown',   keyDown,      true)
    window.removeEventListener('keyup',     keyUp,        true)
    window.removeEventListener('mousemove', aimAngle,     true)
    window.removeEventListener('mousedown', clickDown,    true)
    window.removeEventListener('mouseup',   clickUp,      true)
    window.removeEventListener('resize',    resizeWindow, true)
}
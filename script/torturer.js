import { addAttribute } from "./util.js"
import { isPlayerVisible } from "./enemy-vision.js"
import { calculateAngle, moveToDestination, moveToPlayer, updateDestination } from "./enemy-actions.js"

export const torturerBehavior = (enemy) => {
    isPlayerVisible(enemy)
    switch ( enemy.getAttribute('state') ) {
        case 'investigate':
            handleInvestigationState(enemy)
            break  
        case 'chase':
        case 'no-offence':    
            handleChaseState(enemy)
            break 
        case 'lost':
            handleLostState(enemy)   
            break
        case 'move-to-position':
            handleMoveToPositionState(enemy)
            break   
    }
}

const handleInvestigationState = (enemy) => {
    if ( isPlayerVisible(enemy) ) { 
        addAttribute(enemy, 'state', 'chase')
        return
    } 
    const path = document.getElementById(enemy.getAttribute('path'))
    const counter = Number(enemy.getAttribute('investigation-counter'))
    if ( counter > 0 ) 
        addAttribute(enemy, 'investigation-counter', counter + 1)
    if ( counter >= 300 ) 
        addAttribute(enemy, 'investigation-counter', 0)
    if ( counter !== 0 ) return
    if ( path.children.length === 1 ) {
        const x = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
        const y = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
        calculateAngle(enemy, x, y)
    } 
    moveToDestination(enemy, path.children[Number(enemy.getAttribute('path-point'))])
}

const handleChaseState = (enemy) => {
    if ( isPlayerVisible(enemy) ) updateDestination(enemy)
    moveToPlayer(enemy)
}

const handleLostState = (enemy) => {
    if ( isPlayerVisible(enemy) ) { 
        addAttribute(enemy, 'state', 'chase') 
        return
    } 
    const counter = Number(enemy.getAttribute('lost-counter'))
    if ( counter === 1200 ) {
        addAttribute(enemy, 'state', 'move-to-position')
        return
    }
    const x = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
    const y = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
    if ( counter % 120 === 0 ) calculateAngle(enemy, x, y)
    addAttribute(enemy, 'lost-counter', counter + 1) 
}

const handleMoveToPositionState = (enemy) => {
    if ( isPlayerVisible(enemy) ) { 
        addAttribute(enemy, 'state', 'chase') 
        return
    }
    moveToDestination(enemy, document.getElementById(enemy.getAttribute('path')).children[Number(enemy.getAttribute('path-point'))])
}
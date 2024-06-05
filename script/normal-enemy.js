import { addAttribute } from "./util.js"
import { findPath } from "./enemy-path-finding.js"
import { isPlayerVisible } from "./enemy-vision.js"
import { getNoOffenseCounter } from "./variables.js"
import { calculateAngle, moveToDestination, updateDestinationToPlayer, updateDestinationToPath } from "./enemy-actions.js"

export const normalEnemyBehavior = (enemy) => {
    switch ( enemy.getAttribute('state') ) {
        case 'investigate':
            handleInvestigationState(enemy)
            break
        case 'chase':
        case 'no-offence':
            handleChaseState(enemy)
            break
        case 'guess-search':
            handleGuessSearchState(enemy)
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
    if ( playerLocated(enemy) ) return
    const path = document.getElementById(enemy.getAttribute('path'))
    const counter = Number(enemy.getAttribute('investigation-counter'))
    if ( counter > 0 ) addAttribute(enemy, 'investigation-counter', counter + 1)
    if ( counter && counter !== 300 && counter % 100 === 0 ) checkSuroundings(enemy)
    if ( counter >= 300 ) addAttribute(enemy, 'investigation-counter', 0)
    if ( counter !== 0 ) return
    if ( path.children.length === 1 ) checkSuroundings(enemy)
    const dest = path.children[Number(enemy.getAttribute('path-point'))]
    updateDestinationToPath(enemy, dest)
    displaceEnemy(enemy)
}

const handleChaseState = (enemy) => {    
    if ( isPlayerVisible(enemy) ) updateDestinationToPlayer(enemy)
    else {
        addAttribute(enemy, 'state', 'guess-search')
        addAttribute(enemy, 'guess-counter', 1)
    }
    displaceEnemy(enemy)
}

const handleGuessSearchState = (enemy) => {
    if ( playerLocated(enemy) ) return
    let guessCounter = Number(enemy.getAttribute('guess-counter'))
    if ( guessCounter > 0 ) {
        guessCounter++
        addAttribute(enemy, 'guess-counter', guessCounter)
    }
    if ( guessCounter !== 0 && guessCounter <= 15 ) updateDestinationToPlayer(enemy)
    else addAttribute(enemy, 'guess-counter', 0)
    displaceEnemy(enemy)
}

const handleLostState = (enemy) => {
    if ( playerLocated(enemy) ) return
    const counter = Number(enemy.getAttribute('lost-counter'))
    if ( counter === 600 ) {
        addAttribute(enemy, 'state', 'move-to-position')
        return
    }
    if ( counter % 120 === 0 ) checkSuroundings(enemy)
    addAttribute(enemy, 'lost-counter', counter + 1)
}

const handleMoveToPositionState = (enemy) => {
    if ( playerLocated(enemy) ) return
    const dest = document.getElementById(enemy.getAttribute('path')).children[Number(enemy.getAttribute('path-point'))]
    updateDestinationToPath(enemy, dest)
    displaceEnemy(enemy)
}

const playerLocated = (enemy) => {
    let result = false
    if ( isPlayerVisible(enemy) ) { 
        if ( getNoOffenseCounter() === 0 ) addAttribute(enemy, 'state', 'chase')
        else addAttribute(enemy, 'state', 'no-offence')   
        result = true
    }
    return result
}

const checkSuroundings = (enemy) => {
    const x = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
    const y = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
    calculateAngle(enemy, x, y)
}

const displaceEnemy = (enemy) => {
    findPath(enemy)
    moveToDestination(enemy)
}
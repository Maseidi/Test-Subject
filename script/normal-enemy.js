import { addAttribute } from './util.js'
import { findPath } from './enemy-path-finding.js'
import { isPlayerVisible } from './enemy-vision.js'
import { getNoOffenseCounter } from './variables.js'
import { 
    calculateAngle,
    moveToDestination,
    updateDestinationToPlayer,
    updateDestinationToPath,
    notifyEnemy, 
    accelerateEnemy,
    getEnemyState,
    setEnemyState} from './enemy-actions.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, MOVE_TO_POSITION, NO_OFFENCE } from './enemy-state.js'

export const normalEnemyBehavior = (enemy) => {
    switch ( getEnemyState(enemy) ) {
        case INVESTIGATE:
            handleInvestigationState(enemy)
            break
        case CHASE:
        case NO_OFFENCE:
            handleChaseState(enemy)
            break
        case GUESS_SEARCH:
            handleGuessSearchState(enemy)
            break    
        case LOST:
            handleLostState(enemy)
            break
        case MOVE_TO_POSITION:
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
    accelerateEnemy(enemy)
    if ( isPlayerVisible(enemy) ) notifyEnemy(Number.MAX_SAFE_INTEGER, enemy)
    else {
        setEnemyState(enemy, GUESS_SEARCH)
        addAttribute(enemy, 'guess-counter', 1)
    }
    displaceEnemy(enemy)
}

const handleGuessSearchState = (enemy) => {
    accelerateEnemy(enemy)
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
        setEnemyState(enemy, MOVE_TO_POSITION)
        return
    }
    if ( counter % 120 === 0 ) checkSuroundings(enemy)
    addAttribute(enemy, 'lost-counter', counter + 1)
}

const handleMoveToPositionState = (enemy) => {
    accelerateEnemy(enemy)
    if ( playerLocated(enemy) ) return
    const dest = document.getElementById(enemy.getAttribute('path')).children[Number(enemy.getAttribute('path-point'))]
    updateDestinationToPath(enemy, dest)
    displaceEnemy(enemy)
}

const playerLocated = (enemy) => {
    let result = false
    if ( isPlayerVisible(enemy) ) { 
        if ( getNoOffenseCounter() === 0 ) setEnemyState(enemy, CHASE)
        else setEnemyState(enemy, NO_OFFENCE)
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
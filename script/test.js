import { addAttribute } from './util.js'
import { isPlayerVisible } from './enemy-vision.js'
import { CHASE, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE } from './enemy-state.js'
import { 
    updateDestination2Player,
    updateDestination2Path,
    notifyEnemy, 
    accelerateEnemy,
    getEnemyState,
    setEnemyState,
    displaceEnemy,
    playerLocated,
    checkSuroundings } from './enemy-actions.js'

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
            handleMove2PositionState(enemy)
            break
    }
}

export const handleInvestigationState = (enemy) => {
    if ( playerLocated(enemy) ) return
    const path = document.getElementById(enemy.getAttribute('path'))
    const counter = Number(enemy.getAttribute('investigation-counter'))
    if ( counter > 0 ) addAttribute(enemy, 'investigation-counter', counter + 1)
    if ( counter && counter !== 300 && counter % 100 === 0 ) checkSuroundings(enemy)
    if ( counter >= 300 ) addAttribute(enemy, 'investigation-counter', 0)
    if ( counter !== 0 ) return
    if ( path.children.length === 1 ) checkSuroundings(enemy)
    const dest = path.children[Number(enemy.getAttribute('path-point'))]
    updateDestination2Path(enemy, dest)
    displaceEnemy(enemy)
}

export const handleChaseState = (enemy) => {  
    accelerateEnemy(enemy)
    if ( isPlayerVisible(enemy) ) notifyEnemy(Number.MAX_SAFE_INTEGER, enemy)
    else {
        setEnemyState(enemy, GUESS_SEARCH)
        addAttribute(enemy, 'guess-counter', 1)
    }
    displaceEnemy(enemy)
}

export const handleGuessSearchState = (enemy) => {
    accelerateEnemy(enemy)
    if ( playerLocated(enemy) ) return
    let guessCounter = Number(enemy.getAttribute('guess-counter'))
    if ( guessCounter > 0 ) {
        guessCounter++
        addAttribute(enemy, 'guess-counter', guessCounter)
    }
    if ( guessCounter !== 0 && guessCounter <= 15 ) updateDestination2Player(enemy)
    else addAttribute(enemy, 'guess-counter', 0)
    displaceEnemy(enemy)
}

export const handleLostState = (enemy) => {
    if ( playerLocated(enemy) ) return
    const counter = Number(enemy.getAttribute('lost-counter'))
    if ( counter === 600 ) {
        setEnemyState(enemy, MOVE_TO_POSITION)
        return
    }
    if ( counter % 120 === 0 ) checkSuroundings(enemy)
    addAttribute(enemy, 'lost-counter', counter + 1)
}

export const handleMove2PositionState = (enemy) => {
    accelerateEnemy(enemy)
    if ( playerLocated(enemy) ) return
    const dest = document.getElementById(enemy.getAttribute('path')).children[Number(enemy.getAttribute('path-point'))]
    updateDestination2Path(enemy, dest)
    displaceEnemy(enemy)
}
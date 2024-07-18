import { enemies } from './enemies.js'
import { dropLoot } from './loot-manager.js'
import { takeDamage } from './player-health.js'
import { manageKnock } from './knock-manager.js'
import { findPath } from './enemy-path-finding.js'
import { isPlayerVisible } from './enemy-vision.js'
import { getSpecification, getStat } from './weapon-specs.js'
import { addAttribute, angleOfTwoPoints, collide, containsClass, distance } from './util.js'
import { getCurrentRoomEnemies, getCurrentRoomSolid, getMapEl, getPlayer } from './elements.js'
import { CHASE, GO_FOR_RANGED, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE } from './enemy-state.js'
import { 
    getCurrentRoomId,
    getMapX,
    getMapY,
    getNoOffenseCounter,
    getPlayerX,
    getPlayerY,
    getRoomLeft,
    getRoomTop,
    setMapX,
    setMapY,
    setPlayerX,
    setPlayerY } from './variables.js'

export class NormalEnemy {
    constructor(enemy) {
        this.enemy = enemy
    }

    getEnemyState() {
        return this.enemy.getAttribute('state')
    }

    setEnemyState(state) { 
        addAttribute(this.enemy, 'state', state)
    }

    move2Destination() {
        if ( this.collidePlayer() ) return
        const { enemyLeft, enemyTop, enemyW } = this.enemyCoordinates()
        const { destLeft, destTop, destW } = this.destinationCoordinates()
        const { xMultiplier, yMultiplier } = this.decideDirection(enemyLeft, destLeft, enemyTop, destTop, enemyW, destW)
        this.calculateAngle(xMultiplier, yMultiplier)
        const speed = this.calculateSpeed(xMultiplier, yMultiplier)
        if ( !xMultiplier && !yMultiplier ) this.reachedDestination()
        const currentX = Number(this.enemy.style.left.replace('px', ''))
        const currentY = Number(this.enemy.style.top.replace('px', ''))
        this.enemy.style.left = `${currentX + speed * xMultiplier}px`
        this.enemy.style.top = `${currentY + speed * yMultiplier}px`
    }

    collidePlayer() {
        const state = this.getEnemyState()
        if ( ( state !== CHASE && state !== NO_OFFENCE ) || !collide(this.enemy, getPlayer(), 0) ) return false
        if ( state === CHASE ) this.hitPlayer()
        return true
    }

    enemyCoordinates() {
        const enemyLeft = Number(this.enemy.style.left.replace('px', ''))
        const enemyTop = Number(this.enemy.style.top.replace('px', ''))
        const enemyW = Number(this.enemy.style.width.replace('px', ''))
        return {enemyLeft, enemyTop, enemyW}
    }

    destinationCoordinates() {
        const pathFindingX = this.enemy.getAttribute('path-finding-x')
        const pathFindingY = this.enemy.getAttribute('path-finding-y')
        const destLeft = pathFindingX === 'null' ? Number(this.enemy.getAttribute('dest-x')) : Number(pathFindingX)
        const destTop = pathFindingY === 'null' ? Number(this.enemy.getAttribute('dest-y')) : Number(pathFindingY)
        const destW = pathFindingX === 'null' ? Number(this.enemy.getAttribute('dest-w')) : 10
        return {destLeft, destTop, destW}
    }

    decideDirection(enemyLeft, destLeft, enemyTop, destTop, enemyW, destW) {
        let xMultiplier, yMultiplier
        if ( enemyLeft > destLeft + destW / 2 ) xMultiplier = -1
        else if ( enemyLeft + enemyW <= destLeft + destW / 2 ) xMultiplier = 1
        if ( enemyTop > destTop + destW / 2 ) yMultiplier = -1
        else if ( enemyTop + enemyW <= destTop + destW / 2 ) yMultiplier = 1
        return { xMultiplier, yMultiplier }
    }

    calculateSpeed(xMultiplier, yMultiplier) {
        let speed = Number(this.enemy.getAttribute('curr-speed'))
        const state = this.getEnemyState()
        if ( state === NO_OFFENCE ) speed /= 2
        else if ( state === INVESTIGATE ) speed = Number(this.enemy.getAttribute('maxspeed')) / 5
        if ( xMultiplier && yMultiplier ) speed /= 1.41
        return speed
    }

    reachedDestination() {
        if ( this.enemy.getAttribute('path-finding-x') !== 'null' ) {
            addAttribute(this.enemy, 'path-finding-x', null)
            addAttribute(this.enemy, 'path-finding-y', null)
            return
        }
        switch ( this.getEnemyState() ) {
            case INVESTIGATE:
                const path = document.getElementById(this.enemy.getAttribute('path'))
                const numOfPoints = path.children.length
                const currentPathPoint = Number(this.enemy.getAttribute('path-point'))
                let nextPathPoint = currentPathPoint + 1
                if ( nextPathPoint > numOfPoints - 1 ) nextPathPoint = 0
                addAttribute(enemy, 'path-point', nextPathPoint)
                addAttribute(enemy, 'investigation-counter', 1)
                break
            case GUESS_SEARCH:
                this.setEnemyState(LOST)
                addAttribute(this.enemy, 'lost-counter', '0')
                this.resetAcceleration()
                break
            case MOVE_TO_POSITION:
                this.setEnemyState(INVESTIGATE)
                this.resetAcceleration()
                break                 
        }
    }

    resetAcceleration() {
        addAttribute(this.enemy, 'acc-counter', 0)
        addAttribute(this.enemy, 'curr-speed', this.enemy.getAttribute('acceleration'))
    }

    calculateAngle = (x, y) => {
        const currState = Number(this.enemy.getAttribute('angle-state'))
        let newState = currState
        if ( x === 1 && y === 1 )        newState = this.changeEnemyAngleState(7, '0', '0')
        else if ( x === 1 && y === -1 )  newState = this.changeEnemyAngleState(5, '0', '-100%')
        else if ( x === -1 && y === 1 )  newState = this.changeEnemyAngleState(1, '-100%', '0')    
        else if ( x === -1 && y === -1 ) newState = this.changeEnemyAngleState(3, '-100%', '-100%')
        else if ( x === 1 && !y )        newState = this.changeEnemyAngleState(6, '0', '-50%')
        else if ( x === -1 && !y )       newState = this.changeEnemyAngleState(2, '-100%', '-50%')
        else if ( !x && y === 1 )        newState = this.changeEnemyAngleState(0, '-50%', '0')
        else if ( !x && y === -1 )       newState = this.changeEnemyAngleState(4, '-50%', '-100%')
        if ( newState === currState ) return
        let diff = newState - currState
        if (Math.abs(diff) > 4 && diff >= 0) diff = -(8 - diff)
        else if (Math.abs(diff) > 4 && diff < 0) diff = 8 - Math.abs(diff) 
        const newAngle = Number(this.enemy.getAttribute('angle')) + diff * 45    
        addAttribute(this.enemy, 'angle', newAngle)
        addAttribute(this.enemy, 'angle-state', newState)
        this.enemy.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
    }

    changeEnemyAngleState(state, translateX, translateY) {
        const forwardDetector = this.enemy.firstElementChild.children[2]
        forwardDetector.style.left = '50%'
        forwardDetector.style.top = '50%'
        forwardDetector.style.transform = `translateX(${translateX}) translateY(${translateY})`
        return state
    }

    hitPlayer() {
        addClass(this.enemy.firstElementChild.firstElementChild.firstElementChild, 'attack')
        takeDamage(this.enemy.getAttribute('damage'))
        this.knockPlayer()
    }

    knockPlayer() {
        const knock = Number(this.enemy.getAttribute('knock'))
        const angle = this.enemy.getAttribute('angle-state')
        let xAxis, yAxis
        let finalKnock
        switch ( angle ) {
            case '0': 
                xAxis = 0
                yAxis = -1
                finalKnock = manageKnock('to-down', getPlayer(), knock)
                break
            case '1':
            case '2':
            case '3':
                xAxis = 1
                yAxis = 0
                finalKnock = manageKnock('to-left', getPlayer(), knock)
                break
            case '4':
                xAxis = 0
                yAxis = 1
                finalKnock = manageKnock('to-up', getPlayer(), knock)
                break
            case '5':
            case '6':
            case '7':
                xAxis = -1
                yAxis = 0
                finalKnock = manageKnock('to-right', getPlayer(), knock)
                break                
        }
        if ( xAxis === null && yAxis === null ) return
        setMapX(xAxis * finalKnock + getMapX())
        setMapY(yAxis * finalKnock + getMapY())
        setPlayerX(-xAxis * finalKnock + getPlayerX())
        setPlayerY(-yAxis * finalKnock + getPlayerY())
        getMapEl().style.left = `${getMapX()}px`
        getMapEl().style.top = `${getMapY()}px`
        getPlayer().style.left = `${getPlayerX()}px`
        getPlayer().style.top = `${getPlayerY()}px`
    }

    updateDestination2Player() { 
        this.updateDestination(Math.floor(getPlayerX() - getRoomLeft()), Math.floor(getPlayerY() - getRoomTop()), 34)
    } 

    updateDestination2Path = (path) => {
        this.updateDestination(Number(path.style.left.replace('px', '')), Number(path.style.top.replace('px', '')), 10)
    }

    updateDestination(x, y, width) {
        addAttribute(this.enemy, 'dest-x', x)
        addAttribute(this.enemy, 'dest-y', y)
        addAttribute(this.enemy, 'dest-w', width)
    }

    notifyEnemy(dist) {
        const enemyBound = this.enemy.getBoundingClientRect()
        const playerBound = getPlayer().getBoundingClientRect()
        if ( distance(playerBound.x, playerBound.y, enemyBound.x, enemyBound.y) <= dist ) {
            this.switch2ChaseMode()
            this.updateDestination2Player()
        }
        this.notifyNearbyEnemies()
    }

    switch2ChaseMode() {
        if ( this.getEnemyState() === GO_FOR_RANGED ) return
        if ( getNoOffenseCounter() === 0 ) this.setEnemyState(CHASE)
        else this.setEnemyState(NO_OFFENCE)
    }

    notifyNearbyEnemies() {
        getCurrentRoomEnemies()
            .filter(e => e !== this.enemy &&
                     (distance(this.enemy.getBoundingClientRect().x, this.enemy.getBoundingClientRect().y,
                     e.getBoundingClientRect().x, e.getBoundingClientRect().y) < 500 ) &&
                     e.getAttribute('state') !== CHASE && e.getAttribute('state') !== NO_OFFENCE && 
                     e.getAttribute('state') !== GO_FOR_RANGED
            ).forEach(e => {
                const eObj = new NormalEnemy(e)
                eObj.notifyEnemy(Number.MAX_SAFE_INTEGER)
            })
    }

    damageEnemy(equipped) {
        let damage = getStat(equipped.name, 'damage', equipped.damagelvl)
        if ( this.enemy.getAttribute('virus') === getSpecification(equipped.name, 'antivirus') ) damage *= 1.2
        if ( Math.random() < 0.01 ) damage *= (Math.random() + 1)
        const enemyHealth = Number(this.enemy.getAttribute('health'))
        const newHealth = enemyHealth - damage
        addAttribute(this.enemy, 'health', newHealth)
        if ( newHealth <= 0 ) {
            addAttribute(this.enemy, 'left', Number(this.enemy.style.left.replace('px', '')))
            addAttribute(this.enemy, 'top', Number(this.enemy.style.top.replace('px', '')))
            dropLoot(this.enemy)
            const enemiesCopy = enemies.get(getCurrentRoomId())
            enemiesCopy[Number(this.enemy.getAttribute('index'))].health = 0
            return
        }
        const knockback = getSpecification(equipped.name, 'knockback')
        this.knockEnemy(knockback)
        addClass(this.enemy.firstElementChild.firstElementChild, 'damaged')
        addAttribute(this.enemy, 'damaged-counter', 6)
    }

    knockEnemy(knockback) {
        const enemyBound = this.enemy.getBoundingClientRect()
        const playerBound = getPlayer().getBoundingClientRect()
        let xAxis, yAxis
        if ( enemyBound.left < playerBound.left ) xAxis = -1
        else if ( enemyBound.left >= playerBound.left && enemyBound.right <= playerBound.right ) xAxis = 0
        else xAxis = 1
        if ( enemyBound.bottom < playerBound.top ) yAxis = -1
        else if ( enemyBound.bottom >= playerBound.top && enemyBound.top <= playerBound.bottom ) yAxis = 0
        else yAxis = 1
        const enemyLeft = Number(this.enemy.style.left.replace('px', ''))
        const enemyTop = Number(this.enemy.style.top.replace('px', ''))
        this.enemy.style.left = `${enemyLeft + xAxis * knockback}px`
        this.enemy.style.top = `${enemyTop + yAxis * knockback}px`
    }

    accelerateEnemy() {
        let counter = Number(this.enemy.getAttribute('acc-counter'))
        counter++
        if ( counter === 60 ) {
            const currSpeed = Number(this.enemy.getAttribute('curr-speed'))
            const acceleration = Number(this.enemy.getAttribute('acceleration'))
            const maxSpeed = Number(this.enemy.getAttribute('maxspeed'))
            let newSpeed = currSpeed + acceleration
            if ( newSpeed > maxSpeed ) newSpeed = maxSpeed
            addAttribute(this.enemy, 'curr-speed', newSpeed)
            counter = 0
        }  
        addAttribute(this.enemy, 'acc-counter', counter)
    }

    playerLocated() {
        const visible = isPlayerVisible(this.enemy)
        if ( visible ) this.switch2ChaseMode()
        return visible
    }

    checkSuroundings() {
        const x = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
        const y = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
        this.calculateAngle(x, y)
    }

    displaceEnemy() {
        findPath(this.enemy)
        this.move2Destination()
    }

    static vision2Player(enemy) {
        const vision = enemy.firstElementChild.children[1]
        vision.style.transform = `rotateZ(${this.angle2Player()}deg)`
    }

    angle2Player() {
        const enemyBound = this.enemy.getBoundingClientRect()
        const playerBound = getPlayer().getBoundingClientRect()
        return angleOfTwoPoints(enemyBound.x + enemyBound.width / 2, enemyBound.y + enemyBound.height / 2, 
                                playerBound.x + playerBound.width / 2, playerBound.y + playerBound.height / 2)
    }

    static wallsInTheWay(enemy) {
        let wallCheckCounter = Number(enemy.getAttribute('wall-check-counter')) || 1
        wallCheckCounter = wallCheckCounter + 1 === 21 ? 0 : wallCheckCounter + 1
        addAttribute(enemy, 'wall-check-counter', wallCheckCounter)
        if ( wallCheckCounter !== 20 ) return
        const walls = Array.from(getCurrentRoomSolid())
            .filter(solid => !containsClass(solid, 'enemy-collider') && !containsClass(solid, 'iron-master-component'))
        const vision = enemy.firstElementChild.children[1]
        for ( const component of vision.children ) {
            if ( collide(component, getPlayer(), 0) ) {
                addAttribute(enemy, 'wall-in-the-way', 'false')
                return
            }
            for ( const wall of walls )
                if ( collide(component, wall, 0) ) {
                    addAttribute(enemy, 'wall-in-the-way', wall.id)
                    return
                }
        }
        addAttribute(enemy, 'wall-in-the-way', 'out-of-range')
    }

    behave() {
        switch ( this.getEnemyState() ) {
            case INVESTIGATE:
                this.handleInvestigationState()
                break
            case CHASE:
            case NO_OFFENCE:
                this.handleChaseState()
                break
            case GUESS_SEARCH:
                this.handleGuessSearchState()
                break    
            case LOST:
                this.handleLostState()
                break
            case MOVE_TO_POSITION:
                this.handleMove2PositionState()
                break
        }
    }

    handleInvestigationState() {
        if ( this.playerLocated() ) return
        const path = document.getElementById(this.enemy.getAttribute('path'))
        const counter = Number(this.enemy.getAttribute('investigation-counter'))
        if ( counter > 0 ) addAttribute(this.enemy, 'investigation-counter', counter + 1)
        if ( counter && counter !== 300 && counter % 100 === 0 ) this.checkSuroundings()
        if ( counter >= 300 ) addAttribute(this.enemy, 'investigation-counter', 0)
        if ( counter !== 0 ) return
        if ( path.children.length === 1 ) this.checkSuroundings()
        const dest = path.children[Number(this.enemy.getAttribute('path-point'))]
        this.updateDestination2Path(dest)
        this.displaceEnemy()
    }

    handleChaseState() {  
        this.accelerateEnemy()
        if ( isPlayerVisible(this.enemy) ) this.notifyEnemy(Number.MAX_SAFE_INTEGER)
        else {
            this.setEnemyState(GUESS_SEARCH)
            addAttribute(this.enemy, 'guess-counter', 1)
        }
        this.displaceEnemy()
    }

    handleGuessSearchState() {
        this.accelerateEnemy()
        if ( this.playerLocated() ) return
        let guessCounter = Number(this.enemy.getAttribute('guess-counter'))
        if ( guessCounter > 0 ) {
            guessCounter++
            addAttribute(this.enemy, 'guess-counter', guessCounter)
        }
        if ( guessCounter !== 0 && guessCounter <= 15 ) this.updateDestination2Player()
        else addAttribute(this.enemy, 'guess-counter', 0)
        this.displaceEnemy()
    }

    handleLostState() {
        if ( this.playerLocated() ) return
        const counter = Number(this.enemy.getAttribute('lost-counter'))
        if ( counter === 600 ) {
            this.setEnemyState(MOVE_TO_POSITION)
            return
        }
        if ( counter % 120 === 0 ) this.checkSuroundings()
        addAttribute(this.enemy, 'lost-counter', counter + 1)
    }
    
    handleMove2PositionState() {
        this.accelerateEnemy()
        if ( playerLocated(enemy) ) return
        const dest = document.getElementById(this.enemy.getAttribute('path')).children[Number(this.enemy.getAttribute('path-point'))]
        this.updateDestination2Path(dest)
        this.displaceEnemy()
    }

}
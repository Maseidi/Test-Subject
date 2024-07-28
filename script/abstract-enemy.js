import { enemies } from './enemies.js'
import { dropLoot } from './loot-manager.js'
import { takeDamage } from './player-health.js'
import { manageKnock } from './knock-manager.js'
import { getSpecification, getStat } from './weapon-specs.js'
import { getCurrentRoomEnemies, getCurrentRoomSolid, getMapEl, getPlayer } from './elements.js'
import { addAttribute, addClass, angleOfTwoPoints, collide, containsClass, distance, removeClass } from './util.js'
import { 
    CHASE,
    GO_FOR_RANGED,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE, 
    SPIKER, 
    TRACKER } from './enemy-constants.js'
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

export class AbstractEnemy {
    constructor(type, components, waypoint, health, damage, knock, maxSpeed, progress, vision, acceleration) {
        this.type = type
        this.components = components
        this.waypoint = waypoint
        this.health = health
        this.damage = damage
        this.knock = knock
        this.maxSpeed = maxSpeed
        this.progress = progress
        this.virus = ['red', 'green', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 5)]
        this.vision = vision
        this.acceleration = acceleration
        this.x = waypoint.points[0].x
        this.y = waypoint.points[0].y
    }

    move2Destination() {
        if ( this.collidePlayer() ) return
        const enemyW = Number(window.getComputedStyle(this.element).width.replace('px', ''))
        const { destW } = this.#destinationCoordinates()
        const { xMultiplier, yMultiplier } = this.#decideDirection(enemyW, destW)
        this.calculateAngle(xMultiplier, yMultiplier)
        const speed = this.#calculateSpeed(xMultiplier, yMultiplier)
        if ( !xMultiplier && !yMultiplier ) this.#reachedDestination()
        this.x += (xMultiplier ? (speed * xMultiplier) : 0)
        this.y += (yMultiplier ? (speed * yMultiplier) : 0)
        this.element.style.left = `${this.x}px`
        this.element.style.top = `${this.y}px`
    }

    collidePlayer() {
        if ( ( this.state !== CHASE && this.state !== NO_OFFENCE ) || !collide(this.element, getPlayer(), 0) ) return false
        if ( this.state === CHASE ) this.hitPlayer()
        return true
    }

    #destinationCoordinates() {
        this.destX = this.pathFindingX === null ? this.destX : this.pathFindingX
        this.destY = this.pathFindingY === null ? this.destY : this.pathFindingY
        const destW = this.pathFindingX === 'null' ? Number(this.enemy.getAttribute('dest-w')) : 10
        return {destW}
    }

    #decideDirection(enemyW, destW) {
        let xMultiplier, yMultiplier
        if ( this.x > this.destX + destW / 2 ) xMultiplier = -1
        else if ( this.x + enemyW <= this.destX + destW / 2 ) xMultiplier = 1
        if ( this.y > this.destY + destW / 2 ) yMultiplier = -1
        else if ( this.y + enemyW <= this.destY + destW / 2 ) yMultiplier = 1
        return { xMultiplier, yMultiplier }
    }

    #calculateSpeed(xMultiplier, yMultiplier) {
        let speed = this.currentSpeed
        if ( this.state === NO_OFFENCE ) speed /= 2
        else if ( this.state === INVESTIGATE ) speed = this.maxSpeed / 5
        if ( xMultiplier && yMultiplier ) speed /= 1.41
        return speed
    }

    #reachedDestination() {
        if ( this.pathFindingX !== null ) {
            this.pathFindingX = null
            this.pathFindingY = null
            return
        }
        switch ( this.state ) {
            case INVESTIGATE:
                const path = document.getElementById(this.path)
                const numOfPoints = path.children.length
                const currentPathPoint = this.pathPoint
                let nextPathPoint = currentPathPoint + 1
                if ( nextPathPoint > numOfPoints - 1 ) nextPathPoint = 0
                this.pathPoint = nextPathPoint
                this.investigationCounter = 1
                break
            case GUESS_SEARCH:
                this.state = LOST
                this.lostCounter = 0
                this.resetAcceleration()
                break
            case MOVE_TO_POSITION:
                this.state = INVESTIGATE
                this.resetAcceleration()
                break                 
        }
    }

    resetAcceleration() {
        this.accelerationCounter = 0
        this.currentSpeed = this.acceleration 
    }

    calculateAngle = (x, y) => {
        const currState = Number(this.element.getAttribute('angle-state'))
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
        const newAngle = Number(this.element.getAttribute('angle')) + diff * 45    
        addAttribute(this.element, 'angle', newAngle)
        addAttribute(this.element, 'angle-state', newState)
        this.element.firstElementChild.firstElementChild.style.transform = `rotateZ(${newAngle}deg)`
    }

    changeEnemyAngleState(state, translateX, translateY) {
        const forwardDetector = this.element.firstElementChild.children[2]
        forwardDetector.style.left = '50%'
        forwardDetector.style.top = '50%'
        forwardDetector.style.transform = `translateX(${translateX}) translateY(${translateY})`
        return state
    }

    hitPlayer() {
        addClass(this.element.firstElementChild.firstElementChild.firstElementChild, 'attack')
        takeDamage(this.damage)
        this.knockPlayer()
    }

    knockPlayer() {
        const knock = this.knock
        const angle = this.element.getAttribute('angle-state')
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
        this.destX = x
        this.destY = y
        this.destWidth = width
    }

    notifyEnemy(dist) {
        const enemyBound = this.element.getBoundingClientRect()
        const playerBound = getPlayer().getBoundingClientRect()
        if ( distance(playerBound.x, playerBound.y, enemyBound.x, enemyBound.y) <= dist ) {
            this.switch2ChaseMode()
            this.updateDestination2Player()
        }
        this.notifyNearbyEnemies()
    }

    switch2ChaseMode() {
        if ( this.state === GO_FOR_RANGED ) return
        if ( getNoOffenseCounter() === 0 ) this.state = CHASE
        else this.state = NO_OFFENCE
    }

    notifyNearbyEnemies() {
        getCurrentRoomEnemies()
            .filter(e => e.enemy !== this.element &&
                     (distance(this.element.getBoundingClientRect().x, this.element.getBoundingClientRect().y,
                     e.element.getBoundingClientRect().x, e.element.getBoundingClientRect().y) < 500 ) &&
                     this.state !== CHASE && this.state !== NO_OFFENCE && 
                     this.state !== GO_FOR_RANGED && e.type !== TRACKER
            ).forEach(e => e.notifyEnemy(Number.MAX_SAFE_INTEGER))
    }

    damageEnemy(equipped) {
        let damage = getStat(equipped.name, 'damage', equipped.damagelvl)
        if ( this.virus === getSpecification(equipped.name, 'antivirus') ) damage *= 1.2
        if ( Math.random() < 0.01 ) damage *= (Math.random() + 1)
        const enemyHealth = this.health
        const newHealth = enemyHealth - damage
        this.health = newHealth
        if ( newHealth <= 0 ) {
            addAttribute(this.element, 'left', Number(this.element.style.left.replace('px', '')))
            addAttribute(this.element, 'top', Number(this.element.style.top.replace('px', '')))
            dropLoot(this.element)
            const enemiesCopy = enemies.get(getCurrentRoomId())
            enemiesCopy[this.index].health = 0
            return
        }
        const knockback = getSpecification(equipped.name, 'knockback')
        this.knockEnemy(knockback)
        addClass(this.element.firstElementChild.firstElementChild, 'damaged')
        this.damagedCounter = 6
    }

    knockEnemy(knockback) {
        const enemyBound = this.element.getBoundingClientRect()
        const playerBound = getPlayer().getBoundingClientRect()
        let xAxis, yAxis
        if ( enemyBound.left < playerBound.left ) xAxis = -1
        else if ( enemyBound.left >= playerBound.left && enemyBound.right <= playerBound.right ) xAxis = 0
        else xAxis = 1
        if ( enemyBound.bottom < playerBound.top ) yAxis = -1
        else if ( enemyBound.bottom >= playerBound.top && enemyBound.top <= playerBound.bottom ) yAxis = 0
        else yAxis = 1
        this.element.style.left = `${this.x + xAxis * knockback}px`
        this.element.style.top = `${this.y + yAxis * knockback}px`
    }

    accelerateEnemy() {
        this.accelerationCounter += 1
        if ( this.accelerationCounter === 60 ) {
            let newSpeed = this.currentSpeed + this.acceleration
            if ( newSpeed > this.maxSpeed ) newSpeed = this.maxSpeed
            this.currentSpeed = newSpeed
            this.accelerationCounter = 0
        }  
    }

    playerLocated() {
        const visible = this.isPlayerVisible()
        if ( visible ) this.switch2ChaseMode()
        return visible
    }

    checkSurroundings() {
        const x = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
        const y = Math.random() < 1 / 3 ? 1 : Math.random() < 0.5 ? 0 : -1
        this.calculateAngle(x, y)
    }

    displaceEnemy() {
        this.findPath()
        this.move2Destination()
    }

    vision2Player() {
        const vision = this.element.firstElementChild.children[1]
        vision.style.transform = `rotateZ(${this.angle2Player()}deg)`
    }

    angle2Player() {
        return this.angle2Target(getPlayer())
    }

    angle2Target(target) {
        const enemyBound = this.element.getBoundingClientRect()
        const targetBound = target.getBoundingClientRect()
        return angleOfTwoPoints(enemyBound.x + enemyBound.width / 2, enemyBound.y + enemyBound.height / 2, 
                                targetBound.x + targetBound.width / 2, targetBound.y + targetBound.height / 2)
    }

    wallsInTheWay() {
        this.wallCheckCounter = this.wallCheckCounter ?? 1
        this.wallCheckCounter = this.wallCheckCounter + 1 === 21 ? 0 : this.wallCheckCounter + 1
        if ( this.wallCheckCounter !== 20 ) return
        const walls = Array.from(getCurrentRoomSolid())
            .filter(solid => !containsClass(solid, 'enemy-collider') && !containsClass(solid, 'tracker-component'))
        const vision = this.element.firstElementChild.children[1]
        for ( const component of vision.children ) {
            if ( collide(component, getPlayer(), 0) ) {
                this.wallInTheWay = false
                return
            }
            for ( const wall of walls )
                if ( collide(component, wall, 0) ) {
                    this.wallInTheWay = wall.id
                    return
                }
        }
        this.wallInTheWay = 'out-of-range'
    }

    manageDamagedState() {
        if ( this.damagedCounter === 0 ) {
            removeClass(this.element.firstElementChild.firstElementChild, 'damaged')
            return
        }
        this.damagedCounter -= 1

    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        this.handleCollision(collidingEnemy)
    }

    findCollidingEnemy() {
        const collidingEnemy = Array.from(getCurrentRoomEnemies())
            .find(e => e.element !== this.element 
            && collide(this.element.firstElementChild.children[2], e.element.firstElementChild, 0) 
            && e.type !== TRACKER && e.type !== SPIKER
            && e.state !== INVESTIGATE && e.state !== GO_FOR_RANGED)
        this.collidingEnemy = null
        return collidingEnemy
    }

    handleCollision(collidingEnemy) {
        this.collidingEnemy = collidingEnemy.index
        if ( collidingEnemy.state === LOST && ( this.state === CHASE || this.state === NO_OFFENCE || this.state === GUESS_SEARCH ) ) {
            this.state = LOST
            this.resetAcceleration()
        }
        else if ( collidingEnemy.state === LOST && ( this.state === MOVE_TO_POSITION ) ) 
            collidingEnemy.state = MOVE_TO_POSITION
        else {
            if ( this.collidingEnemy === collidingEnemy.index && this.index === collidingEnemy.collidingEnemy ) return
            this.accelerationCounter = 45
            this.currentSpeed = 0
        }
    }

    isPlayerVisible() {
        let result = false
        if ( this.wallInTheWay !== false ) return result
        const angle = this.element.firstElementChild.children[1].style.transform.replace('rotateZ(', '').replace('deg)', '')
        const angleState = Number(this.element.getAttribute('angle-state'))
        const predicateRunner = this.predicate(angleState, angle)
        const runners = [
            predicateRunner(0, 80, -80, 0),
            predicateRunner(0, 125, -35, 0),
            predicateRunner(10, 90, 90, 170),
            predicateRunner(55, 180, -180, -145),
            predicateRunner(100, 180, -180, -100),
            predicateRunner(145, 180, -180, -55),
            predicateRunner(-170, -90, -90, -10),
            predicateRunner(0, 35, -125, 0)
        ]
        return runners.reduce((a, b) => a || b)
    }
    
    predicate(state, angle) {
        let stateCounter = -1
        return (s1, e1, s2, e2) => {
            stateCounter++
            return state === stateCounter && ((angle > s1 && angle < e1) || (angle > s2 && angle <= e2)) 
        }
    }

    distance2Player() {
        return this.distance2Target(getPlayer())
    }

    distance2Target(target) {
        return distance(this.element.getBoundingClientRect().x, this.element.getBoundingClientRect().y, 
                        target.getBoundingClientRect().x, target.getBoundingClientRect().y)
    }

    findPath() {
        const wall = this.#findWall()
        if ( !wall ) return
        const { enemyLeft, enemyTop, enemyW } = this.#getEnemyCoordinates()
        const { destLeft, destTop, destW } = this.#getDestinationCoordinates()
        const { wallLeft, wallTop, wallW, wallH } = this.#getWallCoordinates(wall)
        let enemyState = this.#getPositionState(enemyLeft, enemyTop, enemyW, enemyW, wallLeft, wallTop, wallW, wallH)
        let destState = this.#getPositionState(destLeft, destTop, destW, destW, wallLeft, wallTop, wallW, wallH)
        const trackerMap = new Map([])
        Array.from(wall.children).forEach(tracker => trackerMap.set(tracker.classList[0], tracker))
        this.#managePathfindingState(enemyState, destState, trackerMap, wallLeft, wallTop, wallW, wallH)
    }

    #findWall() {
        let wall
        for ( const solid of getCurrentRoomSolid() ) {
            if ( containsClass(solid.parentElement, 'enemy') ) continue
            if ( solid.getAttribute('side') === 'true' ) continue
            if ( solid === this.element.firstElementChild ) continue
            if ( !collide(this.element, solid, 50) ) continue
            wall = solid
            break
        }
        return wall
    }

    #getEnemyCoordinates() {
        const enemyCpu = window.getComputedStyle(this.element)
        const enemyW = Number(enemyCpu.width.replace('px', ''))
        return { enemyLeft: this.x, enemyTop: this.y, enemyW }
    }

    #getDestinationCoordinates() {
        return { destLeft: this.destX, destTop: this.destY, destW: this.destWidth }
    }

    #getWallCoordinates(wall) {
        const wallCpu = window.getComputedStyle(wall)
        const wallLeft = Number(wallCpu.left.replace('px', ''))
        const wallTop = Number(wallCpu.top.replace('px', ''))
        const wallW = Number(wallCpu.width.replace('px', ''))
        const wallH = Number(wallCpu.height.replace('px', ''))
        return { wallLeft, wallTop, wallW, wallH }
    }

    #getPositionState(left, top, width, height, wLeft, wTop, wWidth, wHeight) {
        let positionState
        if ( left + width < wLeft + 5 ) positionState = 10
        else if ( left + width >= wLeft + 5 && left < wLeft + wWidth - 5 ) positionState = 20
        else positionState = 30
    
        if ( top + height < wTop + 5 ) positionState += 1
        else if ( top + height >= wTop + 5 && top < wTop + wHeight - 5 ) positionState += 2
        else positionState += 3
        
        return positionState
    }

    #managePathfindingState(enemyState, destState, trackerMap, wallLeft, wallTop, wallW, wallH) {
        switch ( enemyState ) {
            case 11: this.#handleTopLeftState(destState, wallLeft, wallTop, wallW, wallH)
                break
            case 12: this.#handleLeftState(destState, trackerMap, wallLeft, wallTop, wallH)
                break
            case 13: this.#handleBottomLeftState(destState, wallLeft, wallTop, wallW, wallH)
                break
            case 21: this.#handleTopState(destState, trackerMap, wallLeft, wallTop, wallW)
                break
            case 23: this.#handleBottomState(destState, trackerMap, wallLeft, wallTop, wallW, wallH)
                break
            case 31: this.#handleTopRightState(destState, wallLeft, wallTop, wallW, wallH)
                break
            case 32: this.#handleRightState(destState, trackerMap, wallLeft, wallTop, wallW, wallH)
                break
            case 33: this.#handleBottomRightState(destState, wallLeft, wallTop, wallW, wallH)
                break
        }
    }

    #handleTopLeftState(destState, wallLeft, wallTop, wallW, wallH) {
        switch ( destState ) {
            case 23:
                this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
                break
            case 32:
                this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                break
            case 33:
                const { destX, destY } = this.#getDestination()
                if ( Math.random() < 0.5 ) {
                    if ( destX === wallLeft - 50 && destY === wallTop + wallH + 50 ) return
                    this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                    return
                } 
                if ( destX === wallLeft + wallW + 50 && destY === wallTop - 50 ) return
                this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
                break  
            default:
                this.#addPathfinding(null, null)
        }
    }

    #handleLeftState(destState, trackerMap, wallLeft, wallTop, wallH) {
        switch ( destState ) {
            case 21:
            case 31:
                this.#addPathfinding(wallLeft - 50, wallTop - 50)
                break
            case 32:    
                if ( trackerMap.has('top-left') && trackerMap.has('bottom-left') ) {
                    const { destX, destY } = this.#getDestination()
                    if ( Math.random() < 0.5 ) {
                        if ( destX === wallLeft - 50 && destY === wallTop - 50 ) return
                        this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
                        return
                    } 
                    if ( destX === wallLeft - 50 && destY === wallTop + wallH + 50 ) return
                    this.#addPathfinding(wallLeft - 50, wallTop - 50)
                } 
                else if ( !trackerMap.has('top-left') ) this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
                else if ( !trackerMap.has('bottom-left') ) this.#addPathfinding(wallLeft - 50, wallTop - 50)
                break
            case 23:
            case 33:
                this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
                break
            default:
                this.#addPathfinding(null, null)                
        }
    }

    #handleBottomLeftState(destState, wallLeft, wallTop, wallW, wallH) {
        switch ( destState ) {
            case 21:
                this.#addPathfinding(wallLeft - 50, wallTop - 50)
                break
            case 31:       
                const { destX, destY } = this.#getDestination()
                if ( Math.random() < 0.5 ) {
                    if ( destX === wallLeft - 50 && destY === wallTop - 50 ) return
                    this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                    return
                } 
                if ( destX === wallLeft + wallW + 50 && destY === wallTop + wallH + 50 ) return
                this.#addPathfinding(wallLeft - 50, wallTop - 50)
                break
            case 32:
                this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                break
            default:
                this.#addPathfinding(null, null)            
        }
    }

    #handleTopState(destState, trackerMap, wallLeft, wallTop, wallW) {
        switch ( destState ) {
            case 12:
            case 13:
                this.#addPathfinding(wallLeft - 50, wallTop - 50)
                break
            case 23:    
                if ( trackerMap.has('top-left') && trackerMap.has('top-right') ) {
                    const { destX, destY } = this.#getDestination()
                    if ( Math.random() < 0.5 ) {
                        if ( destX === wallLeft - 50 && destY === wallTop - 50 ) return
                        this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                        return
                    }
                    if ( destX === wallLeft + wallW + 50 && destY === wallTop - 50) return
                    this.#addPathfinding(wallLeft - 50, wallTop - 50)
                }    
                else if ( !trackerMap.has('top-left') ) this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                else if ( !trackerMap.has('top-right') ) this.#addPathfinding(wallLeft - 50, wallTop - 50)
                break
            case 32:
            case 33:
                this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                break
            default:
                this.#addPathfinding(null, null)                    
        }
    }

    #handleBottomState(destState, trackerMap, wallLeft, wallTop, wallW, wallH) {
        switch ( destState ) {
            case 11:
            case 12:
                this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
                break
            case 21:    
                if ( trackerMap.has('bottom-left') && trackerMap.has('bottom-right') ) {
                    const { destX, destY } = this.#getDestination()
                    if ( Math.random() < 0.5 ) {
                        if ( destX === wallLeft - 50 && destY === wallTop + wallH + 50 ) return
                        this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                        return
                    }
                    if ( destX === wallLeft + wallW + 50 && destY === wallTop + wallH + 50) return
                    this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
                } 
                else if ( !trackerMap.has('bottom-left') ) this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                else if ( !trackerMap.has('bottom-right') ) this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
                break
            case 31:
            case 32:
                this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                break  
            default:
                this.#addPathfinding(null, null)                  
        }
    }

    #handleTopRightState(destState, wallLeft, wallTop, wallW, wallH) {
        switch ( destState ) {
            case 12:
                this.#addPathfinding(wallLeft - 50, wallTop - 50)
                break
            case 13:        
                const { destX, destY } = this.#getDestination()
                if ( Math.random() < 0.5 ) {
                    if ( destX === wallLeft - 50 && destY === wallTop - 50 ) return
                    this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                    return
                }
                if ( destX === wallLeft + wallW + 50 && destY === wallTop + wallH + 50) return
                this.#addPathfinding(wallLeft - 50, wallTop - 50)
                break
            case 23:
                this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                break  
            default:
                this.#addPathfinding(null, null)          
        }
    }

    #handleRightState(destState, trackerMap, wallLeft, wallTop, wallW, wallH) {
        switch ( destState ) {
            case 11:
            case 21:
                this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                break
            case 12:    
                if ( trackerMap.has('bottom-left') && trackerMap.has('bottom-right') ) {
                    const { destX, destY } = this.#getDestination()
                    if ( Math.random() < 0.5 ) {
                        if ( destX === wallLeft + wallW + 50 && destY === wallTop + wallH + 50 ) return
                        this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                        return
                    }
                    if ( destX === wallLeft + wallW + 50 && destY === wallTop - 50) return
                    this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                } 
                else if ( !trackerMap.has('top-right') ) this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                else if ( !trackerMap.has('bottom-right') ) this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                break
            case 13:
            case 23:
                this.#addPathfinding(wallLeft + wallW + 50, wallTop + wallH + 50)
                break  
            default:
                this.#addPathfinding(null, null)                  
        }
    }

    #handleBottomRightState(destState, wallLeft, wallTop, wallW, wallH) {
        switch ( destState ) {
            case 12:
                this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
                break
            case 11:            
                const { destX, destY } = this.#getDestination()
                if ( Math.random() < 0.5 ) {
                    if ( destX === wallLeft - 50 && destY === wallTop + wallH + 50 ) return
                    this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                    return
                }
                if ( destX === wallLeft + wallW + 50 && destY === wallTop - 50) return
                this.#addPathfinding(wallLeft - 50, wallTop + wallH + 50)
            case 21:
                this.#addPathfinding(wallLeft + wallW + 50, wallTop - 50)
                break
            default:
                this.#addPathfinding(null, null)            
        }
    }

    #addPathfinding(x, y) {
        this.pathFindingX = x
        this.pathFindingY = y
    }
    
    #getDestination() {
        return {
            destX: this.destX,
            destY: this.destY
        }
    }

}
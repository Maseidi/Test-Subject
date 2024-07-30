import { enemies } from './enemies.js'
import { dropLoot } from './loot-manager.js'
import { takeDamage } from './player-health.js'
import { manageKnock } from './knock-manager.js'
import { getSpecification, getStat } from './weapon-specs.js'
import { getCurrentRoomEnemies, getCurrentRoomSolid, getMapEl, getPlayer } from './elements.js'
import { addAttribute, addClass, angleOfTwoPoints, collide, containsClass, distance, getProperty, removeClass } from './util.js'
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
        const enemyWidth = getProperty(this.htmlTag, 'width', 'px')
        const { destX, destY, destWidth } = this.destinationCoordinates()
        const { xMultiplier, yMultiplier } = this.decideDirection(enemyWidth, destX, destY, destWidth)
        this.calculateAngle(xMultiplier, yMultiplier)
        const speed = this.calculateSpeed(xMultiplier, yMultiplier)
        if ( !xMultiplier && !yMultiplier ) this.reachedDestination()
        this.x += (xMultiplier ? (speed * xMultiplier) : 0)
        this.y += (yMultiplier ? (speed * yMultiplier) : 0)
        this.htmlTag.style.left = `${this.x}px`
        this.htmlTag.style.top = `${this.y}px`
    }

    collidePlayer() {
        if ( ( this.state !== CHASE && this.state !== NO_OFFENCE ) || !collide(this.htmlTag, getPlayer(), 0) ) return false
        if ( this.state === CHASE ) this.hitPlayer()
        return true
    }

    destinationCoordinates() {
        const destX = this.pathFindingX === null ? this.destX : this.pathFindingX
        const destY = this.pathFindingY === null ? this.destY : this.pathFindingY
        const destWidth = this.pathFindingX === null ? this.destWidth : 10
        return {destX, destY, destWidth}
    }

    decideDirection(enemyWidth, destX, destY, destWidth) {
        let xMultiplier, yMultiplier
        if ( this.x > destX + destWidth / 2 ) xMultiplier = -1
        else if ( this.x + enemyWidth <= destX + destWidth / 2 ) xMultiplier = 1
        if ( this.y > destY + destWidth / 2 ) yMultiplier = -1
        else if ( this.y + enemyWidth <= destY + destWidth / 2 ) yMultiplier = 1
        return { xMultiplier, yMultiplier }
    }

    calculateSpeed(xMultiplier, yMultiplier) {
        let speed = this.currentSpeed
        if ( this.state === NO_OFFENCE ) speed /= 2
        else if ( this.state === INVESTIGATE ) speed = this.maxSpeed / 5
        if ( xMultiplier && yMultiplier ) speed /= 1.41
        return speed
    }

    reachedDestination() {
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
        const currState = this.angleState || 0
        const currAngle = this.angle || 0
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
        const newAngle = currAngle + diff * 45    
        this.angle = newAngle
        this.angleState = newState
        this.htmlTag.firstElementChild.firstElementChild.style.transform = `rotateZ(${this.angle}deg)`
    }

    changeEnemyAngleState(state, translateX, translateY) {
        const forwardDetector = this.htmlTag.firstElementChild.children[2]
        forwardDetector.style.left = '50%'
        forwardDetector.style.top = '50%'
        forwardDetector.style.transform = `translateX(${translateX}) translateY(${translateY})`
        return state
    }

    hitPlayer() {
        addClass(this.htmlTag.firstElementChild.firstElementChild.firstElementChild, 'attack')
        takeDamage(this.damage)
        this.knockPlayer()
    }

    knockPlayer() {
        const knock = this.knock
        let xAxis, yAxis
        let finalKnock
        switch ( this.angleState ) {
            case 0: 
                xAxis = 0
                yAxis = -1
                finalKnock = manageKnock('to-down', getPlayer(), knock)
                break
            case 1:
            case 2:
            case 3:
                xAxis = 1
                yAxis = 0
                finalKnock = manageKnock('to-left', getPlayer(), knock)
                break
            case 4:
                xAxis = 0
                yAxis = 1
                finalKnock = manageKnock('to-up', getPlayer(), knock)
                break
            case 5:
            case 6:
            case 7:
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
        this.updateDestination(getProperty(path, 'left', 'px'), getProperty(path, 'top', 'px'), 10)
    }

    updateDestination(x, y, width) {
        this.destX = x
        this.destY = y
        this.destWidth = width
    }

    notifyEnemy(dist) {
        const enemyBound = this.htmlTag.getBoundingClientRect()
        const playerBound = getPlayer().getBoundingClientRect()
        if ( distance(playerBound.x, playerBound.y, enemyBound.x, enemyBound.y) <= dist ) {
            this.switch2ChaseMode()
            this.updateDestination2Player()
        }
        this.notifyNearbyEnemies()
    }

    switch2ChaseMode() {
        if ( this.state === GO_FOR_RANGED ) return
        this.state = getNoOffenseCounter() === 0 ? CHASE : NO_OFFENCE
    }

    notifyNearbyEnemies() {
        getCurrentRoomEnemies()
            .filter(e => e.htmlTag !== this.htmlTag &&
                     (distance(this.htmlTag.getBoundingClientRect().x, this.htmlTag.getBoundingClientRect().y,
                     e.htmlTag.getBoundingClientRect().x, e.htmlTag.getBoundingClientRect().y) < 500 ) &&
                     e.state !== CHASE && e.state !== NO_OFFENCE && 
                     e.state !== GO_FOR_RANGED && e.type !== TRACKER
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
            addAttribute(this.htmlTag, 'left', Number(this.htmlTag.style.left.replace('px', '')))
            addAttribute(this.htmlTag, 'top', Number(this.htmlTag.style.top.replace('px', '')))
            dropLoot(this.htmlTag)
            const enemiesCopy = enemies.get(getCurrentRoomId())
            enemiesCopy[this.index].health = 0
            return
        }
        const knockback = getSpecification(equipped.name, 'knockback')
        this.knockEnemy(knockback)
        addClass(this.htmlTag.firstElementChild.firstElementChild, 'damaged')
        this.damagedCounter = 6
    }

    knockEnemy(knockback) {
        const enemyBound = this.htmlTag.getBoundingClientRect()
        const playerBound = getPlayer().getBoundingClientRect()
        let xAxis, yAxis
        if ( enemyBound.left < playerBound.left ) xAxis = -1
        else if ( enemyBound.left >= playerBound.left && enemyBound.right <= playerBound.right ) xAxis = 0
        else xAxis = 1
        if ( enemyBound.bottom < playerBound.top ) yAxis = -1
        else if ( enemyBound.bottom >= playerBound.top && enemyBound.top <= playerBound.bottom ) yAxis = 0
        else yAxis = 1
        this.htmlTag.style.left = `${this.x + xAxis * knockback}px`
        this.htmlTag.style.top = `${this.y + yAxis * knockback}px`
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
        const vision = this.htmlTag.firstElementChild.children[1]
        vision.style.transform = `rotateZ(${this.angle2Player()}deg)`
    }

    angle2Player() {
        return this.angle2Target(getPlayer())
    }

    angle2Target(target) {
        const enemyBound = this.htmlTag.getBoundingClientRect()
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
        const vision = this.htmlTag.firstElementChild.children[1]
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
            removeClass(this.htmlTag.firstElementChild.firstElementChild, 'damaged')
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
            .find(e => e.htmlTag !== this.htmlTag 
                  && collide(this.htmlTag.firstElementChild.children[2], e.htmlTag.firstElementChild, 0) 
                  && e.type !== TRACKER && e.type !== SPIKER
                  && e.state !== INVESTIGATE && e.state !== GO_FOR_RANGED)
        this.collidingEnemy = null
        return collidingEnemy
    }

    handleCollision(collidingEnemy) {
        this.collidingEnemy = collidingEnemy.index
        if ( collidingEnemy.state === LOST && 
           ( this.state === CHASE || this.state === NO_OFFENCE || this.state === GUESS_SEARCH ) ) {
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
        const angle = getProperty(this.htmlTag.firstElementChild.children[1], 'transform', 'rotateZ(', 'deg)')
        const predicateRunner = this.predicate(this.angleState, angle)
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
        return distance(this.htmlTag.getBoundingClientRect().x, this.htmlTag.getBoundingClientRect().y, 
                        target.getBoundingClientRect().x, target.getBoundingClientRect().y)
    }

    findPath() {
        const wall = this.#findWall()
        if ( !wall ) return
        const enemyWidth = getProperty(this.htmlTag, 'width', 'px')
        const { wallX, wallY, wallW, wallH } = this.#getWallCoordinates(wall)
        let enemyState = this.#getPositionState(this.x, this.y, enemyWidth, wallX, wallY, wallW, wallH)
        let destState = this.#getPositionState(this.destX, this.destY, this.destWidth, wallX, wallY, wallW, wallH)
        const trackerMap = new Map([])
        Array.from(wall.children).forEach(tracker => trackerMap.set(tracker.classList[0], tracker))
        this.#managePathFindingState(enemyState, destState, trackerMap, wallX, wallY, wallW, wallH)
    }

    #findWall() {
        let wall
        for ( const solid of getCurrentRoomSolid() ) {
            if ( containsClass(solid.parentElement, 'enemy') ) continue
            if ( solid.getAttribute('side') === 'true' ) continue
            if ( solid === this.htmlTag.firstElementChild ) continue
            if ( !collide(this.htmlTag, solid, 50) ) continue
            wall = solid
            break
        }
        return wall
    }

    #getWallCoordinates(wall) {
        const wallX = getProperty(wall, 'left', 'px')
        const wallY = getProperty(wall, 'top', 'px')
        const wallW = getProperty(wall, 'width', 'px')
        const wallH = getProperty(wall, 'height', 'px')
        return { wallX, wallY, wallW, wallH }
    }

    #getPositionState(left, top, width, wallX, wallY, wallW, wallH) {
        let positionState
        const height = width
        if ( left + width < wallX + 5 ) positionState = 10
        else if ( left + width >= wallX + 5 && left < wallX + wallW - 5 ) positionState = 20
        else positionState = 30
    
        if ( top + height < wallY + 5 ) positionState += 1
        else if ( top + height >= wallY + 5 && top < wallY + wallH - 5 ) positionState += 2
        else positionState += 3
        
        return positionState
    }

    #managePathFindingState(enemyState, destState, trackerMap, wallX, wallY, wallW, wallH) {
        switch ( enemyState ) {
            case 11: this.#handleTopLeftState(destState, wallX, wallY, wallW, wallH)
                break
            case 12: this.#handleLeftState(destState, trackerMap, wallX, wallY, wallH)
                break
            case 13: this.#handleBottomLeftState(destState, wallX, wallY, wallW, wallH)
                break
            case 21: this.#handleTopState(destState, trackerMap, wallX, wallY, wallW)
                break
            case 23: this.#handleBottomState(destState, trackerMap, wallX, wallY, wallW, wallH)
                break
            case 31: this.#handleTopRightState(destState, wallX, wallY, wallW, wallH)
                break
            case 32: this.#handleRightState(destState, trackerMap, wallX, wallY, wallW, wallH)
                break
            case 33: this.#handleBottomRightState(destState, wallX, wallY, wallW, wallH)
                break
        }
    }

    #handleTopLeftState(destState, wallX, wallY, wallW, wallH) {
        switch ( destState ) {
            case 23:
                this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                break
            case 32:
                this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                break
            case 33:
                if ( Math.random() < 0.5 ) {
                    if ( this.pathFindingX === wallX - 50 && this.pathFindingY === wallY + wallH + 50 ) return
                    this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                    return
                } 
                if ( this.pathFindingX === wallX + wallW + 50 && this.pathFindingY === wallY - 50 ) return
                this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                break  
            default:
                this.#addPathFinding(null, null)
        }
    }

    #handleLeftState(destState, trackerMap, wallX, wallY, wallH) {
        switch ( destState ) {
            case 21:
            case 31:
                this.#addPathFinding(wallX - 50, wallY - 50)
                break
            case 32:    
                if ( trackerMap.has('tl') && trackerMap.has('bl') ) {
                    if ( Math.random() < 0.5 ) {
                        if ( this.pathFindingX === wallX - 50 && this.pathFindingY === wallY - 50 ) return
                        this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                        return
                    } 
                    if ( this.pathFindingX === wallX - 50 && this.pathFindingY === wallY + wallH + 50 ) return
                    this.#addPathFinding(wallX - 50, wallY - 50)
                } 
                else if ( !trackerMap.has('tl') ) this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                else if ( !trackerMap.has('bl') ) this.#addPathFinding(wallX - 50, wallY - 50)
                break
            case 23:
            case 33:
                this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                break
            default:
                this.#addPathFinding(null, null)                
        }
    }

    #handleBottomLeftState(destState, wallX, wallY, wallW, wallH) {
        switch ( destState ) {
            case 21:
                this.#addPathFinding(wallX - 50, wallY - 50)
                break
            case 31:       
                if ( Math.random() < 0.5 ) {
                    if ( this.pathFindingX === wallX - 50 && this.pathFindingY === wallY - 50 ) return
                    this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                    return
                } 
                if ( this.pathFindingX === wallX + wallW + 50 && this.pathFindingY === wallY + wallH + 50 ) return
                this.#addPathFinding(wallX - 50, wallY - 50)
                break
            case 32:
                this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                break
            default:
                this.#addPathFinding(null, null)            
        }
    }

    #handleTopState(destState, trackerMap, wallX, wallY, wallW) {
        switch ( destState ) {
            case 12:
            case 13:
                this.#addPathFinding(wallX - 50, wallY - 50)
                break
            case 23:    
                if ( trackerMap.has('tl') && trackerMap.has('tr') ) {
                    if ( Math.random() < 0.5 ) {
                        if ( this.pathFindingX === wallX - 50 && this.pathFindingY === wallY - 50 ) return
                        this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                        return
                    }
                    if ( this.pathFindingX === wallX + wallW + 50 && this.pathFindingY === wallY - 50) return
                    this.#addPathFinding(wallX - 50, wallY - 50)
                }    
                else if ( !trackerMap.has('tl') ) this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                else if ( !trackerMap.has('tr') ) this.#addPathFinding(wallX - 50, wallY - 50)
                break
            case 32:
            case 33:
                this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                break
            default:
                this.#addPathFinding(null, null)                    
        }
    }

    #handleBottomState(destState, trackerMap, wallX, wallY, wallW, wallH) {
        switch ( destState ) {
            case 11:
            case 12:
                this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                break
            case 21:    
                if ( trackerMap.has('bl') && trackerMap.has('br') ) {
                    if ( Math.random() < 0.5 ) {
                        if ( this.pathFindingX === wallX - 50 && this.pathFindingY === wallY + wallH + 50 ) return
                        this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                        return
                    }
                    if ( this.pathFindingX === wallX + wallW + 50 && this.pathFindingY === wallY + wallH + 50) return
                    this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                } 
                else if ( !trackerMap.has('bl') ) this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                else if ( !trackerMap.has('br') ) this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                break
            case 31:
            case 32:
                this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                break  
            default:
                this.#addPathFinding(null, null)                  
        }
    }

    #handleTopRightState(destState, wallX, wallY, wallW, wallH) {
        switch ( destState ) {
            case 12:
                this.#addPathFinding(wallX - 50, wallY - 50)
                break
            case 13:        
                if ( Math.random() < 0.5 ) {
                    if ( this.pathFindingX === wallX - 50 && this.pathFindingY === wallY - 50 ) return
                    this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                    return
                }
                if ( this.pathFindingX === wallX + wallW + 50 && this.pathFindingY === wallY + wallH + 50) return
                this.#addPathFinding(wallX - 50, wallY - 50)
                break
            case 23:
                this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                break  
            default:
                this.#addPathFinding(null, null)          
        }
    }

    #handleRightState(destState, trackerMap, wallX, wallY, wallW, wallH) {
        switch ( destState ) {
            case 11:
            case 21:
                this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                break
            case 12:    
                if ( trackerMap.has('bl') && trackerMap.has('br') ) {
                    if ( Math.random() < 0.5 ) {
                        if ( this.pathFindingX === wallX + wallW + 50 && this.pathFindingY === wallY + wallH + 50 ) return
                        this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                        return
                    }
                    if ( this.pathFindingX === wallX + wallW + 50 && this.pathFindingY === wallY - 50) return
                    this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                } 
                else if ( !trackerMap.has('tr') ) this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                else if ( !trackerMap.has('br') ) this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                break
            case 13:
            case 23:
                this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                break  
            default:
                this.#addPathFinding(null, null)
        }
    }

    #handleBottomRightState(destState, wallX, wallY, wallW, wallH) {
        switch ( destState ) {
            case 12:
                this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                break
            case 11:            
                if ( Math.random() < 0.5 ) {
                    if ( this.pathFindingX === wallX - 50 && this.pathFindingY === wallY + wallH + 50 ) return
                    this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                    return
                }
                if ( this.pathFindingX === wallX + wallW + 50 && this.pathFindingY === wallY - 50) return
                this.#addPathFinding(wallX - 50, wallY + wallH + 50)
            case 21:
                this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                break
            default:
                this.#addPathFinding(null, null)            
        }
    }

    #addPathFinding(x, y) {
        this.pathFindingX = x
        this.pathFindingY = y
    }

}
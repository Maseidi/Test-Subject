import { getCurrentRoomSolid } from '../../elements.js'
import { collide, containsClass, getProperty } from '../../util.js'

export class AbstractPathFindingService {
    constructor(enemy) {
        this.enemy = enemy
    }

    findPath() {
        const wall = this.#findWall()
        if ( !wall ) return
        const enemyWidth = getProperty(this.enemy.htmlTag, 'width', 'px')
        const { wallX, wallY, wallW, wallH } = this.#getWallCoordinates(wall)
        let enemyState = this.#getPositionState(this.enemy.x, this.enemy.y, enemyWidth, wallX, wallY, wallW, wallH)
        let destState = 
            this.#getPositionState(this.enemy.destX, this.enemy.destY, this.enemy.destWidth, wallX, wallY, wallW, wallH)
        const trackerMap = new Map([])
        Array.from(wall.children).forEach(tracker => trackerMap.set(tracker.classList[0], tracker))
        this.#managePathFindingState(enemyState, destState, trackerMap, wallX, wallY, wallW, wallH)
    }

    #findWall() {
        let wall
        for ( const solid of getCurrentRoomSolid() ) {
            if ( containsClass(solid.parentElement, 'enemy') ) continue
            if ( solid.getAttribute('side') === 'true' ) continue
            if ( solid === this.enemy.htmlTag.firstElementChild ) continue
            if ( !collide(this.enemy.htmlTag, solid, 50) ) continue
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
                    if ( this.enemy.pathFindingX === wallX - 50 && this.enemy.pathFindingY === wallY + wallH + 50 ) return
                    this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                    return
                } 
                if ( this.enemy.pathFindingX === wallX + wallW + 50 && this.enemy.pathFindingY === wallY - 50 ) return
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
                        if ( this.enemy.pathFindingX === wallX - 50 && this.enemy.pathFindingY === wallY - 50 ) return
                        this.#addPathFinding(wallX - 50, wallY + wallH + 50)
                        return
                    } 
                    if ( this.enemy.pathFindingX === wallX - 50 && this.enemy.pathFindingY === wallY + wallH + 50 ) return
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
                    if ( this.enemy.pathFindingX === wallX - 50 && this.enemy.pathFindingY === wallY - 50 ) return
                    this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                    return
                } 
                if ( this.enemy.pathFindingX === wallX + wallW + 50 && this.enemy.pathFindingY === wallY + wallH + 50 ) return
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
                        if ( this.enemy.pathFindingX === wallX - 50 && this.enemy.pathFindingY === wallY - 50 ) return
                        this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                        return
                    }
                    if ( this.enemy.pathFindingX === wallX + wallW + 50 && this.enemy.pathFindingY === wallY - 50) return
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
                        if ( this.enemy.pathFindingX === wallX - 50 && this.enemy.pathFindingY === wallY + wallH + 50 ) return
                        this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                        return
                    }
                    if ( this.enemy.pathFindingX === wallX + wallW + 50 && this.enemy.pathFindingY === wallY + wallH + 50) return
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
                    if ( this.enemy.pathFindingX === wallX - 50 && this.enemy.pathFindingY === wallY - 50 ) return
                    this.#addPathFinding(wallX + wallW + 50, wallY + wallH + 50)
                    return
                }
                if ( this.enemy.pathFindingX === wallX + wallW + 50 && this.enemy.pathFindingY === wallY + wallH + 50) return
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
                        if ( this.enemy.pathFindingX === wallX + wallW + 50 && this.enemy.pathFindingY === wallY + wallH + 50 ) return
                        this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                        return
                    }
                    if ( this.enemy.pathFindingX === wallX + wallW + 50 && this.enemy.pathFindingY === wallY - 50) return
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
                    if ( this.enemy.pathFindingX === wallX - 50 && this.enemy.pathFindingY === wallY + wallH + 50 ) return
                    this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                    return
                }
                if ( this.enemy.pathFindingX === wallX + wallW + 50 && this.enemy.pathFindingY === wallY - 50) return
                this.#addPathFinding(wallX - 50, wallY + wallH + 50)
            case 21:
                this.#addPathFinding(wallX + wallW + 50, wallY - 50)
                break
            default:
                this.#addPathFinding(null, null)            
        }
    }

    #addPathFinding(x, y) {
        this.enemy.pathFindingX = x
        this.enemy.pathFindingY = y
    }

}
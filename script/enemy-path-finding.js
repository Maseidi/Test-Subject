import { getCurrentRoomSolid } from './elements.js'
import { addAttribute, collide, containsClass } from './util.js'

export const findPath = (enemy) => {
    const wall = findWall(enemy)
    if ( !wall ) return
    const { enemyLeft, enemyTop, enemyW } = getEnemyCoordinates(enemy)
    const { destLeft, destTop, destW } = getDestinationCoordinates(enemy)
    const { wallLeft, wallTop, wallW, wallH } = getWallCoordinates(wall)
    let enemyState = getPositionState(enemyLeft, enemyTop, enemyW, enemyW, wallLeft, wallTop, wallW, wallH)
    let destState = getPositionState(destLeft, destTop, destW, destW, wallLeft, wallTop, wallW, wallH)
    const trackerMap = new Map([])
    Array.from(wall.children).forEach(tracker => trackerMap.set(tracker.classList[0], tracker))
    managePathfindingState(enemy, enemyState, destState, trackerMap, wallLeft, wallTop, wallW, wallH)
}

const findWall = (enemy) => {
    let wall
    for ( const solid of getCurrentRoomSolid() ) {
        if ( containsClass(solid.parentElement, 'enemy') ) continue
        if ( solid.getAttribute('side') === 'true' ) continue
        if ( solid === enemy.firstElementChild ) continue
        if ( !collide(enemy, solid, 50) ) continue
        wall = solid
        break
    }
    return wall
}

const getEnemyCoordinates = (enemy) => {
    const enemyCpu = window.getComputedStyle(enemy)
    const enemyLeft = Number(enemyCpu.left.replace('px', ''))
    const enemyTop = Number(enemyCpu.top.replace('px', ''))
    const enemyW = Number(enemyCpu.width.replace('px', ''))
    return { enemyLeft, enemyTop, enemyW }
}

const getDestinationCoordinates = (enemy) => {
    const destLeft = Number(enemy.getAttribute('dest-x'))
    const destTop = Number(enemy.getAttribute('dest-y'))
    const destW = Number(enemy.getAttribute('dest-w'))
    return { destLeft, destTop, destW }
}

const getWallCoordinates = (wall) => {
    const wallCpu = window.getComputedStyle(wall)
    const wallLeft = Number(wallCpu.left.replace('px', ''))
    const wallTop = Number(wallCpu.top.replace('px', ''))
    const wallW = Number(wallCpu.width.replace('px', ''))
    const wallH = Number(wallCpu.height.replace('px', ''))
    return { wallLeft, wallTop, wallW, wallH }
}

const getPositionState = (left, top, width, height, wLeft, wTop, wWidth, wHeight) => {
    let positionState
    if ( left + width < wLeft + 5 ) positionState = 10
    else if ( left + width >= wLeft + 5 && left < wLeft + wWidth - 5 ) positionState = 20
    else positionState = 30

    if ( top + height < wTop + 5 ) positionState += 1
    else if ( top + height >= wTop + 5 && top < wTop + wHeight - 5 ) positionState += 2
    else positionState += 3
    
    return positionState
}

const managePathfindingState = (enemy, enemyState, destState, trackerMap, wallLeft, wallTop, wallW, wallH) => {
    switch ( enemyState ) {
        case 11: handleTopLeftState(enemy, destState, wallLeft, wallTop, wallW, wallH)
            break
        case 12: handlLeftState(enemy, destState, trackerMap, wallLeft, wallTop, wallH)
            break
        case 13: handleBottomLeftState(enemy, destState, wallLeft, wallTop, wallW, wallH)
            break
        case 21: handleTopState(enemy, destState, trackerMap, wallLeft, wallTop, wallW)
            break
        case 23: handleBottomState(enemy, destState, trackerMap, wallLeft, wallTop, wallW, wallH)
            break
        case 31: handleTopRightState(enemy, destState, wallLeft, wallTop, wallW, wallH)
            break
        case 32: handleRightState(enemy, destState, trackerMap, wallLeft, wallTop, wallW, wallH)
            break
        case 33: handleBottomRightState(enemy, destState, wallLeft, wallTop, wallW, wallH)
            break
    }
}

const handleTopLeftState = (enemy, destState, wallLeft, wallTop, wallW, wallH) => {
    switch ( destState ) {
        case 23:
            addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
            break
        case 32:
            addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
            break
        case 33:
            const { destX, destY } = getDestination(enemy)
            if ( Math.random() < 0.5 ) {
                if ( destX === wallLeft - 50 && destY === wallTop + wallH + 50 ) return
                addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
                return
            } 
            if ( destX === wallLeft + wallW + 50 && destY === wallTop - 50 ) return
            addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
            break  
        default:
            addPathfinding(enemy, 'null', 'null')
    }
}

const handlLeftState = (enemy, destState, trackerMap, wallLeft, wallTop, wallH) => {
    switch ( destState ) {
        case 21:
        case 31:
            addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            break
        case 32:    
            if ( trackerMap.has('top-left') && trackerMap.has('bottom-left') ) {
                const { destX, destY } = getDestination(enemy)
                if ( Math.random() < 0.5 ) {
                    if ( destX === wallLeft - 50 && destY === wallTop - 50 ) return
                    addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
                    return
                } 
                if ( destX === wallLeft - 50 && destY === wallTop + wallH + 50 ) return
                addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            } 
            else if ( !trackerMap.has('top-left') ) addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
            else if ( !trackerMap.has('bottom-left') ) addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            break
        case 23:
        case 33:
            addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
            break
        default:
            addPathfinding(enemy, 'null', 'null')                
    }
}

const handleBottomLeftState = (enemy, destState, wallLeft, wallTop, wallW, wallH) => {
    switch ( destState ) {
        case 21:
            addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            break
        case 31:       
            const { destX, destY } = getDestination(enemy)
            if ( Math.random() < 0.5 ) {
                if ( destX === wallLeft - 50 && destY === wallTop - 50 ) return
                addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
                return
            } 
            if ( destX === wallLeft + wallW + 50 && destY === wallTop + wallH + 50 ) return
            addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            break
        case 32:
            addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
            break
        default:
            addPathfinding(enemy, 'null', 'null')            
    }
}

const handleTopState = (enemy, destState, trackerMap, wallLeft, wallTop, wallW) => {
    switch ( destState ) {
        case 12:
        case 13:
            addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            break
        case 23:    
            if ( trackerMap.has('top-left') && trackerMap.has('top-right') ) {
                const { destX, destY } = getDestination(enemy)
                if ( Math.random() < 0.5 ) {
                    if ( destX === wallLeft - 50 && destY === wallTop - 50 ) return
                    addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
                    return
                }
                if ( destX === wallLeft + wallW + 50 && destY === wallTop - 50) return
                addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            }    
            else if ( !trackerMap.has('top-left') ) addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
            else if ( !trackerMap.has('top-right') ) addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            break
        case 32:
        case 33:
            addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
            break
        default:
            addPathfinding(enemy, 'null', 'null')                    
    }
}

const handleBottomState = (enemy, destState, trackerMap, wallLeft, wallTop, wallW, wallH) => {
    switch ( destState ) {
        case 11:
        case 12:
            addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
            break
        case 21:    
            if ( trackerMap.has('bottom-left') && trackerMap.has('bottom-right') ) {
                const { destX, destY } = getDestination(enemy)
                if ( Math.random() < 0.5 ) {
                    if ( destX === wallLeft - 50 && destY === wallTop + wallH + 50 ) return
                    addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
                    return
                }
                if ( destX === wallLeft + wallW + 50 && destY === wallTop + wallH + 50) return
                addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
            } 
            else if ( !trackerMap.has('bottom-left') ) addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
            else if ( !trackerMap.has('bottom-right') ) addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
            break
        case 31:
        case 32:
            addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
            break  
        default:
            addPathfinding(enemy, 'null', 'null')                  
    }
}

const handleTopRightState = (enemy, destState, wallLeft, wallTop, wallW, wallH) => {
    switch ( destState ) {
        case 12:
            addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            break
        case 13:        
            const { destX, destY } = getDestination(enemy)
            if ( Math.random() < 0.5 ) {
                if ( destX === wallLeft - 50 && destY === wallTop - 50 ) return
                addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
                return
            }
            if ( destX === wallLeft + wallW + 50 && destY === wallTop + wallH + 50) return
            addPathfinding(enemy, wallLeft - 50, wallTop - 50)
            break
        case 23:
            addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
            break  
        default:
            addPathfinding(enemy, 'null', 'null')          
    }
}

const handleRightState = (enemy, destState, trackerMap, wallLeft, wallTop, wallW, wallH) => {
    switch ( destState ) {
        case 11:
        case 21:
            addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
            break
        case 12:    
            if ( trackerMap.has('bottom-left') && trackerMap.has('bottom-right') ) {
                const { destX, destY } = getDestination(enemy)
                if ( Math.random() < 0.5 ) {
                    if ( destX === wallLeft + wallW + 50 && destY === wallTop + wallH + 50 ) return
                    addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
                    return
                }
                if ( destX === wallLeft + wallW + 50 && destY === wallTop - 50) return
                addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
            } 
            else if ( !trackerMap.has('top-right') ) addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
            else if ( !trackerMap.has('bottom-right') ) addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
            break
        case 13:
        case 23:
            addPathfinding(enemy, wallLeft + wallW + 50, wallTop + wallH + 50)
            break  
        default:
            addPathfinding(enemy, 'null', 'null')                  
    }
}

const handleBottomRightState = (enemy, destState, wallLeft, wallTop, wallW, wallH) => {
    switch ( destState ) {
        case 12:
            addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
            break
        case 11:            
            const { destX, destY } = getDestination(enemy)
            if ( Math.random() < 0.5 ) {
                if ( destX === wallLeft - 50 && destY === wallTop + wallH + 50 ) return
                addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
                return
            }
            if ( destX === wallLeft + wallW + 50 && destY === wallTop - 50) return
            addPathfinding(enemy, wallLeft - 50, wallTop + wallH + 50)
        case 21:
            addPathfinding(enemy, wallLeft + wallW + 50, wallTop - 50)
            break
        default:
            addPathfinding(enemy, 'null', 'null')            
    }
}

const addPathfinding = (enemy, x, y) => {
    addAttribute(enemy, 'path-finding-x', x)
    addAttribute(enemy, 'path-finding-y', y)
}

const getDestination = (enemy) => {
    return {
        destX: Number(enemy.getAttribute('path-finding-x')),
        destY: Number(enemy.getAttribute('path-finding-y'))
    }
}
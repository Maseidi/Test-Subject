import { collide } from './util.js'
import { getCurrentRoomSolid } from './elements.js'

export const findPath = (enemy) => {
    let wall
    for ( const solid of getCurrentRoomSolid() ) {
        if ( solid.getAttribute('side') === 'true' ) continue
        if ( solid === enemy.firstElementChild ) continue
        if ( !collide(enemy, solid, 50) ) continue
        wall = solid
        break
    }
    if ( !wall ) return
    const enemyCpu = window.getComputedStyle(enemy)
    const enemyLeft = Number(enemyCpu.left.replace('px', ''))
    const enemyTop = Number(enemyCpu.top.replace('px', ''))
    const enemyW = Number(enemyCpu.width.replace('px', ''))

    const destLeft = Number(enemy.getAttribute('dest-x'))
    const destTop = Number(enemy.getAttribute('dest-y'))
    const destW = Number(enemy.getAttribute('dest-w'))

    const wallCpu = window.getComputedStyle(wall)
    const wallLeft = Number(wallCpu.left.replace('px', ''))
    const wallTop = Number(wallCpu.top.replace('px', ''))
    const wallW = Number(wallCpu.width.replace('px', ''))
    const wallH = Number(wallCpu.height.replace('px', ''))

    let enemyState = getPositionState(enemyLeft, enemyTop, enemyW, enemyW, wallLeft, wallTop, wallW, wallH)
    let destState = getPositionState(destLeft, destTop, destW, destW, wallLeft, wallTop, wallW, wallH)
}

const getPositionState = (left, top, width, height, wLeft, wTop, wWidth, wHeight) => {
    let positionState
    if ( left + width < wLeft ) positionState = 10
    else if ( left + width >= wLeft && left < wLeft + wWidth ) positionState = 20
    else positionState = 30

    if ( top + height < wTop ) positionState += 1
    else if ( top + height >= wTop && top < wTop + wHeight ) positionState += 2
    else positionState += 3
    
    return positionState
}
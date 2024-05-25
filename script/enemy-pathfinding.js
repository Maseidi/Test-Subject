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
    const enemyLeft = parseInt(enemyCpu.left)
    const enemyTop = parseInt(enemyCpu.top)
    const enemyW = parseInt(enemyCpu.width)

    const destLeft = Number(enemy.getAttribute('dest-x'))
    const destTop = Number(enemy.getAttribute('dest-y'))
    const destW = Number(enemy.getAttribute('dest-w'))

    const wallCpu = window.getComputedStyle(wall)
    const wallLeft = parseInt(wallCpu.left)
    const wallTop = parseInt(wallCpu.top)
    const wallWidth = parseInt(wallCpu.width)
    const wallH = parseInt(wallCpu.height)
}
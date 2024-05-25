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
    const wallWidth = Number(wallCpu.width.replace('px', ''))
    const wallH = Number(wallCpu.height.replace('px', ''))
}
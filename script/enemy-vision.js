import { angleOfTwoPoints, collide } from "./util.js"
import { getCurrentRoomSolid, getPlayer } from "./elements.js"

export const isPlayerVisible = (enemy) => {
    const enemyBound = enemy.getBoundingClientRect()
    const playerBound = getPlayer().getBoundingClientRect()
    const vision = enemy.firstElementChild.children[1]
    if ( !collide(vision, getPlayer(), 0) ) return false
    const walls = Array.from(getCurrentRoomSolid()).filter(wall => wall.getAttribute('side') === 'false' && collide(wall, vision, 0))
    if ( walls.length === 0 ) return true
    const angle3 = angleOfTwoPoints(playerBound.left + 17, playerBound.top + 17, 
        enemyBound.left + enemyBound.width / 2, enemyBound.top + enemyBound.height / 2)
    let visible = true
    for ( const wall of walls ) {
        const wallBound = wall.getBoundingClientRect()
        const wallTop = wallBound.top + 5
        const wallLeft = wallBound.left + 5
        const wallRight = wallBound.right - 5
        const wallBottom = wallBound.bottom - 5
        if ( enemyBound.top < wallTop && enemyBound.left >= wallLeft && enemyBound.left < wallRight ) {
            if ( !(playerBound.top <= wallTop) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'left', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'right', 'top')
                if ( angle3 < angle1 || angle3 > angle2 ) visible = false
                if ( !visible ) break
            }
        }
        if ( enemyBound.left >= wallRight && enemyBound.top >= wallTop && enemyBound.top < wallBottom ) {
            if ( !(playerBound.right >= wallRight) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'right', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'right', 'bottom')
                if ( angle3 < angle1 || angle3 > angle2 ) visible = false 
                if ( !visible ) break
            }                   
        }
        if ( enemyBound.top >= wallBottom && enemyBound.left >= wallLeft && enemyBound.left < wallRight ) {
            if ( !(playerBound.bottom >= wallBottom) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'left', 'bottom')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'right', 'bottom') 
                if ( angle3 > angle1 || angle3 < angle2 ) visible = false
                if ( !visible ) break
            }         
        }
        if ( enemyBound.left < wallLeft && enemyBound.top >= wallTop && enemyBound.top < wallBottom ) {
            if ( !(playerBound.left <= wallLeft) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'left', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'left', 'bottom')
                if ( angle3 > angle1 || angle3 < angle2 ) visible = false
                if ( !visible ) break
            }    
        }
        if ( enemyBound.top < wallTop && enemyBound.left >= wallRight ) {
            if ( !(playerBound.top <= wallTop || playerBound.right >= wallRight) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'left', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'right', 'bottom')
                if ( angle3 < angle1 && angle3 > angle2 ) visible = false
                if ( !visible ) break
            }
        }
        if ( enemyBound.top >= wallBottom && enemyBound.left >= wallRight ) {
            if ( !(playerBound.bottom >= wallBottom || playerBound.right >= wallRight) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'right', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'left', 'bottom')
                if ( angle3 < angle1 && angle3 > angle2 ) visible = false
                if ( !visible ) break
            }            
        }
        if ( enemyBound.top < wallTop && enemyBound.left < wallLeft ) {
            if ( !(playerBound.top <= wallTop || playerBound.left <= wallLeft) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'right', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'left', 'bottom')
                if ( angle3 > angle1 || angle3 < angle2 ) visible = false
                if ( !visible ) break
            }
        }
        if ( enemyBound.top >= wallBottom && enemyBound.left < wallLeft ) {
            if ( !(playerBound.left <= wallLeft || playerBound.bottom >= wallBottom) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'left', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'right', 'bottom')   
                if ( angle3 < angle2 && angle3 > angle1 ) visible = false
                if ( !visible ) break
            }
        }
    }  
    return visible
}

const angleToEnemy = (src, dest, param1, param2) => 
    angleOfTwoPoints(src[param1], src[param2], dest.left + dest.width / 2, dest.top + dest.height / 2)
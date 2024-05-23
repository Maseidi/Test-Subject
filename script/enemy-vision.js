import { getCurrentRoomSolid, getPlayer } from "./elements.js"
import { angleOfTwoPoints, collide } from "./util.js"

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
        if ( enemyBound.top < wallBound.top && enemyBound.left >= wallBound.left && enemyBound.left < wallBound.right ) {
            if ( !(playerBound.top <= wallBound.top) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'left', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'right', 'top')
                if ( angle3 < angle1 || angle3 > angle2 ) visible = false
                if ( !visible ) break
            }
        }
        if ( enemyBound.left >= wallBound.right && enemyBound.top >= wallBound.top && enemyBound.top < wallBound.bottom ) {
            if ( !(playerBound.right >= wallBound.right) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'right', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'right', 'bottom')
                if ( angle3 < angle1 && angle3 > angle2 ) visible = false 
                if ( !visible ) break
            }                   
        }
        if ( enemyBound.top >= wallBound.bottom && enemyBound.left >= wallBound.left && enemyBound.left < wallBound.right ) {
            if ( !(playerBound.bottom >= wallBound.bottom) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'left', 'bottom')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'right', 'bottom') 
                if ( angle3 > angle1 && angle3 < angle2 ) visible = false
                if ( !visible ) break
            }         
        }
        if ( enemyBound.left < wallBound.left && enemyBound.top >= wallBound.top && enemyBound.top < wallBound.bottom ) {
            if ( !(playerBound.left <= wallBound.left) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'left', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'left', 'bottom')
                if ( angle3 > angle1 && angle3 < angle2 ) visible = false
                if ( !visible ) break
            }    
        }
        if ( enemyBound.top < wallBound.top && enemyBound.left >= wallBound.right ) {
            if ( !(playerBound.top <= wallBound.top || playerBound.right >= wallBound.right) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'left', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'right', 'bottom')
                if ( angle3 < angle1 && angle3 > angle2 ) visible = false
                if ( !visible ) break
            }
        }
        if ( enemyBound.top >= wallBound.bottom && enemyBound.left >= wallBound.right ) {
            if ( !(playerBound.bottom >= wallBound.bottom || playerBound.right >= wallBound.right) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'right', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'left', 'bottom')
                if ( angle3 < angle1 && angle3 > angle2 ) visible = false
                if ( !visible ) break
            }            
        }
        if ( enemyBound.top < wallBound.top && enemyBound.left < wallBound.left ) {
            if ( !(playerBound.top <= wallBound.top || playerBound.left <= wallBound.left) ) {
                const angle1 = angleToEnemy(wallBound, enemyBound, 'right', 'top')    
                const angle2 = angleToEnemy(wallBound, enemyBound, 'left', 'bottom')  
                if ( angle3 > angle1 && angle3 < angle2 ) visible = false
                if ( !visible ) break
            }
        }
        if ( enemyBound.top >= wallBound.bottom && enemyBound.left < wallBound.left ) {
            if ( !(playerBound.left <= wallBound.left || playerBound.bottom >= wallBound.bottom) ) {
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
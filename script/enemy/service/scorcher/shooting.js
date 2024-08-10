import { RangerShootingService } from '../ranger/shooting.js'
import { getCurrentRoom, getCurrentRoomBullets } from '../../../elements.js'
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../../../variables.js'
import { 
    addAttribute,
    addFireEffect,
    angleOfTwoPoints,
    calculateBulletSpeed,
    createAndAddClass,
    getProperty } from '../../../util.js'

export class ScorcherShootingService extends RangerShootingService {
    constructor(enemy) {
        super(enemy)        
        this.fireRate = 30
    }

    shootAnimation() {
        this.rotateHand(this.enemy.shootCounter < this.fireRate / 2, 2)
        this.rotateHand(this.enemy.shootCounter >= this.fireRate / 2 && this.enemy.shootCounter < this.fireRate - 1, -2)
        if ( this.enemy.shootCounter <= this.fireRate - 1 ) return
        const arm = this.enemy.htmlTag.firstElementChild.firstElementChild.firstElementChild
        arm.style.transform = `rotateZ(0deg)`
        arm.style.transformOrigin = 'center' 
    }

    rotateHand(predicate, amount) {
        if ( !predicate ) return
        const arm = this.enemy.htmlTag.firstElementChild.firstElementChild.firstElementChild
        const currAngle = getProperty(arm, 'transform', 'rotateZ(', 'deg)')
        arm.style.transformOrigin = 'top'
        arm.style.transform = `rotateZ(${currAngle + amount}deg)`
    }

    shoot() {
        const { x: srcX, y: srcY } = { 
            x: getProperty(this.enemy.htmlTag, 'left', 'px') + 18.5, 
            y: getProperty(this.enemy.htmlTag, 'top', 'px') + 18.5 
        }
        const { x: destX, y: destY } = { x: getPlayerX() - getRoomLeft() + 17, y: getPlayerY() - getRoomTop() + 17 }
        const deg = angleOfTwoPoints(srcX, srcY, destX, destY)
        const diffY = destY - srcY
        const diffX = destX - srcX
        const slope = Math.abs(diffY / diffX)
        const { speedX, speedY } = calculateBulletSpeed(deg, slope, diffY, diffX, 10)
        const bullet = createAndAddClass('div', 'scorcher-bullet')
        addAttribute(bullet, 'speed-x', speedX)
        addAttribute(bullet, 'speed-y', speedY)
        addAttribute(bullet, 'damage', this.enemy.damage)
        bullet.style.left = `${srcX}px`
        bullet.style.top = `${srcY}px`
        bullet.style.backgroundColor = `crimson`
        const fire = addFireEffect()
        bullet.append(fire)
        bullet.style.transform = `rotateZ(${deg}deg)`
        getCurrentRoom().append(bullet)
        getCurrentRoomBullets().push(bullet)
        this.enemy.movementService.resetAcceleration()
    }

}
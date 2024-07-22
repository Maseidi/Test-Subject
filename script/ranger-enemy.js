import { NormalEnemy } from './normal-enemy.js'
import { manageAimModeAngle } from './player-angle.js'
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from './variables.js'
import { getCurrentRoom, getCurrentRoomRangerBullets, getPlayer } from './elements.js'
import { addAttribute, addClass, angleOfTwoPoints, createAndAddClass, distance, removeClass } from './util.js'
import { CHASE, GO_FOR_RANGED, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE } from './enemy-constants.js'

export class RangerEnemy extends NormalEnemy {
    constructor(enemy) {
        super(enemy)
    }

    behave() {
        this.transferEnemy(false)
        switch ( this.getEnemyState() ) {
            case INVESTIGATE:
                this.handleInvestigationState()
                break
            case CHASE:
                if ( Math.random() < 0.008 ) this.setEnemyState(GO_FOR_RANGED)
            case NO_OFFENCE:
                this.handleChaseState()
                break
            case GO_FOR_RANGED:
                this.handleRangedAttackState()
                break
            case GUESS_SEARCH:
                this.handleGuessSearchState()
                break
            case LOST:
                this.handleLostState()
                break
            case MOVE_TO_POSITION:
                this.handleMove2PositionState()
                break
        }
    }

    transferEnemy(toggle) {
        const body = this.enemy.firstElementChild.firstElementChild
        if ( toggle ) addClass(body, 'no-transition')
        else removeClass(body, 'no-transition')
    }

    handleRangedAttackState() {
        this.transferEnemy(true)
        let shootCounter = Number(this.enemy.getAttribute('shoot-counter'))
        shootCounter++
        if ( shootCounter === 90 ) {
            const d = this.distance2Player()
            if ( d > this.enemy.getAttribute('vision') || d < 200 ||
                 this.enemy.getAttribute('wall-in-the-way') !== 'false' || 
                 Math.random() < 0.2 ) this.setEnemyState(CHASE)
            addAttribute(this.enemy, 'shoot-counter', -1)
            return
        }
        if ( shootCounter > 29 ) this.updateAngle2Player()
        addAttribute(this.enemy, 'shoot-counter', shootCounter)
        this.shootAnimation()
        if ( shootCounter !== 15 ) return
        if ( this.enemy.getAttribute('health') > 0 ) this.shoot()
    }

    updateAngle2Player() {
        addAttribute(this.enemy, 'aim-angle', 
            this.enemy.firstElementChild.children[1].style.transform.replace('rotateZ(', '').replace('deg)', ''))
        manageAimModeAngle(this.enemy)
    }

    shootAnimation() {
        const body = this.enemy.firstElementChild.firstElementChild
        const shootCounter = Number(this.enemy.getAttribute('shoot-counter'))
        let currAngle = Number(body.style.transform.replace('rotateZ(', '').replace('deg)', ''))
        if ( shootCounter < 15 ) body.style.transform = `rotateZ(${currAngle + 12}deg)`
        else if ( shootCounter < 29 ) body.style.transform = `rotateZ(${currAngle - 12}deg)`
    }

    shoot() {
        const enemyCpu = window.getComputedStyle(this.enemy)
        const { x: srcX, y: srcY } = { x: Number(enemyCpu.left.replace('px', '')) + 16, y: Number(enemyCpu.top.replace('px', '')) + 16 }
        const { x: destX, y: destY } = { x: getPlayerX() - getRoomLeft() + 17, y: getPlayerY() - getRoomTop() + 17 }
        const deg = angleOfTwoPoints(srcX, srcY, destX, destY)
        const diffY = destY - srcY
        const diffX = destX - srcX
        const slope = Math.abs(diffY / diffX)
        const { speedX, speedY } = this.calculateBulletSpeed(deg, slope, diffY, diffX)
        const bullet = createAndAddClass('div', 'ranger-bullet')
        addAttribute(bullet, 'speed-x', speedX)
        addAttribute(bullet, 'speed-y', speedY)
        addAttribute(bullet, 'damage', this.enemy.getAttribute('damage'))
        bullet.style.left = `${srcX}px`
        bullet.style.top = `${srcY}px`
        bullet.style.backgroundColor = `${this.enemy.getAttribute('virus')}`
        getCurrentRoom().append(bullet)
        getCurrentRoomRangerBullets().push(bullet)
        this.resetAcceleration()
    }

    calculateBulletSpeed(deg, slope, diffX, diffY) {
        let speedX
        let speedY
        const baseSpeed = 10
        if ( (deg < 45 && deg >= 0) || (deg < -135 && deg >= -180) ) {
            speedX = diffX < 0 ? baseSpeed * (1 / slope) : -baseSpeed * (1/ slope)
            speedY = diffY < 0 ? baseSpeed : -baseSpeed
        } else if ( (deg >= 135 && deg < 180) || (deg < 0 && deg >= -45) ) {
            speedX = diffX < 0 ? -baseSpeed * (1 / slope) : baseSpeed * (1/ slope)
            speedY = diffY < 0 ? -baseSpeed : baseSpeed
        } else if ( (deg >= 45 && deg < 90) || (deg < -90 && deg >= -135) ) {
            speedX = diffX < 0 ? baseSpeed : -baseSpeed
            speedY = diffY < 0 ? baseSpeed * slope : -baseSpeed * slope
        } else if ( (deg >= 90 && deg < 135) || (deg < -45 && deg >= -90) ) {
            speedX = diffX < 0 ? -baseSpeed : baseSpeed
            speedY = diffY < 0 ? -baseSpeed * slope : baseSpeed * slope
        }
        return { speedX, speedY }
    }

    checkCollision() {
        const collidingEnemy = this.findCollidingEnemy()
        if ( !collidingEnemy ) return
        if ( this.enemy.getAttribute('wall-in-the-way') === 'false' ) this.setEnemyState(GO_FOR_RANGED)
        this.handleCollision(collidingEnemy)
    }

}
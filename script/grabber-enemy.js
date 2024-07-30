import { addAttribute, addClass, appendAll, collide, createAndAddClass, isMoving, removeClass } from './util.js'
import { getCurrentRoomEnemies, getGrabBar, getPauseContainer, getPlayer, setGrabBar } from './elements.js'
import { NormalEnemy } from './normal-enemy.js'
import { CHASE, GRAB, GUESS_SEARCH, INVESTIGATE, LOST, MOVE_TO_POSITION, NO_OFFENCE, STAND_AND_WATCH, TRACKER } from './enemy-constants.js'
import { manageAimModeAngle } from './player-angle.js'
import { takeDamage } from './player-health.js'
import { getSprintPressed, setAimMode, setGrabbed, setNoOffenseCounter } from './variables.js'
import { removeWeapon } from './weapon-loader.js'

export class GrabberEnemy extends NormalEnemy {
    constructor(enemy) {
        super(enemy)
    }

    behave() {
        switch ( this.getEnemyState() ) {
            case INVESTIGATE:
                this.handleInvestigationState()
                break
            case CHASE:
            case NO_OFFENCE:
                this.handleChaseState()
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
            case GRAB:
                this.handleGrabState()
                break
        }
    }

    handleGrabState() {
        setNoOffenseCounter(0)
        const slider = getGrabBar().lastElementChild
        const percent = getProperty(slider, 'left', '%')
        if ( percent >= 100 ) this.releasePlayer()
        slider.style.left = `${percent + 0.7}%`
        const current = 10 * ( percent + 0.7 )
        this.#processPart(current, 'first')
        this.#processPart(current, 'second')
        this.#processPart(current, 'third')
    }

    #processPart(current, part) {
        const damage = Number(getGrabBar().getAttribute('damage'))
        if ( current > Number(getGrabBar().getAttribute(part)) + 100 && getGrabBar().getAttribute(`${part}-done`) !== 'true' ) {
            addClass(getGrabBar(), `${part}-fail`)
            takeDamage(damage)
            addAttribute(getGrabBar(), `${part}-done`, true)
        }
    }

    collidePlayer() {
        const state = this.getEnemyState()
        if ( ( state !== CHASE && state !== NO_OFFENCE ) || !collide(this.enemy, getPlayer(), 0) ) return false
        if ( state === CHASE ) {
            const decision = Math.random()
            if ( decision < 0.2 ) {
                this.hitPlayer()
                return
            }
            this.grabPlayer()
        }
        return true
    }

    grabPlayer() {
        setAimMode(false)
        removeClass(getPlayer(), 'aim')
        removeWeapon()
        takeDamage(this.enemy.getAttribute('damage') / 2)
        if ( getSprintPressed() ) removeClass(getPlayer(), 'run')
        if ( isMoving() ) removeClass(getPlayer(), 'walk')    
        addClass(this.enemy.firstElementChild.firstElementChild, 'no-transition')
        addClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')
        const angle2Player = this.angle2Player()
        addAttribute(this.enemy, 'aim-angle', angle2Player)
        manageAimModeAngle(this.enemy)
        const angle2Enemy = -Math.sign(angle2Player) * ( 180 - Math.abs(angle2Player) )
        addAttribute(getPlayer(), 'aim-angle', angle2Enemy)
        manageAimModeAngle(getPlayer())
        addClass(this.enemy, 'grab')
        setGrabbed(true)
        getCurrentRoomEnemies().forEach(elem => elem.setEnemyState(STAND_AND_WATCH))
        this.setEnemyState(GRAB)
        this.renderQte()
    }

    renderQte() {
        const grabBar = createAndAddClass('div', 'grab-bar')
        const first = Math.floor(Math.random() * 230)
        const second = 330 + Math.floor(Math.random() * 230)
        const third = 660 + Math.floor(Math.random() * 230)
        const firstElem = createAndAddClass('div', 'first', 'breakpoint')
        firstElem.style.left = `${first / 10}%`
        const secondElem = createAndAddClass('div', 'second', 'breakpoint')
        secondElem.style.left = `${second / 10}%`
        const thirdElem = createAndAddClass('div', 'third', 'breakpoint')
        thirdElem.style.left = `${third / 10}%`
        const slider = createAndAddClass('div', 'slider')
        slider.style.left = `0%`
        const messageContainer = createAndAddClass('div', 'grab-bar-message-container')
        const message = createAndAddClass('p', 'grab-bar-message')
        message.textContent = 'press'
        const button = createAndAddClass('p', 'grab-bar-btn')
        button.textContent = 'f'
        appendAll(messageContainer, message, button)
        appendAll(grabBar, firstElem, secondElem, thirdElem, messageContainer, slider)
        addAttribute(grabBar, 'first', first)
        addAttribute(grabBar, 'second', second)
        addAttribute(grabBar, 'third', third)
        addAttribute(grabBar, 'damage', this.enemy.getAttribute('damage') / 6)
        getPauseContainer().append(grabBar)
        setGrabBar(grabBar)
    }

    releasePlayer() {
        if ( getSprintPressed() ) addClass(getPlayer(), 'run')
        if ( isMoving() ) addClass(getPlayer(), 'walk')    
        removeClass(this.enemy.firstElementChild.firstElementChild, 'no-transition')
        removeClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')
        removeClass(this.enemy, 'grab')
        setGrabbed(false)
        getCurrentRoomEnemies().forEach(elem => {
            if ( elem.enemy.getAttribute('type') === TRACKER ) elem.setEnemyState(INVESTIGATE)
            else elem.setEnemyState(NO_OFFENCE)    
        })
        setNoOffenseCounter(1)
        this.removeQte()
    }

    removeQte() {
        getPauseContainer().firstElementChild.remove()
    }

}
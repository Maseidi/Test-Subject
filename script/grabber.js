import { takeDamage } from './player-health.js'
import { NormalEnemy } from './normal-enemy.js'
import { removeWeapon } from './weapon-loader.js'
import { manageAimModeAngle } from './player-angle.js'
import { getCurrentRoomEnemies, getGrabBar, getPauseContainer, getPlayer, setGrabBar } from './elements.js'
import { addAttribute, addClass, appendAll, collide, createAndAddClass, getProperty, isMoving, removeClass } from './util.js'
import { 
    getPlayerAngle,
    getPlayerAngleState,
    getSprintPressed,
    setAimMode,
    setGrabbed,
    setNoOffenseCounter,
    setPlayerAngle,
    setPlayerAngleState } from './variables.js'
import { 
    CHASE,
    GRAB,
    GRABBER,
    GUESS_SEARCH,
    INVESTIGATE,
    LOST,
    MOVE_TO_POSITION,
    NO_OFFENCE,
    STAND_AND_WATCH,
    TRACKER } from './enemy-constants.js'

export class Grabber extends NormalEnemy {
    constructor(level, path, progress) {
        const health = Math.floor(level * 100 + Math.random() * 50)
        const damage = Math.floor(level * 20 + Math.random() * 10)
        const maxSpeed = 3 + Math.random()
        super(GRABBER, 4, path, health, damage, 100, maxSpeed, progress, 400, 1.4)
    }

    behave() {
        switch ( this.state ) {
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
        if ( current > Number(getGrabBar().getAttribute(part)) + 100 && getGrabBar().getAttribute(`${part}-done`) !== 'true' ) {
            addClass(getGrabBar(), `${part}-fail`)
            takeDamage(Number(getGrabBar().getAttribute('damage')))
            addAttribute(getGrabBar(), `${part}-done`, true)
        }
    }

    collidePlayer() {
        if ( ( this.state !== CHASE && this.state !== NO_OFFENCE ) || !collide(this.htmlTag, getPlayer(), 0) ) return false
        if ( this.state === CHASE ) {
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
        takeDamage(this.damage / 2)
        if ( getSprintPressed() ) removeClass(getPlayer(), 'run')
        if ( isMoving() ) removeClass(getPlayer(), 'walk')
        addClass(this.htmlTag.firstElementChild.firstElementChild, 'no-transition')
        addClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')

        const angle2Player = this.angle2Player()
        manageAimModeAngle(
            this.htmlTag, angle2Player, () => this.angle, (val) => this.angle = val, (val) => this.angleState = val
        )

        const angle2Enemy = -Math.sign(angle2Player) * ( 180 - Math.abs(angle2Player) )
        manageAimModeAngle(
            getPlayer(), angle2Enemy, getPlayerAngle, setPlayerAngle, setPlayerAngleState
        )

        addClass(this.htmlTag, 'grab')
        setGrabbed(true)
        getCurrentRoomEnemies().forEach(elem => elem.state = STAND_AND_WATCH)
        this.state = GRAB
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
        addAttribute(grabBar, 'damage', this.damage / 6)
        getPauseContainer().append(grabBar)
        setGrabBar(grabBar)
    }

    releasePlayer() {
        if ( getSprintPressed() ) addClass(getPlayer(), 'run')
        if ( isMoving() ) addClass(getPlayer(), 'walk')    
        removeClass(this.htmlTag.firstElementChild.firstElementChild, 'no-transition')
        removeClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')
        removeClass(this.htmlTag, 'grab')
        setGrabbed(false)
        getCurrentRoomEnemies().forEach(elem => elem.state = elem.type === TRACKER ? INVESTIGATE : NO_OFFENCE)
        setNoOffenseCounter(1)
        this.removeQte()
    }

    removeQte() {
        getPauseContainer().firstElementChild.remove()
    }

}
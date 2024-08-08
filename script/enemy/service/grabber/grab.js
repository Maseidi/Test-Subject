import { damagePlayer } from '../../../player-health.js'
import { removeWeapon } from '../../../weapon-loader.js'
import { manageAimModeAngle } from '../../../player-angle.js'
import { getCurrentRoomEnemies, getGrabBar, getPauseContainer, getPlayer, setGrabBar } from '../../../elements.js'
import { addAttribute, addClass, appendAll, createAndAddClass, getProperty, isMoving, removeClass } from '../../../util.js'
import { GO_FOR_RANGED, GRAB, INVESTIGATE, NO_OFFENCE, RANGER, STAND_AND_WATCH, TRACKER } from '../../util/enemy-constants.js'
import { 
    getPlayerAngle,
    getSprintPressed,
    setAimMode,
    setGrabbed,
    setNoOffenseCounter,
    setPlayerAngle,
    setPlayerAngleState } from '../../../variables.js'

export class GrabberGrabService {
    constructor(enemy) {
        this.enemy = enemy
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
            damagePlayer(this.enemy.damage / 6)
            addAttribute(getGrabBar(), `${part}-done`, true)
        }
    }

    grabPlayer() {
        setAimMode(false)
        removeClass(getPlayer(), 'aim')
        removeClass(getPlayer(), 'throwable-aim')
        removeWeapon()
        damagePlayer(this.enemy.damage / 2)
        if ( getSprintPressed() ) removeClass(getPlayer(), 'run')
        if ( isMoving() ) removeClass(getPlayer(), 'walk')
        addClass(this.enemy.htmlTag.firstElementChild.firstElementChild, 'no-transition')
        addClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')

        const angle2Player = this.enemy.angleService.angle2Player()
        manageAimModeAngle(
            this.enemy.htmlTag, 
            angle2Player, 
            () => this.enemy.angle, 
            (val) => this.enemy.angle = val, 
            (val) => this.enemy.angleState = val
        )

        const angle2Enemy = -Math.sign(angle2Player) * ( 180 - Math.abs(angle2Player) )
        manageAimModeAngle(
            getPlayer(), angle2Enemy, getPlayerAngle, setPlayerAngle, setPlayerAngleState 
        )

        addClass(this.enemy.htmlTag, 'grab')
        setGrabbed(true)
        getCurrentRoomEnemies().forEach(elem => {
            if ( elem.type === RANGER && elem.state === GO_FOR_RANGED ) return
            else elem.state = STAND_AND_WATCH
        })
        this.enemy.state = GRAB
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
        getPauseContainer().append(grabBar)
        setGrabBar(grabBar)
    }

    releasePlayer() {
        if ( getSprintPressed() ) addClass(getPlayer(), 'run')
        if ( isMoving() ) addClass(getPlayer(), 'walk')    
        removeClass(this.enemy.htmlTag.firstElementChild.firstElementChild, 'no-transition')
        removeClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')
        removeClass(this.enemy.htmlTag, 'grab')
        setGrabbed(false)
        getCurrentRoomEnemies().forEach(elem => elem.state = elem.type === TRACKER ? INVESTIGATE : NO_OFFENCE)
        setNoOffenseCounter(1)
        this.removeQte()
    }

    removeQte() {
        getPauseContainer().firstElementChild.remove()
    }

}
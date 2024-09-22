import { damagePlayer } from '../../../player-health.js'
import { manageAimModeAngle } from '../../../angle-manager.js'
import { getCurrentRoomEnemies, getGrabBar, getPauseContainer, getPlayer, setGrabBar } from '../../../elements.js'
import { 
    GO_FOR_RANGED,
    GRAB,
    INVESTIGATE,
    NO_OFFENCE,
    RANGER,
    SCORCHER,
    STAND_AND_WATCH,
    STINGER,
    TRACKER } from '../../enemy-constants.js'
import { 
    addAllAttributes,
    addClass,
    appendAll,
    createAndAddClass,
    exitAimModeAnimation,
    getProperty,
    isMoving,
    removeClass, 
    removeEquipped} from '../../../util.js'
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
            getGrabBar().setAttribute(`${part}-done`, true)
        }
    }

    grabPlayer() {
        setAimMode(false)
        exitAimModeAnimation()
        removeEquipped()
        damagePlayer(this.enemy.damage / 2)
        if ( getSprintPressed() ) removeClass(getPlayer(), 'run')
        if ( isMoving() ) removeClass(getPlayer(), 'walk')
        addClass(this.enemy.sprite.firstElementChild.firstElementChild, 'no-transition')
        addClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')

        const angle2Player = this.enemy.angleService.angle2Player()
        manageAimModeAngle(
            this.enemy.sprite, 
            angle2Player, 
            () => this.enemy.angle, 
            (val) => this.enemy.angle = val, 
            (val) => this.enemy.angleState = val
        )

        const angle2Enemy = -Math.sign(angle2Player) * ( 180 - Math.abs(angle2Player) )
        manageAimModeAngle(
            getPlayer(), angle2Enemy, getPlayerAngle, setPlayerAngle, setPlayerAngleState 
        )

        addClass(this.enemy.sprite, 'grab')
        setGrabbed(true)
        getCurrentRoomEnemies().forEach(elem => {
            if ( [RANGER, STINGER, SCORCHER].includes(elem.type) && elem.state === GO_FOR_RANGED ) return
            else elem.state = STAND_AND_WATCH
        })
        this.enemy.state = GRAB
        this.enemy.offenceService.infectPlayer()
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
        addAllAttributes(
            grabBar, 
            'first', first, 
            'second', second, 
            'third', third
        )
        getPauseContainer().append(grabBar)
        setGrabBar(grabBar)
    }

    releasePlayer() {
        if ( getSprintPressed() ) addClass(getPlayer(), 'run')
        if ( isMoving() ) addClass(getPlayer(), 'walk')    
        removeClass(this.enemy.sprite.firstElementChild.firstElementChild, 'no-transition')
        removeClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')
        removeClass(this.enemy.sprite, 'grab')
        setGrabbed(false)
        getCurrentRoomEnemies().forEach(elem => elem.state = elem.type === TRACKER ? INVESTIGATE : NO_OFFENCE)
        setNoOffenseCounter(1)
        this.removeQte()
    }

    removeQte() {
        getPauseContainer().firstElementChild.remove()
    }

}
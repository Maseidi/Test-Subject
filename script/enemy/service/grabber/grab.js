import { manageAimModeAngle } from '../../../angle-manager.js'
import {
    getCurrentRoomEnemies,
    getGrabBar,
    getInteractButton,
    getPauseContainer,
    getPlayer,
    setGrabBar,
} from '../../../elements.js'
import { damagePlayer } from '../../../player-health.js'
import { getSettings } from '../../../settings.js'
import { renderInteractButton } from '../../../user-interface.js'
import {
    addAllAttributes,
    addClass,
    addSplatter,
    appendAll,
    createAndAddClass,
    exitAimModeAnimation,
    getProperty,
    getSpeedPerFrame,
    isMoving,
    removeClass,
    removeEquipped,
} from '../../../util.js'
import {
    getHealth,
    getPlayerAngle,
    getSprintPressed,
    setAimMode,
    setGrabbed,
    setNoOffenseCounter,
    setPlayerAngle,
    setPlayerAngleState,
} from '../../../variables.js'
import {
    GO_FOR_RANGED,
    GRAB,
    INVESTIGATE,
    NO_OFFENCE,
    RANGER,
    SCORCHER,
    STAND_AND_WATCH,
    STINGER,
    TRACKER,
} from '../../enemy-constants.js'

export class GrabberGrabService {
    constructor(enemy) {
        this.enemy = enemy
    }

    handleGrabState() {
        const grabBar = getGrabBar()
        if (!grabBar || grabBar !== this.grabBar || !grabBar.isConnected) {
            if (!grabBar || grabBar === this.grabBar) this.releasePlayer()
            else this.enemy.state = STAND_AND_WATCH
            return
        }
        setNoOffenseCounter(0)
        const slider = grabBar.lastElementChild
        if (!slider) {
            this.releasePlayer()
            return
        }
        const percent = getProperty(slider, 'left', '%')
        if (percent >= 100) {
            this.releasePlayer()
            return
        }
        const newValue = percent + getSpeedPerFrame(0.7)
        slider.style.left = `${newValue}%`
        const current = 10 * newValue
        this.#processPart(grabBar, current, 'first')
        this.#processPart(grabBar, current, 'second')
        this.#processPart(grabBar, current, 'third')
    }

    #processPart(grabBar, current, part) {
        if (!grabBar.isConnected) return
        if (
            current > Number(grabBar.getAttribute(part)) + 100 &&
            grabBar.getAttribute(`${part}-done`) !== 'true'
        ) {
            addClass(grabBar, `${part}-fail`)
            damagePlayer(this.enemy.damage / 6)
            grabBar.setAttribute(`${part}-done`, true)
        }
    }

    grabPlayer() {
        addSplatter()
        damagePlayer(this.enemy.damage / 2)
        if (getHealth() === 0) return
        setGrabbed(true)
        setAimMode(false)
        exitAimModeAnimation()
        getInteractButton()?.remove()
        renderInteractButton()
        removeEquipped()
        if (getSprintPressed()) removeClass(getPlayer(), 'run')
        if (isMoving()) removeClass(getPlayer(), 'walk')
        addClass(this.enemy.sprite.firstElementChild.firstElementChild, 'no-transition')
        addClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')

        const angle2Player = this.enemy.angleService.angle2Player()
        manageAimModeAngle(
            this.enemy.sprite,
            angle2Player,
            () => this.enemy.angle,
            val => (this.enemy.angle = val),
            val => (this.enemy.angleState = val),
        )

        const angle2Enemy = -Math.sign(angle2Player) * (180 - Math.abs(angle2Player))
        manageAimModeAngle(getPlayer(), angle2Enemy, getPlayerAngle, setPlayerAngle, setPlayerAngleState)

        addClass(this.enemy.sprite, 'grab')
        getCurrentRoomEnemies().forEach(elem => {
            if ([RANGER, STINGER, SCORCHER].includes(elem.type) && elem.state === GO_FOR_RANGED) return
            else elem.state = STAND_AND_WATCH
        })
        this.renderQte()
        this.enemy.state = GRAB
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
        button.textContent = getSettings().controls.interact.replace(/^(Key|Digit)/, '')
        appendAll(messageContainer, message, button)
        appendAll(grabBar, firstElem, secondElem, thirdElem, messageContainer, slider)
        addAllAttributes(grabBar, 'first', first, 'second', second, 'third', third, 'damage', this.enemy.damage / 6)
        getPauseContainer().append(grabBar)
        this.grabBar = grabBar
        setGrabBar(grabBar)
    }

    releasePlayer() {
        if (getSprintPressed()) addClass(getPlayer(), 'run')
        if (isMoving()) addClass(getPlayer(), 'walk')
        setGrabbed(false)
        getInteractButton()?.remove()
        renderInteractButton()
        removeClass(this.enemy.sprite.firstElementChild.firstElementChild, 'no-transition')
        removeClass(getPlayer().firstElementChild.firstElementChild, 'no-transition')
        removeClass(this.enemy.sprite, 'grab')
        getCurrentRoomEnemies().forEach(elem => (elem.state = elem.type === TRACKER ? INVESTIGATE : NO_OFFENCE))
        setNoOffenseCounter(1)
        this.removeQte()
    }

    removeQte() {
        this.grabBar?.remove()
        if (getGrabBar() === this.grabBar) setGrabBar(null)
        this.grabBar = null
    }
}

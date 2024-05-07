import { addClass, appendAll } from "./util.js"
import { getMapEl, setPlayer } from "./elements.js"
import { getPlayerAngle, getPlayerX, getPlayerY } from "./variables.js"

export const loadPlayer = () => {
    const player = document.createElement("div")
    addClass(player, 'player')
    player.style.left = `${getPlayerX()}px`
    player.style.top = `${getPlayerY()}px`

    const playerCollider = document.createElement("div")
    addClass(playerCollider, 'player-collider')
    player.append(playerCollider)

    const playerBody = document.createElement("div")
    addClass(playerBody, 'player-body')
    playerBody.style.transform = `rotateZ(${getPlayerAngle()}deg)`

    const forwardDetector = document.createElement("div")
    addClass(forwardDetector, 'forward-detector')
    appendAll(playerCollider, playerBody, forwardDetector)

    const playerHead = document.createElement("div")
    addClass(playerHead, 'player-head')
    playerBody.append(playerHead)

    setPlayer(player)
    getMapEl().append(player)
}
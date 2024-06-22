import { getMapEl, setPlayer } from "./elements.js"
import { appendAll, createAndAddClass } from "./util.js"
import { getPlayerAngle, getPlayerX, getPlayerY } from "./variables.js"

export const loadPlayer = () => {
    const player = createAndAddClass('div', 'player')
    player.id = 'player'
    player.style.left = `${getPlayerX()}px`
    player.style.top = `${getPlayerY()}px`
    const playerCollider = createAndAddClass('div', 'player-collider')
    player.append(playerCollider)
    const playerBody = createAndAddClass('div', 'player-body')
    playerBody.style.transform = `rotateZ(${getPlayerAngle()}deg)`
    const forwardDetector = createAndAddClass('div', 'forward-detector')
    const tracker = createAndAddClass('div', 'player-tracker')
    appendAll(playerCollider, playerBody, forwardDetector, tracker)
    const playerHead = createAndAddClass('div', 'player-head')
    playerBody.append(playerHead)
    setPlayer(player)
    getMapEl().append(player)
}
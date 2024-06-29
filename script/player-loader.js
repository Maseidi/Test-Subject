import { getMapEl, setPlayer } from './elements.js'
import { getPlayerX, getPlayerY } from './variables.js'
import { addAttribute, appendAll, createAndAddClass } from './util.js'

export const loadPlayer = () => {
    const player = createAndAddClass('div', 'player')
    player.id = 'player'
    player.style.left = `${getPlayerX()}px`
    player.style.top = `${getPlayerY()}px`
    const playerCollider = createAndAddClass('div', 'player-collider')
    player.append(playerCollider)
    const playerBody = createAndAddClass('div', 'player-body')
    playerBody.style.transform = `rotateZ(0deg)`
    addAttribute(player, 'angle', 0)
    const forwardDetector = createAndAddClass('div', 'forward-detector')
    appendAll(playerCollider, playerBody, forwardDetector)
    const playerHead = createAndAddClass('div', 'player-head')
    playerBody.append(playerHead)
    setPlayer(player)
    getMapEl().append(player)
}
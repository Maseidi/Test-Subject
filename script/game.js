import { startUp } from './startup.js'
import { manageGameOver } from './game-over.js'
import { manageSprint } from './player-sprint.js'
import { manageEntities } from './entity-manager.js'
import { getPause, setGameId } from './variables.js'
import { managePlayerAngle } from './angle-manager.js'
import { manageHealthStatus } from './player-health.js'
import { manageWeaponActions } from './weapon-manager.js'
import { managePlayerMovement } from './player-movement.js'

export const play = () => {
    startUp()

    const gameId = window.setInterval(() => {
        if ( getPause() ) return
        manageSprint()
        manageGameOver()
        managePlayerAngle()
        manageEntities()
        managePlayerMovement()
        manageWeaponActions()
        manageHealthStatus()
    }, 1000 / 60)

    setGameId(gameId)

}
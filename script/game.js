import { startUp } from './startup.js'
import { manageGameOver } from './game-over.js'
import { manageSprint } from './player-sprint.js'
import { manageEntities } from './entity-manager.js'
import { managePlayerAngle } from './angle-manager.js'
import { manageHealthStatus } from './player-health.js'
import { manageWeaponActions } from './weapon-manager.js'
import { managePlayerMovement } from './player-movement.js'
import { getPause, setGameId, setIsMapMakerRoot } from './variables.js'

export const play = (mapMaker = false) => {
    setIsMapMakerRoot(mapMaker)
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
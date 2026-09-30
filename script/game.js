import { managePlayerAngle } from './angle-manager.js'
import { tickCampaignTime } from './campaign-stats.js'
import { manageEntities } from './entity-manager.js'
import { manageGameOver } from './game-over.js'
import { manageHealthStatus } from './player-health.js'
import { managePlayerMovement } from './player-movement.js'
import { manageSprint } from './player-sprint.js'
import { manageRoomCombat } from './progress-manager.js'
import { getSettings } from './settings.js'
import { startUp } from './startup.js'
import { getPause, setGameId } from './variables.js'
import { manageWeaponActions } from './weapon-manager.js'

export const play = () => {
    startUp()
    const gameId = window.setInterval(() => {
        tickCampaignTime(getPause())
        if (getPause()) return
        manageSprint()
        manageGameOver()
        managePlayerAngle()
        manageEntities()
        manageRoomCombat()
        managePlayerMovement()
        manageWeaponActions()
        manageHealthStatus()
    }, 1000 / getSettings().display.fps)
    setGameId(gameId)
}

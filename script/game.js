import { startUp } from './startup.js'
import { manageGameOver } from './game-over.js'
import { manageSprint } from './player-sprint.js'
import { manageEntities } from './entity-manager.js'
import { managePlayerAngle } from './angle-manager.js'
import { manageHealthStatus } from './player-health.js'
import { manageWeaponActions } from './weapon-manager.js'
import { manageSpawns } from './survival/spawn-manager.js'
import { managePlayerMovement } from './player-movement.js'
import { setEnemyId, setSpawnCounter } from './survival/variables.js'
import { getIsSurvival, getPause, setGameId, setIsMapMakerRoot, setIsSurvival } from './variables.js'

export const play = (mapMaker = false, survival = false) => {
    setIsMapMakerRoot(mapMaker)
    setIsSurvival(survival)
    if ( survival ) {
        setEnemyId(0)
        setSpawnCounter(0)
    }
    startUp()

    const gameId = window.setInterval(() => {
        if ( getPause() ) return
        if ( getIsSurvival() ) manageSpawns()
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
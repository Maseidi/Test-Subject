import { startUp } from './startup.js'
import { getPause } from './variables.js'
import { manageSprint } from './player-sprint.js'
import { manageEntities } from './entity-manager.js'
import { managePlayerAngle } from './angle-manager.js'
import { manageHealthStatus } from './player-health.js'
import { manageWeaponActions } from './weapon-manager.js'
import { managePlayerMovement } from './player-movement.js'
import { addControls, removeControls } from './controls.js'

let error = false
let gameId = null
export const play = () => {
    startUp()
    addControls()

    gameId = window.setInterval(() => {
        try {
            if ( error ) return
            if ( getPause() ) return
            manageSprint()
            managePlayerAngle()
            manageEntities()
            managePlayerMovement()
            manageWeaponActions()
            manageHealthStatus()
        } catch( err ) {
            console.error(err);
            error = true
        }
    }, 1000 / 60)

}

export const endSession = () => {
    removeControls()
    window.clearInterval(gameId)
    gameId = null
}
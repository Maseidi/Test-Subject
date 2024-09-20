import { startUp } from './startup.js'
import { getPause } from './variables.js'
import { initControls } from './controls.js'
import { manageSprint } from './player-sprint.js'
import { manageEntities } from './entity-manager.js'
import { managePlayerAngle } from './angle-manager.js'
import { logInfo, manageLogs } from './log-manager.js'
import { manageHealthStatus } from './player-health.js'
import { manageWeaponActions } from './weapon-manager.js'
import { managePlayerMovement } from './player-movement.js'

let error = false
export const play = () => {
    startUp()
    initControls()

    window.setInterval(() => {
        try {
            if ( error ) return
            if ( getPause() ) return
            manageSprint()
            managePlayerAngle()
            manageEntities()
            managePlayerMovement()
            manageWeaponActions()
            manageHealthStatus()
            // manageLogs()
        } catch( err ) {
            console.error(err);
            // logInfo()
            error = true
        }
    }, 1000 / 60)
}
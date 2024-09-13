import { startUp } from './startup.js'
import { control } from './controls.js'
import { manageSprint } from './player-sprint.js'
import { manageEntities } from './entity-manager.js'
import { managePlayerAngle } from './angle-manager.js'
import { logInfo, manageLogs } from './log-manager.js'
import { manageHealthStatus } from './player-health.js'
import { getPause, getPauseCause } from './variables.js'
import { manageWeaponActions } from './weapon-manager.js'
import { managePlayerMovement } from './player-movement.js'
import { managePopup, manageRoomName } from './popup-manager.js'

let error = false
export const play = () => {
    startUp()
    control()

    window.setInterval(() => {
        try {
            if ( error ) return
            if ( getPauseCause() !== 'pause' ) managePopup()
            if ( getPause() ) return
            manageSprint()
            managePlayerAngle()
            manageEntities()
            managePlayerMovement()
            manageWeaponActions()
            manageHealthStatus()
            manageRoomName()
            // manageLogs()
        } catch( err ) {
            console.error(err);
            logInfo()
            error = true
        }
    }, 1000 / 60)
}
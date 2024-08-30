import { startUp } from './startup.js'
import { control } from './controls.js'
import { manageSprint } from './player-sprint.js'
import { manageEntities } from './entity-manager.js'
import { managePlayerAngle } from './angle-manager.js'
import { manageHealthStatus } from './player-health.js'
import { getPause, getPauseCause } from './variables.js'
import { manageWeaponActions } from './weapon-actions.js'
import { managePlayerMovement } from './player-movement.js'
import { managePopup, manageRoomName } from './popup-manager.js'

export const play = () => {
    startUp()
    control()

    window.setInterval(() => {
        if ( getPauseCause() !== 'pause' ) managePopup()
        if ( getPause() ) return
        manageSprint()
        managePlayerAngle()
        manageEntities()
        managePlayerMovement()
        manageWeaponActions()
        manageHealthStatus()
        manageRoomName()
    }, 1000 / 60)
}
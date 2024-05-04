import { startUp } from "./startup.js"
import { control } from "./controls.js"
import { getPause } from "./variables.js"
import { manageSprint } from "./player-sprint.js"
import { manageEntities } from "./entity-manager.js"
import { managePlayerAngle } from "./player-angle.js"
import { manageWeaponActions } from "./weapon-actions.js"
import { managePlayerMovement } from "./player-movement.js"

export const play = () => {
    startUp()
    control()

    window.setInterval(() => {
        if ( !getPause() ) {
            manageSprint()
            managePlayerAngle()
            manageEntities()
            managePlayerMovement()
            manageWeaponActions()
        }      
    }, 1000 / 60)
}
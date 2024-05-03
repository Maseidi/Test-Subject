import { startUp } from "./startup.js"
import { control } from "./controls.js"
import { getPause } from "./variables.js"
import { manageAim } from "./weapon-action.js"
import { manageSprint } from "./player-sprint.js"
import { manageEntities } from "./entity-manager.js"
import { managePlayerAngle } from "./player-angle.js"
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
            manageAim()
        }      
    }, 1000 / 60)
}
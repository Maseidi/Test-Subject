import { control } from "./controls.js"
import { managePlayerMovement } from "./player-movement.js"
import { manageSprint } from "./player-sprint.js"
import { manageEntities } from "./room-entity-manager.js"
import { startUp } from "./startup.js"
import { managePlayerAngle } from "./player-angle.js"
import { manageAim } from "./aim-shoot-manager.js"
import { getInventoryOpen } from "./variables.js"

export const play = () => {
    startUp()
    control()

    window.setInterval(() => {
        if ( !getInventoryOpen() ) {
            manageSprint()
            managePlayerAngle()
            manageEntities()
            managePlayerMovement()
            manageAim()
        }      
    }, 1000 / 60)
}
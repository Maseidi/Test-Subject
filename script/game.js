import { control } from "./controls.js"
import { managePlayerMovement } from "./player-movement.js"
import { manageSprint } from "./player-sprint.js"
import { manageEntities } from "./room-entity-manager.js"
import { startUp } from "./startup.js"
import { managePlayerAngle } from "./player-angle.js"
import { getTarget } from "./variables.js"
import { manageAim } from "./aim-shoot-manager.js"

export const play = () => {
    startUp()
    control()

    window.setInterval(() => {
        manageSprint()
        managePlayerAngle()
        manageEntities()
        managePlayerMovement()
        manageAim()
        console.log(getTarget());
    }, 1000 / 60)
}
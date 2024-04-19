import { control } from "./controls.js"
import { managePlayerMovement } from "./player-movement.js"
import { manageSprint } from "./player-sprint.js"
import { manageEntities } from "./room-entity-manager.js"
import { startUp } from "./startup.js"
import { managePlayerAngle } from "./player-angle.js"
import { manageAim } from "./player-aim.js"

export const play = () => {
    startUp()
    control()

    window.setInterval(() => {
        manageSprint()
        manageAim()
        managePlayerAngle()
        manageEntities()
        managePlayerMovement()
    }, 1000 / 60)
}
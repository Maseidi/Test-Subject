import { control } from "./controls.js"
import { managePlayerMovement } from "./player-movement.js"
import { manageSprint } from "./player-sprint.js"
import { manageEntities } from "./room-entity-manager.js"
import { startUp } from "./startup.js"
import { managePlayerAngle } from "./player-angle.js"

export const play = () => {
    startUp()
    control()
    console.log(window.innerWidth / 2);
    console.log(window.innerHeight / 2);

    window.setInterval(() => {
        manageSprint()
        managePlayerAngle()
        manageEntities()
        managePlayerMovement()
    }, 1000 / 60)
}
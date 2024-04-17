import { control } from "./controls.js"
import { playerMovementAndDirection } from "./player-movement.js"
import { manageSprint } from "./player-sprint.js"
import { enterNewRoom } from "./room-loader.js"
import { startUp } from "./startup.js"

export const play = () => {
    startUp()
    control()

    window.setInterval(() => {
        manageSprint()
        playerMovementAndDirection()
        enterNewRoom()
    }, 1000 / 60)
}
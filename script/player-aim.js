import { getAimMode } from "./variables.js"
import { addClass, removeClass } from "./util.js"
import { getPlayer } from "./elements.js"

export const manageAim = () => {
    if ( getAimMode() ) {
        addClass(getPlayer(), 'aim')
        return
    }
    removeClass(getPlayer(), 'aim')
}
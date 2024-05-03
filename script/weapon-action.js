import { collide, containsClass } from "./util.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { getEquippedWeapon, setTarget } from "./variables.js"
import { getCurrentRoomSolid, getPlayer } from "./elements.js"

let counter = 0
export const manageAim = () => {
    if ( containsClass(getPlayer(), 'aim') ) {
        counter++
        if ( counter === 12 ) {
            counter = 0
            setTarget(null)
        } 
        if ( counter === 0 ) {
            const ownedWeapon = getOwnedWeapons().get(getEquippedWeapon())
            const range = ownedWeapon.getRange()
            const laser = getPlayer().children[0].children[0].children[1].children[0]
            laser.style.height = `${range}px`
            Array.from(laser.children).forEach((elem, index) => {
                for ( const solid of getCurrentRoomSolid() ) {
                    if ( collide(elem, solid, 0) ) {
                        setTarget(solid)
                        laser.style.height = `${index/100 * range}px`
                        return
                    }
                }
            })
        }
    }
}
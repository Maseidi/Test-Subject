import { getCurrentRoomSolid, getPlayer } from "./elements.js"
import { getOwnedWeapons } from "./owned-weapons.js";
import { collide, containsClass } from "./util.js"
import { getEquippedWeapon, setTarget } from "./variables.js";
import { getUpgradeDetails } from "./weapon-upgrades.js";

export const manageAim = () => {
    if ( containsClass(getPlayer(), 'aim') ) {
        const ownedWeapon = getOwnedWeapons().get(getEquippedWeapon())
        const range = getUpgradeDetails().get(ownedWeapon.name).range[ownedWeapon.rangeLvl - 1]
        const laser = getPlayer().children[0].children[0].children[1].children[0]
        setTarget(null)
        laser.style.height = `${range}px`
        Array.from(laser.children).forEach((elem, index) => {
            for ( const solid of getCurrentRoomSolid() ) {
                if ( collide(elem, solid, 0) ) {
                    setTarget(true)
                    laser.style.height = `${index/100 * range}px`
                    return
                }
            }
        })
    }
}
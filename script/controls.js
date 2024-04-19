import { cursorAngle } from "./player-angle.js"
import { 
    getAimMode,
    getEquippedWeapon,
    getWeaponWheel,
    setAimMode,
    setDownPressed,
    setEquippedWeapon,
    setLeftPressed,
    setRightPressed,
    setSprintPressed,
    setUpPressed } from "./variables.js"

export const control = () => {
    window.addEventListener("keydown", (e) => {
        const KEY = e.key
        if ( KEY === "w" || KEY === "W" ) {
            setUpPressed(true)
        }
        if ( KEY === "a" || KEY === "A" ) {
            setLeftPressed(true)
        }
        if ( KEY === "s" || KEY === "S" ) {
            setDownPressed(true)
        }
        if ( KEY === "d" || KEY === "D" ) {
            setRightPressed(true)
        }
        if ( KEY === "Shift" ) {
            setAimMode(false)
            setSprintPressed(true)
        }
        if ( KEY === "e" || KEY === "E") {
            if ( getEquippedWeapon() !== null  ) setAimMode(!getAimMode())
        }
        if ( KEY === "1" || KEY === "2" || KEY === "3" || KEY === "4") {
            if ( getWeaponWheel()[Number(KEY) - 1] === getEquippedWeapon() ) {
                setEquippedWeapon(null)
                setAimMode(false)
                return
            }
            setEquippedWeapon(getWeaponWheel()[Number(KEY) - 1])
        }
    })
    window.addEventListener("keyup", (e) => {
        const KEY = e.key
        if ( KEY === "w" || KEY === "W" ) {
            setUpPressed(false)
        }
        if ( KEY === "a" || KEY === "A" ) {
            setLeftPressed(false)
        }
        if ( KEY === "s" || KEY === "S" ) {
            setDownPressed(false)
        }
        if ( KEY === "d" || KEY === "D" ) {
            setRightPressed(false)
        }
        if ( KEY === "Shift" ) {
            setSprintPressed(false)
        }
    })
    onmousemove = (e) => {
        cursorAngle(e)
    }

}
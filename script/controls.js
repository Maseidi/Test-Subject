import { cursorAngle } from "./player-angle.js"
import { 
    getAimMode,
    setAimMode,
    setDownPressed,
    setLeftPressed,
    setRightPressed,
    setSprintPressed,
    setUpPressed } from "./variables.js"

export const control = () => {
    window.addEventListener("keydown", (e) => {
        if ( e.key === "w" || e.key === "W" ) {
            setUpPressed(true)
        }
        if ( e.key === "a" || e.key === "A" ) {
            setLeftPressed(true)
        }
        if ( e.key === "s" || e.key === "S" ) {
            setDownPressed(true)
        }
        if ( e.key === "d" || e.key === "D" ) {
            setRightPressed(true)
        }
        if ( e.key === "Shift" ) {
            setAimMode(false)
            setSprintPressed(true)
        }
        if ( e.key === "e" || e.key === "E") {
            setAimMode(!getAimMode())
        }
    })
    window.addEventListener("keyup", (e) => {
        if ( e.key === "w" || e.key === "W" ) {
            setUpPressed(false)
        }
        if ( e.key === "a" || e.key === "A" ) {
            setLeftPressed(false)
        }
        if ( e.key === "s" || e.key === "S" ) {
            setDownPressed(false)
        }
        if ( e.key === "d" || e.key === "D" ) {
            setRightPressed(false)
        }
        if ( e.key === "Shift" ) {
            setSprintPressed(false)
        }
    })
    onmousemove = (e) => {
        cursorAngle(e)
    }

}
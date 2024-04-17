import { setDownPressed, setLeftPressed, setRightPressed, setSprintPressed, setUpPressed } from "./variables.js"

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
            setSprintPressed(true)
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

}
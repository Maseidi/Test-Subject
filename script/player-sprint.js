import { 
    getAimMode,
    getAllowMove,
    getDownPressed,
    getLeftPressed,
    getRefillStamina,
    getRightPressed,
    getSprintPressed,
    getStamina,
    getUpPressed,
    setRefillStamina,
    setSprint,
    setStamina } from "./variables.js"

export const manageSprint = () => {
    if ( getSprintPressed() && !getAimMode() 
    && (getLeftPressed() || getRightPressed() || getUpPressed() || getDownPressed())) {
        if ( !getRefillStamina() && getAllowMove()) {
            setSprint(true)
            setStamina(getStamina() - 2)
            if ( getStamina() <= 0 ) {
                setStamina(0)
                setRefillStamina(true)
            }
        } else {
            setSprint(false)
            setStamina(getStamina() + 1)
            if ( getStamina() >= 600 ) {
                setStamina(600)
                setRefillStamina(false)
            }
        }
    } else {
        setSprint(false)
        setStamina(getStamina() + 1)
        if ( getStamina() >= 600 ) {
            setStamina(600)
        }
    }
}
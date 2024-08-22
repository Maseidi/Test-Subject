import { updateDoorStates } from './door.js'

let progress = {
    '1' : true,
    '2' : true,
    '3' : true,
}

export const getProgress = () => progress

export const findProgressByName = (name) => progress[name]

export const activateProgress = (name) => {
    if ( !name ) return
    progress = {
        ...progress,
        [name]: true
    }
    updateDoorStates(name)
}
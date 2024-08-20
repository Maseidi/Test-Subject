import { updateDoorStates } from './door.js'

let progress = {
    '3' : true
}

export const getProgress = (name) => progress[name]

export const activateProgress = (name) => {
    progress = {
        ...progress,
        [name]: true
    }
    updateDoorStates(name)
}
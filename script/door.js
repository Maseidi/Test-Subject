import { getCurrentRoomDoors } from './elements.js'

export class Door {
    constructor(color, progress, heading, popup, activeProgress) {
        this.color = color
        this.progress = progress
        this.heading = heading
        this.popup = popup
        this.activeProgress = activeProgress
    }
}

export const updateDoorStates = (progress) => 
    Array.from(getCurrentRoomDoors()).filter(door => door.getAttribute('progress') === progress ).forEach(door => door.remove())
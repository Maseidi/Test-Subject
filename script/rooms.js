import { Progress } from './progress.js'

class Room {
    constructor(id, width, height, label, progress) {
        this.id =                id                          ?? 0
        this.width =             width                       ?? 0
        this.height =            height                      ?? 0
        this.label =             label                       ?? null
        this.progress2Active =   progress?.progress2Active   ?? null
        this.progress2Deactive = progress?.progress2Deactive ?? null
    }
}

export const rooms = new Map([
    [1, new Room(1, 1100, 1100, 'Main Hall')],
    [2, new Room(2, 1000, 1000, 'Corridor to Heaven')],
    [9, new Room(9, 1000, 500, 'East Waiting Room', Progress.builder().setProgress2Active('400'))],
    [16, new Room(16, 1200, 900, 'Speech Room')],
    [37, new Room(37, 1600, 800, 'Cold Weapons Museum', Progress.builder().setProgress2Active('500'))],
])
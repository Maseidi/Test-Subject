import { Progress } from './progress.js'

export class Room {
    constructor(id, width, height, label, darkness, progress) {
        this.id =                id                          ?? 0
        this.width =             width                       ?? 0
        this.height =            height                      ?? 0
        this.label =             label                       ?? null
        this.darkness =          darkness                    ?  this.calculateDarkess(darkness) : 9  
        this.progress2Active =   progress?.progress2Active   ?? null
        this.progress2Deactive = progress?.progress2Deactive ?? null
    }

    calculateDarkess(darkness) {
        if ( darkness > 9 ) return 9
        else if ( darkness < 1 ) return 1
        return darkness
    }

}

export const rooms = new Map([
    [1, new Room(1, 500,  1000, 'Dormitory', 5)],
    [2, new Room(2, 1000, 500,  'Bunker A' , 5)],
    [3, new Room(3, 1000, 1000, 'Bunker B' , 5)],
    [4, new Room(4, 1000, 1000, 'Bunker C' , 5)],
])

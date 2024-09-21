import { Progress } from './progress.js'

export class Room {
    constructor(id, width, height, label, darkness, progress) {
        this.id =                id                          ?? 0
        this.width =             width                       ?? 0
        this.height =            height                      ?? 0
        this.label =             label                       ?? null
        this.darkness =          darkness                    ?  this.calculateDarkess(darkness) : 9  
        this.progress2Active =   progress?.progress2Active   ?? []
        this.progress2Deactive = progress?.progress2Deactive ?? []
    }

    calculateDarkess(darkness) {
        if ( darkness > 9 ) return 9
        else if ( darkness < 1 ) return 1
        return darkness
    }

}

export const rooms = new Map([
    [1, new Room(1, 500,  1000, 'Dormitory', 9, Progress.builder().setProgress2Active([1]))],
    [2, new Room(2, 1000, 500,  'Bunker A' , 5, Progress.builder().setProgress2Active([9]))],
    [3, new Room(3, 1000, 1000, 'Bunker B' , 5, Progress.builder().setProgress2Active([10]))],
])

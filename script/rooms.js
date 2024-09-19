export class Room {
    constructor(id, width, height, label, darkness, progress) {
        this.id =                id                          ?? 0
        this.width =             width                       ?? 0
        this.height =            height                      ?? 0
        this.label =             label                       ?? null
        this.darkness =          darkness                    ?  this.calculateDarkess(darkness) : 1  
        this.progress2Active =   progress?.progress2Active   ?? null
        this.progress2Deactive = progress?.progress2Deactive ?? null
    }

    calculateDarkess(darkness) {
        if ( darkness > 3 ) return 3
        else if ( darkness < 1 ) return 1
        return darkness
    }

}

export const rooms = new Map([
    [1, new Room(1, 1100, 1100, 'Main Hall')],
    [2, new Room(2, 1000, 1000, 'Corridor to Heaven')],
    [9, new Room(9, 1000, 500, 'East Waiting Room')],
    [16, new Room(16, 1200, 900, 'Speech Room')],
    [37, new Room(37, 1600, 800, 'Cold Weapons Museum')],
])
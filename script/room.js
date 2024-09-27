export const sections = {
    LAB: 'lab',
    YARD: 'yard',
    BUNKER: 'bunker',
    CASTLE: 'castle',
    MUSEUM: 'museum',
    LIBRARY: 'library'
}

export class Room {
    constructor(id, width, height, label, darkness, progress, section) {
        this.id =                id                          ?? 0
        this.width =             width                       ?? 0
        this.height =            height                      ?? 0
        this.label =             label                       ?? null
        this.darkness =          darkness                    ?  this.calculateDarkess(darkness) : 9
        this.progress2Active =   progress?.progress2Active   ?? []
        this.progress2Deactive = progress?.progress2Deactive ?? []
        this.section =           section                     ?? sections.BUNKER
    }

    calculateDarkess(darkness) {
        if ( darkness > 9 ) return 9
        else if ( darkness < 1 ) return 1
        return darkness
    }

}

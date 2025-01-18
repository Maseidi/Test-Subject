export class Room {
    constructor(id, width, height, label, brightness, progress, background) {
        this.id = id ?? 0
        this.width = width ?? 0
        this.height = height ?? 0
        this.label = label ?? null
        this.brightness = brightness ? this.calculateBrightness(brightness) : 10
        this.progress2Active = progress?.progress2Active ?? []
        this.progress2Deactive = progress?.progress2Deactive ?? []
        this.background = background ?? 'lightgrey'
    }

    calculateBrightness(brightness) {
        if (brightness > 10) return 10
        else if (brightness < 1) return 1
        return brightness
    }
}

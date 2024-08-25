export class Progress {
    constructor() {
        this.renderProgress = undefined
        this.progress2Active = undefined
        this.removeProgress = undefined
        this.killAll = undefined
    }

    static builder() {
        return new Progress()
    }

    setRenderProgress(value) {
        this.renderProgress = value
        return this
    }

    setProgress2Active(value) {
        this.progress2Active = value
        return this
    }

    setRemoveProgress(value) {
        this.removeProgress = value
        return this
    }

    setKillAll(value) {
        this.killAll = value
        return this
    }

}
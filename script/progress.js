export class Progress {
    constructor() {
        this.renderProgress = null
        this.progress2Active = []
        this.progress2Deactive = []
        this.killAll = null
        this.onExamineProgress2Active = []
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

    setProgress2Deactive(value) {
        this.progress2Deactive = value
        return this
    }

    setKillAll(value) {
        this.killAll = value
        return this
    }

    setOnExamineProgress2Active(value) {
        this.onExamineProgress2Active = value
        return this
    }
}

export class Progress {

    static builder() {
        return new Progress()
    }

    setRenderProgress(value) {
        this.renderProgress = value
        return this
    }

    setRemoveProgress(value) {
        this.removeProgress = value
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

}
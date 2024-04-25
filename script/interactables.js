export class Interactable {
    constructor(name, popup, onInteract) {
        this.name = name
        this.popup = popup
        this.onInteract = onInteract
    }
}

export class Drop extends Interactable {
    constructor(name, popup, onInteract, ammount) {
        super(name, popup, onInteract)
        this.ammount = ammount
    }
}
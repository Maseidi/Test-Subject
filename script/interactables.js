export class Interactable {
    constructor(width, left, top, name, heading, popup, solid, amount, space, description) {
        this.width = width
        this.left = left
        this.top = top
        this.name = name
        this.heading = heading
        this.popup = popup
        this.solid = solid
        this.amount = amount
        this.space = space
        this.description = description
    }
}

export class PC extends Interactable {
    constructor(left, top) {
        super(50, left, top, "computer", "computer", "Save game", true, undefined, undefined, undefined)
    }
}

export class Stash extends Interactable {
    constructor(left, top) {
        super(80, left, top, "stash", "stash", "Open stash", true, undefined, undefined, undefined)
    }
}

export class VendingMachine extends Interactable {
    constructor(left, top) {
        super(35, left, top, "vendingMachine", "vending machine", "Trade", true, undefined, undefined, undefined)
    }
}
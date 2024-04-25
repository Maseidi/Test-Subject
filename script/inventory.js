class Inventory {
    constructor(items) {
        this.items = items
    }
}

class InventoryLvl1 extends Inventory {
    constructor() {
        super([
            ["", "", "", ""],
            ["", "", "", ""]
        ])
    }
}

class InventoryLvl2 extends Inventory {
    constructor() {
        super([
            ["", "", "", ""],
            ["", "", "", ""],
            ["", ""]
        ])
    }
}

class InventoryLvl3 extends Inventory {
    constructor() {
        super([
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""]
        ])
    }
}

class InventoryLvl4 extends Inventory {
    constructor() {
        super([
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", ""],
        ])
    }
}

class InventoryLvl5 extends Inventory {
    constructor() {
        super([
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""]
        ])
    }
}

let inventory = new InventoryLvl1()
export const setInventory = (val) => {
    inventory = val
}
export const getInventory = () => {
    return inventory
}
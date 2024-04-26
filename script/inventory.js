import { getIntObj } from "./variables.js"

const MAX_PACKSIZE = {
    bandage: 2,
    coin: 5,
    hardDrive: 1,
    smgAmmo: 100,
    pistolAmmo: 40,
    shotgunShells: 30,
    rifleAmmo: 20,
    magnumAmmo: 10
}

class Item {
    constructor(name, amount, space) {
        this.name = name
        this.amount = amount
        this.space = space
    }
}

let inventory = [
    [new Item("coin", 4, 1), null, null, null],
    [null, null, null, null],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined]
]

export const pickupDrop = () => {
    const dropName = getIntObj().getAttribute("name")
    const dropAmount = getIntObj().getAttribute("amount")
    const dropSpace = getIntObj().getAttribute("space")
    searchPack(dropName, dropAmount, dropSpace)
}

const searchPack = (dropName, dropAmount) => {
    for (let i = 0; i < inventory.length; i++) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            const item = inventory[i][j]
            if ( item?.name === dropName ) {
                if ( item?.amount !== MAX_PACKSIZE[dropName] ) {
                    let diff = Math.min(MAX_PACKSIZE[dropName], MAX_PACKSIZE[dropName] + dropAmount) - item?.amount
                    item.amount += diff
                    getIntObj().setAttribute("amount", dropAmount - diff)
                }
            }
        }
    }
}
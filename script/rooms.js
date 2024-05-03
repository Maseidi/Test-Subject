import { walls } from "./walls.js"
import { loaders } from "./loaders.js"
import { interactables } from "./interactables.js"

class Room {
    constructor(width, height) {
        this.width = width
        this.height = height
    }

    setId(id) {
        this.id = id
        this.walls = walls.get(id)
        this.loaders = loaders.get(id)
        this.interactables = interactables.get(id)
    }

}

export const getRoom = (id) => {
    const room = rooms.get(id)
    room.setId(id)
    return room
}

const rooms = new Map([
    [1, new Room(1100, 1100)],
    [2, new Room(1000, 1000)],
    [3, new Room(1000, 1000)],
    [4, new Room(100, 1000)],
    [5, new Room(1000, 1000)],
    [6, new Room(2000, 100)],
    [7, new Room(1000, 1000)],
    [8, new Room(1500, 1500)],
    [9, new Room(1000, 500)],
    [15, new Room(500, 2000)],
    [16, new Room(1200, 900)],
    [18, new Room(1100, 400)],
    [19, new Room(1100, 400)],
    [20, new Room(1100, 400)],
    [21, new Room(500, 500)],
    [22, new Room(100, 1000)],
    [23, new Room(500, 500)],
    [24, new Room(600, 1500)],
    [25, new Room(1000, 1000)],
    [26, new Room(300, 500)],
    [27, new Room(2000, 500)],
    [28, new Room(1000, 1000)],
    [29, new Room(1000, 200)],
    [30, new Room(1250, 400)],
    [31, new Room(2500, 625)],
    [32, new Room(750, 1500)],
    [33, new Room(1200, 600)],
    [34, new Room(700, 700)],
    [35, new Room(1500, 1500)],
    [36, new Room(2000, 700)],
    [37, new Room(1600, 800)],
    [38, new Room(1000, 5000)],
    [39, new Room(1400, 400)],
    [40, new Room(1000, 2000)],
    [41, new Room(1000, 700)],
    [42, new Room(1000, 700)],
    [43, new Room(1000, 700)],
    [44, new Room(1000, 700)],
    [45, new Room(1200, 1200)],
    [46, new Room(150, 1000)],
    [47, new Room(150, 1500)],
    [48, new Room(150, 2000)],
    [49, new Room(1000, 1000)],
    [50, new Room(1000, 1000)],
    [51, new Room(1000, 1000)],
    [52, new Room(150, 1000)],
    [53, new Room(150, 1500)],
    [54, new Room(150, 2000)],
    [55, new Room(1000, 1000)],
    [56, new Room(1000, 1000)],
    [57, new Room(1000, 1000)],
    [58, new Room(800, 800)],
    [59, new Room(800, 800)],
    [60, new Room(700, 1400)],
    [61, new Room(700, 1400)],
    [62, new Room(1500, 600)],
    [63, new Room(1000, 1000)],
    [64, new Room(1500, 600)],
    [65, new Room(1000, 1000)],
    [71, new Room(1200, 1200)],
    [72, new Room(1200, 1200)],
])
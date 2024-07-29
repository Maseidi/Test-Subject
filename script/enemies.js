import { Tracker } from './tracker.js'
import { SinglePointPath, SquarePath } from './path.js'
import { RockCrusher, SoulDrinker, Torturer } from './normal-enemy.js'
import { Ranger } from './ranger.js'

// class Spiker extends Enemy {
//     constructor(level, path, progress) {
//         const health = Math.floor(level * 25 + Math.random() * 5)
//         const damage = Math.floor(level * 15 + Math.random() * 5)
//         const maxSpeed = 6 + Math.random()
//         super(SPIKER, 6, path, health, damage, 75, maxSpeed, progress, 400, maxSpeed)
//     }
// }

// class Grabber extends Enemy {
//     constructor(level, path, progress) {
//         const health = Math.floor(level * 100 + Math.random() * 50)
//         const damage = Math.floor(level * 20 + Math.random() * 10)
//         const maxSpeed = 3 + Math.random()
//         super(GRABBER, 4, path, health, damage, 100, maxSpeed, progress, 400, 1.4)
//     }
// }

// class Scorcher extends Enemy {
//     constructor(level, path, progress) {
//         const health = Math.floor(level * 135 + Math.random() * 15)
//         const damage = Math.floor(level * 15 + Math.random() * 10)
//         const maxSpeed = 2.5 + Math.random()
//         super(SCORCHER, 5, path, health, damage, 100, maxSpeed, progress, 600, 1.1)
//     }
// }

export const enemies = new Map([
    [37, [
        // new Torturer(1, new SquarePath(650, 240, 300), '1'),
        // new Torturer(1, new VerDoublePointPath(800, 100, 300), '2'),
        // new Torturer(1, new SquarePath(650, 240, 300), '3'),
        // new SoulDrinker(1, new SinglePointPath(650, 140), '3'),
        // new RockCrusher(1, new SinglePointPath(850, 140), '3'),
        // new Tracker(1, 1000, 140, '3'),
        // new Tracker(1, 1000, 240, '3'),
        // new Tracker(1, 1000, 340, '3'),
        new Ranger(1, new SquarePath(1000, 100, 300), '3'),
        // new Ranger(1, new SquarePath(1100, 100, 300), '3'),
        // new Ranger(1, new SquarePath(1200, 100, 300), '3'),
        // new Spiker(1, new SquarePath(600, 600, 100), '3'),
        // new Spiker(1, new SquarePath(700, 600, 100), '3'),
        // new Spiker(1, new SquarePath(800, 600, 100), '3'),
        // new Grabber(1, new VerDoublePointPath(1400, 100, 600), '3'),
        // new Scorcher(1, new HorDoublePointPath(1000, 700, 600), '3')
    ]]
])
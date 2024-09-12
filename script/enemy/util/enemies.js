import { Progress } from '../../progress.js'
import { SinglePointPath } from '../../path.js'
import { Torturer } from '../type/normal-enemy.js'
import { BANDAGE_LOOT, SingleLoot } from '../../loot.js'

export const enemies = new Map([
    [1, []],
    [2, []],
    [9, []],
    [16, [
        new Torturer(
            1,
            new SinglePointPath(100, 100),
            null,
        )
    ]],
    [37, []]
])
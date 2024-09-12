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
        ),
        new Torturer(
            1,
            new SinglePointPath(300, 100),
            null,
            Progress.builder().setRenderProgress('1')
        ),
        new Torturer(
            1,
            new SinglePointPath(500, 100),
            null,
            Progress.builder().setRenderProgress('2')
        ),
        new Torturer(
            1,
            new SinglePointPath(700, 100),
            null,
            Progress.builder().setRenderProgress('3').setProgress2Active('4')
        ),
        new Torturer(
            1,
            new SinglePointPath(600, 400),
            null,
            Progress.builder().setKillAll('2')
        ),
        new Torturer(
            1,
            new SinglePointPath(600, 500),
            null,
            Progress.builder().setRenderProgress('4')
        ),
        new Torturer(
            1,
            new SinglePointPath(600, 700),
            null,
            Progress.builder().setKillAll('4')
        )
    ]],
    [37, []]
])
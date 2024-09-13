import { Ranger } from '../type/ranger.js'
import { Progress } from '../../progress.js'
import { Grabber } from '../type/grabber.js'
import { SinglePointPath } from '../../path.js'
import { Torturer } from '../type/normal-enemy.js'

export const enemies = new Map([
    [1, []],
    [2, []],
    [9, []],
    [16, [
        new Grabber(
            1,
            new SinglePointPath(100, 100),
            null,
            Progress.builder().setProgress2Active('1')
        ),
        new Ranger(
            1,
            new SinglePointPath(300, 100),
            null,
            Progress.builder().setRenderProgress('1').setProgress2Active('2')
        ),
        new Torturer(
            1,
            new SinglePointPath(500, 100),
            null,
            Progress.builder().setRenderProgress('2').setProgress2Active('3')
        ),
        new Torturer(
            1,
            new SinglePointPath(700, 100),
            null,
            Progress.builder().setRenderProgress('3').setProgress2Active('4')
        ),
        new Torturer(
            1,
            new SinglePointPath(100, 300),
            null,
            Progress.builder().setRenderProgress('4').setProgress2Active('5')
        ),
    ]],
    [37, []]
])
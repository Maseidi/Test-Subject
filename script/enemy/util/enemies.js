import { Ranger } from '../type/ranger.js'
import { Progress } from '../../progress.js'
import { Grabber } from '../type/grabber.js'
import { Stinger } from '../type/stinger.js'
import { SinglePointPath } from '../../path.js'
import { Torturer } from '../type/normal-enemy.js'
import { Loot, NoteLoot, RANDOM } from '../../loot.js'

export const enemies = new Map([
    [1, []],
    [2, []],
    [9, []],
    [16, [
        // new Stinger(
        //     1,
        //     new SinglePointPath(100, 100),
        //     new NoteLoot('test heading', 'test description', 'Main hall code PLACE_CODE_HERE', 'main-hall'),
        //     Progress.builder().setProgress2Active('1')
        // ),
        // new Ranger(
        //     1,
        //     new SinglePointPath(300, 100),
        //     new Loot(RANDOM, 2),
        //     Progress.builder().setRenderProgress('1').setProgress2Active('2')
        // ),
        // new Torturer(
        //     1,
        //     new SinglePointPath(500, 100),
        //     new Loot(RANDOM, 2),
        //     Progress.builder().setRenderProgress('2').setProgress2Active('3')
        // ),
        // new Torturer(
        //     1,
        //     new SinglePointPath(700, 100),
        //     new Loot(RANDOM, 2),
        //     Progress.builder().setRenderProgress('3').setProgress2Active('4')
        // ),
        // new Torturer(
        //     1,
        //     new SinglePointPath(100, 300),
        //     new Loot(RANDOM, 2),
        //     Progress.builder().setRenderProgress('4').setProgress2Active('5')
        // ),
        // new Torturer(
        //     1,
        //     new SinglePointPath(200, 300),
        //     new Loot(RANDOM, 2),
        //     Progress.builder().setRenderProgress('6')
        // ),
    ]],
    [37, []]
])
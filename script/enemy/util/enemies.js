import { BANDAGE_LOOT, Loot, PISTOL4, SingleLoot, SMG_AMMO_LOOT } from '../../loot.js'
import { SinglePointPath } from '../../path.js'
import { Progress } from '../../progress.js'
import { Torturer } from '../type/normal-enemy.js' 

export const enemies = new Map([
    [1, []],
    [2, []],
    [9, []],
    [16, [
        new Torturer(
            1, 
            new SinglePointPath(100, 100), 
            new SingleLoot(BANDAGE_LOOT), 
            Progress.builder().setProgress2Active('1'), 
            'red'
        ),
        new Torturer(
            1,
            new SinglePointPath(200, 100),
            new Loot(SMG_AMMO_LOOT, 30),
            Progress.builder().setRenderProgress('1').setProgress2Active('2').setProgress2Deactive('100'),
            'green'
        ),
        new Torturer(
            1,
            new SinglePointPath(300, 100),
            new Loot(PISTOL4),
            Progress.builder().setRenderProgress('4')
        ),
        new Torturer(
            1,
            new SinglePointPath(400, 100),
            null,
            Progress.builder().setRenderProgress('6')
        ),
    ]],
    [37, []]
])
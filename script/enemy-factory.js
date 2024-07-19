import { NormalEnemy } from './normal-enemy.js'
import { RangerEnemy } from './ranger-enemy.js'
import { SpikerEnemy } from './spiker-enemy.js'
import { IRON_MASTER, RANGER, ROCK_CRUSHER, SOUL_DRINKER, SPIKER, TORTURER } from './enemy-constants.js'

export const createEnemy = (elem) => {
    const type = elem.getAttribute('type')
    if ( type === TORTURER ) return new NormalEnemy(elem)
    else if ( type === SOUL_DRINKER ) return new NormalEnemy(elem)   
    else if ( type === ROCK_CRUSHER ) return new NormalEnemy(elem)   
    else if ( type === IRON_MASTER ) return new NormalEnemy(elem)   
    else if ( type === RANGER ) return new RangerEnemy(elem)
    else if ( type === SPIKER ) return new SpikerEnemy(elem)
}
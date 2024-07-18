import { NormalEnemy } from "./normal-enemy.js"

export const createEnemy = (elem) => {
    const type = elem.getAttribute('type')
    if ( type === 'torturer' || 
         type === 'soul-drinker' || 
         type === 'rock-crusher' || 
         type === 'iron-master' ) return new NormalEnemy(elem)
    else if ( type === 'ranger' ) return new NormalEnemy(elem)
    else if ( type === 'spiker' ) return new NormalEnemy(elem)
}
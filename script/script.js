import { play } from './game.js'
import { difficulties } from './util.js'
import { renderMainMenu } from './main-menu.js'
import { prepareNewGameData } from './data-manager.js'

for ( let i = 0; i < 10; i++ )
    if ( !localStorage.getItem('slot-' + ( i + 1 )) ) 
        localStorage.setItem('slot-' + ( i + 1), 'empty')

renderMainMenu()
// prepareNewGameData(difficulties.SURVIVAL)
// play()
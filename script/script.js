import { prepareNewGameData } from './data-manager.js';
import { play } from './game.js';
import { renderMainMenu } from './main-menu.js';

for ( let i = 0; i < 10; i++ )
    if ( !localStorage.getItem('slot-' + ( i + 1 )) ) 
        localStorage.setItem('slot-' + ( i + 1), 'empty')

// renderMainMenu()
prepareNewGameData()
play()
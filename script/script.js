import { play } from './game.js'
import { difficulties } from './util.js'
import { renderMainMenu } from './main-menu.js'
import { loadGameFromSlot, prepareNewGameData } from './data-manager.js'
import { renderMapMaker } from './mapMaker/map-maker.js'

for ( let i = 0; i < 10; i++ )
    if ( !localStorage.getItem(`slot-${i+1}`) ) 
        localStorage.setItem(`slot-${i+1}`, 'empty')

// renderMainMenu()
// prepareNewGameData(difficulties.MIDDLE)
// loadGameFromSlot(1)
// play()
renderMapMaker()
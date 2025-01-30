import { renderMainMenu } from './main-menu.js'

for (let i = 0; i < 10; i++) if (!localStorage.getItem(`slot-${i + 1}`)) localStorage.setItem(`slot-${i + 1}`, 'empty')

for (let i = 0; i < 5; i++)
    if (!localStorage.getItem(`map-slot-${i + 1}`)) localStorage.setItem(`map-slot-${i + 1}`, 'empty')

for (let i = 0; i < 10; i++)
    if (!localStorage.getItem(`survival-slot-${i + 1}`)) localStorage.setItem(`survival-slot-${i + 1}`, 'empty')

export const IS_MOBILE =
    navigator.userAgent.toLowerCase().includes('android') || navigator.userAgent.toLowerCase().includes('iphone')

export const ENEMY_CAP = IS_MOBILE ? 20 : 40
export const FRAME_RATE = IS_MOBILE ? 30 : 60
export const SPAWN_INTERVAL = IS_MOBILE ? 1.5 * FRAME_RATE : FRAME_RATE

window.addEventListener('contextmenu', e => e.preventDefault())
renderMainMenu()

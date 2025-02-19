import { renderMainMenu } from './main-menu.js'
import { getDefaultSettings, setSettings } from './settings.js'

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./script/sw.js')
}

Array.from(document.querySelectorAll('audio')).forEach(elem => (elem.volume = 0))

for (let i = 0; i < 10; i++) if (!localStorage.getItem(`slot-${i + 1}`)) localStorage.setItem(`slot-${i + 1}`, 'empty')

for (let i = 0; i < 5; i++)
    if (!localStorage.getItem(`map-slot-${i + 1}`)) localStorage.setItem(`map-slot-${i + 1}`, 'empty')

for (let i = 0; i < 10; i++)
    if (!localStorage.getItem(`survival-slot-${i + 1}`)) localStorage.setItem(`survival-slot-${i + 1}`, 'empty')

export const IS_MOBILE =
    navigator.userAgent.toLowerCase().includes('android') || navigator.userAgent.toLowerCase().includes('iphone')

if (localStorage.getItem('settings')) setSettings(JSON.parse(localStorage.getItem('settings')))
else setSettings(getDefaultSettings())

export const ENEMY_CAP = IS_MOBILE ? 20 : 40

navigator.keyboard.lock(['Escape'])
window.addEventListener('contextmenu', e => e.preventDefault())
document.querySelector('body').addEventListener('click', e => {
    e.currentTarget.requestFullscreen()
})
renderMainMenu()

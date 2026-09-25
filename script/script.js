import { getDefaultSettings, setSettings } from './settings.js'
import { renderMainMenu } from './main-menu.js'

if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('sw.js')
}

for (let i = 0; i < 10; i++) {
    if (!localStorage.getItem(`slot-${i + 1}`)) localStorage.setItem(`slot-${i + 1}`, 'empty')
}

for (let i = 0; i < 5; i++)
    if (!localStorage.getItem(`map-slot-${i + 1}`)) localStorage.setItem(`map-slot-${i + 1}`, 'empty')

for (let i = 0; i < 10; i++)
    if (!localStorage.getItem(`survival-slot-${i + 1}`)) localStorage.setItem(`survival-slot-${i + 1}`, 'empty')

export const IS_MOBILE =
    navigator.userAgent.toLowerCase().includes('android') || navigator.userAgent.toLowerCase().includes('iphone')

if (localStorage.getItem('settings')) setSettings(JSON.parse(localStorage.getItem('settings')))
else setSettings(getDefaultSettings())

export const ENEMY_CAP = IS_MOBILE ? 20 : 40

window.addEventListener('contextmenu', e => e.preventDefault())

history.pushState({}, '')
let fullscreenRequestPending = false
const enterFullscreenOnInteraction = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement || fullscreenRequestPending) return

    const page = document.documentElement
    const requestFullscreen = page.requestFullscreen || page.webkitRequestFullscreen
    if (!requestFullscreen) return

    try {
        fullscreenRequestPending = true
        Promise.resolve(requestFullscreen.call(page))
            .catch(() => {})
            .finally(() => {
                fullscreenRequestPending = false
            })
    } catch (_) {
        fullscreenRequestPending = false
    }
}
window.addEventListener('click', enterFullscreenOnInteraction, true)
window.addEventListener('touchend', enterFullscreenOnInteraction, true)
window.addEventListener('popstate', () => history.pushState({}, ''))
renderMainMenu()
navigator.keyboard?.lock?.(['Escape'])?.catch?.(() => {})

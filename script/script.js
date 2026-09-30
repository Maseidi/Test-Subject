import { getDefaultSettings, setSettings } from './settings.js'
import { renderMainMenu } from './main-menu.js'
export { IS_MOBILE } from './platform.js'

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {})

// Remove save-slot data from versions that predate the single autosave campaign.
for (const key of Object.keys(localStorage)) {
    if (key.startsWith('slot-') || key.includes('-slot-') || key === 'last-slot-used' || key.endsWith('-tutorial-done'))
        localStorage.removeItem(key)
}

if (localStorage.getItem('settings')) setSettings(JSON.parse(localStorage.getItem('settings')))
else setSettings(getDefaultSettings())

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

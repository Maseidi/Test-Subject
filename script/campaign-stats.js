import { getIsMapMakerRoot, getIsSurvival, getPlaythroughId } from './variables.js'

const key = id => `campaign-statistics-${id}`
const read = id => {
    try { return JSON.parse(localStorage.getItem(key(id))) || { saves: 0, deaths: 0, damaged: 0, elapsedMs: 0 } }
    catch { return { saves: 0, deaths: 0, damaged: 0, elapsedMs: 0 } }
}
let timerId = null
let lastTick = 0
let elapsedMs = 0
let lastPersisted = 0
const activeCampaign = () => !getIsSurvival() && !getIsMapMakerRoot() && Boolean(getPlaythroughId())
const save = stats => localStorage.setItem(key(getPlaythroughId()), JSON.stringify(stats))

export const resetCampaignStatistics = id => {
    localStorage.setItem(key(id), JSON.stringify({ saves: 0, deaths: 0, damaged: 0, elapsedMs: 0 }))
    timerId = null
}
const record = field => {
    if (!activeCampaign()) return
    const stats = read(getPlaythroughId())
    stats[field] = (stats[field] || 0) + 1
    if (timerId === getPlaythroughId()) stats.elapsedMs = Math.max(stats.elapsedMs, elapsedMs)
    save(stats)
}
export const recordCampaignSave = () => record('saves')
export const recordCampaignDeath = () => record('deaths')
export const recordCampaignDamage = () => record('damaged')

export const tickCampaignTime = paused => {
    if (!activeCampaign()) return
    const id = getPlaythroughId(), now = performance.now()
    if (timerId !== id) {
        timerId = id
        elapsedMs = read(id).elapsedMs || 0
        lastPersisted = elapsedMs
        lastTick = now
        return
    }
    const delta = Math.min(250, now - lastTick)
    lastTick = now
    if (paused) return
    elapsedMs += delta
    if (elapsedMs - lastPersisted >= 1000) {
        const stats = read(id)
        stats.elapsedMs = elapsedMs
        save(stats)
        lastPersisted = elapsedMs
    }
}

export const getCampaignStatistics = () => {
    const id = getPlaythroughId(), stats = read(id)
    const ms = timerId === id ? Math.max(elapsedMs, stats.elapsedMs) : stats.elapsedMs
    const secondsTotal = Math.floor(ms / 1000)
    const hours = String(Math.floor(secondsTotal / 3600)).padStart(2, '0')
    const minutes = String(Math.floor(secondsTotal % 3600 / 60)).padStart(2, '0')
    const seconds = String(secondsTotal % 60).padStart(2, '0')
    return { time: `${hours}:${minutes}:${seconds}`, saves: stats.saves, deaths: stats.deaths, damaged: stats.damaged }
}

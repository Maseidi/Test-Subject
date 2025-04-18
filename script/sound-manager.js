import { getGunDetails, getGunUpgradableDetail, isGun } from './gun-details.js'
import { IS_MOBILE } from './script.js'
import { getSettings } from './settings.js'
import { getChaos } from './survival/variables.js'
import { isThrowable } from './throwable-details.js'

class CacheError extends Error {
    constructor(options) {
        super('Audio not in cache', options)
    }
}

const getCachedAudio = async (audioUrl, dbName = 'audioCache', storeName = 'audioFiles') => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName)

        request.onsuccess = event => {
            const db = event.target.result
            const transaction = db.transaction(storeName, 'readonly')
            const store = transaction.objectStore(storeName)
            const getRequest = store.get(audioUrl)

            getRequest.onsuccess = event => {
                const audioBlob = event.target.result
                if (!audioBlob) {
                    reject(new CacheError())
                    return
                }

                const audioObjectUrl = URL.createObjectURL(audioBlob)

                const audio = new Audio(audioObjectUrl)

                audio.onloadeddata = () => {
                    URL.revokeObjectURL(audioObjectUrl)
                }

                resolve(audio)
            }

            getRequest.onerror = event => reject(event.target.error)
        }

        request.onerror = event => reject(event.target.error)
    })
}

const cacheAudioFile = async (audioUrl, dbName = 'audioCache', storeName = 'audioFiles') => {
    try {
        await getCachedAudio(audioUrl)
    } catch (error) {
        // if the audio is in cache, no need to fetch again
        if (!(error instanceof CacheError)) return
    }

    const response = await fetch(audioUrl)
    const audioBlob = await response.blob()

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1)

        request.onupgradeneeded = event => {
            const db = event.target.result
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName)
            }
        }

        request.onsuccess = event => {
            const db = event.target.result
            const transaction = db.transaction(storeName, 'readwrite')
            const store = transaction.objectStore(storeName)

            const putRequest = store.put(audioBlob, audioUrl)

            putRequest.onsuccess = () => resolve()
            putRequest.onerror = e => reject(e)
        }

        request.onerror = event => reject(event.target.error)
    })
}

export const cacheAllAudioFiles = async () => {
    await cacheAudioFile('./assets/audio/footstep.mp3')
    await cacheAudioFile('./assets/audio/empty-weapon.mp3')
    await cacheAudioFile('./assets/audio/explosion.mp3')
    await cacheAudioFile('./assets/audio/break-crate.mp3')
    await cacheAudioFile('./assets/audio/flashbang.mp3')
    await cacheAudioFile('./assets/audio/pickup/coin-pickup.mp3')
    await cacheAudioFile('./assets/audio/pickup/ammo-pickup.mp3')
    await cacheAudioFile('./assets/audio/pickup/gun-pickup.mp3')
    await cacheAudioFile('./assets/audio/pickup/pickup.mp3')
    await cacheAudioFile('./assets/audio/ui/trade.mp3')
    await cacheAudioFile('./assets/audio/ui/upgrade.mp3')
    await cacheAudioFile('./assets/audio/ui/hover.mp3')
    await cacheAudioFile('./assets/audio/ui/click.mp3')
    await cacheAudioFile('./assets/audio/ui/serenity.mp3')
    await cacheAudioFile('./assets/audio/ui/save.mp3')
    await cacheAudioFile('./assets/audio/ui/stash.mp3')
    for (let i = 0; i < 5; i++) await cacheAudioFile(`./assets/audio/action/action-${i + 1}.mp3`)
    for (const weaponName of getGunDetails().keys()) {
        await cacheAudioFile(`./assets/audio/weapon/shoot/${weaponName}.mp3`)
        await cacheAudioFile(`./assets/audio/weapon/reload/${weaponName}.mp3`)
        await cacheAudioFile(`./assets/audio/weapon/equip/${weaponName}.mp3`)
    }
}

const addMusicEndEvent = (music, list) => {
    music.addEventListener('ended', () => {
        const newMusic = list.sort(() => Math.random() - 0.5)[0]
        newMusic.currentTime = 0
        setPlayingMusic(newMusic)
        playMusic(newMusic)
    })
}

export let sfx = {}

export const retrieveAllAudioFromCache = async () => {
    sfx.footstep = await getCachedAudio('./assets/audio/footstep.mp3')
    sfx.emptyWeapon = await getCachedAudio('./assets/audio/empty-weapon.mp3')
    sfx.explosion = await getCachedAudio('./assets/audio/explosion.mp3')
    sfx.breakCrate = await getCachedAudio('./assets/audio/break-crate.mp3')
    sfx.flashbang = await getCachedAudio('./assets/audio/flashbang.mp3')
    sfx.coinPickup = await getCachedAudio('./assets/audio/pickup/coin-pickup.mp3')
    sfx.ammoPickup = await getCachedAudio('./assets/audio/pickup/ammo-pickup.mp3')
    sfx.gunPickup = await getCachedAudio('./assets/audio/pickup/gun-pickup.mp3')
    sfx.pickup = await getCachedAudio('./assets/audio/pickup/pickup.mp3')
    sfx.trade = await getCachedAudio('./assets/audio/ui/trade.mp3')
    sfx.upgrade = await getCachedAudio('./assets/audio/ui/upgrade.mp3')
    sfx.hover = await getCachedAudio('./assets/audio/ui/hover.mp3')
    sfx.click = await getCachedAudio('./assets/audio/ui/click.mp3')

    sfx.peace = await Promise.all([
        getCachedAudio('./assets/audio/ui/serenity.mp3'),
        getCachedAudio('./assets/audio/ui/save.mp3'),
        getCachedAudio('./assets/audio/ui/stash.mp3'),
    ]).then(values =>
        values.map(item => {
            addMusicEndEvent(item, values)
            return item
        }),
    )

    sfx.action = await Promise.all(
        new Array(5).fill(null).map((item, index) => getCachedAudio(`./assets/audio/action/action-${index + 1}.mp3`)),
    ).then(values =>
        values.map(item => {
            addMusicEndEvent(item, values)
            return item
        }),
    )

    let weaponSoundEffects = []
    for (const weaponName of getGunDetails().keys()) {
        weaponSoundEffects.push({
            weaponName,
            shoot: await getCachedAudio(`./assets/audio/weapon/shoot/${weaponName}.mp3`),
            reload: await getCachedAudio(`./assets/audio/weapon/reload/${weaponName}.mp3`),
            equip: await getCachedAudio(`./assets/audio/weapon/equip/${weaponName}.mp3`),
        })
    }
    sfx.weapons = weaponSoundEffects
}

let playingSoudEffects = []
export const setPlayingSoundEffects = val => {
    playingSoudEffects = val
}
export const getPlayingSoundEffects = () => playingSoudEffects

let playingEquipSoundEffect = null
export const setPlayingEquipSoundEffect = val => {
    playingEquipSoundEffect = val
}
export const getPlayingEquipSoundEffect = () => playingEquipSoundEffect

let playingMusic = null
export const setPlayingMusic = val => {
    playingMusic = val
}
export const getPlayingMusic = () => playingMusic

const playSound = sound => {
    const clone = sound.cloneNode()
    clone.volume = getSettings().audio.sound
    clone.play()
    playingSoudEffects.push(clone)
    clone.addEventListener('ended', () => {
        playingSoudEffects = playingSoudEffects.filter(effect => effect !== clone)
    })
}

export const playFootstep = () => playSound(sfx.footstep)

export const playEmptyWeapon = () => playSound(sfx.emptyWeapon)

export const playGunShot = name => playSound(sfx.weapons.find(item => item.weaponName === name).shoot)

export const playReload = equipped => {
    const reloadSpeed = getGunUpgradableDetail(equipped.name, 'reloadspeed', equipped.reloadspeedlvl)
    const reload = sfx.weapons.find(item => item.weaponName === equipped.name).reload
    reload.preload = 'metadata'
    reload.onloadedmetadata = () => {
        const scaledRate = reload.duration / reloadSpeed
        reload.playbackRate = scaledRate < 0.5 ? reload.duration : scaledRate
    }
    playSound(reload)
}

export const playEquip = name => {
    if (isThrowable(name)) return
    if (getPlayingEquipSoundEffect()) {
        getPlayingEquipSoundEffect().pause()
        setPlayingSoundEffects(getPlayingSoundEffects().filter(effect => effect !== getPlayingEquipSoundEffect()))
    }
    const equip = sfx.weapons.find(item => item.weaponName === name).equip
    setPlayingEquipSoundEffect(equip)
    playSound(equip)
}

export const playExplosion = () => playSound(sfx.explosion)

export const playFlashbang = () => {
    sfx.flashbang.currentTime = 1.5
    playSound(sfx.flashbang)
}

export const playBreakCrate = () => playSound(sfx.breakCrate)

export const playPickup = name => {
    if (name === 'coin') var pickup = sfx.coinPickup
    else if (isGun(name)) var pickup = sfx.gunPickup
    else if (name.toLowerCase().includes('ammo') || name.toLowerCase() === 'shotgunshells') var pickup = sfx.ammoPickup
    else var pickup = sfx.pickup
    playSound(pickup)
}

export const playTrade = () => {
    const trade = sfx.trade
    trade.volume = getSettings().audio.sound
    trade.play()
}

export const playUpgrade = () => {
    const upgrade = sfx.upgrade
    upgrade.volume = getSettings().audio.sound
    upgrade.play()
}

export const addHoverSoundEffect = element => {
    if (IS_MOBILE) return
    element.addEventListener('mouseenter', () => {
        const hover = sfx.hover
        hover.volume = getSettings().audio.ui
        hover.pause()
        hover.currentTime = 0
        hover.play()
    })
}

export const playClickSoundEffect = () => {
    const click = sfx.click
    click.volume = getSettings().audio.ui
    click.pause()
    click.currentTime = 0
    click.play()
}

export const playPeaceMusic = () => {
    if (getChaos() === 0) return
    const music = sfx.peace.sort(() => Math.random() - 0.5)[0]
    music.currentTime = 0
    setPlayingMusic(music)
    playMusic(music)
}

export const playActionMusic = () => {
    const music = sfx.action.sort(() => Math.random() - 0.5)[0]
    music.currentTime = 0
    setPlayingMusic(music)
    playMusic(music)
}

const playMusic = music => {
    music.volume = getSettings().audio.music
    music.play()
}

export const isPeaceMusicPlaying = () => sfx.peace.includes(playingMusic)

export const isActionMusicPlaying = () => sfx.action.includes(playingMusic)

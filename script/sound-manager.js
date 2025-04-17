import { getGunDetails, getGunUpgradableDetail, isGun } from './gun-details.js'
import { IS_MOBILE } from './script.js'
import { getSettings } from './settings.js'
import { getChaos } from './survival/variables.js'
import { isThrowable } from './throwable-details.js'

export const cacheAllAudio = () => {
    cacheAudioFile('./assets/audio/footstep.mp3')
    cacheAudioFile('./assets/audio/empty-weapon.mp3')
    cacheAudioFile('./assets/audio/explosion.mp3')
    cacheAudioFile('./assets/audio/break-crate.mp3')
    cacheAudioFile('./assets/audio/flashbang.mp3')
    cacheAudioFile('./assets/audio/pickup/coin-pickup.mp3')
    cacheAudioFile('./assets/audio/pickup/ammo-pickup.mp3')
    cacheAudioFile('./assets/audio/pickup/gun-pickup.mp3')
    cacheAudioFile('./assets/audio/pickup/pickup.mp3')
    cacheAudioFile('./assets/audio/ui/trade.mp3')
    cacheAudioFile('./assets/audio/ui/upgrade.mp3')
    cacheAudioFile('./assets/audio/ui/hover.mp3')
    cacheAudioFile('./assets/audio/ui/click.mp3')
    cacheAudioFile('./assets/audio/ui/serenity.mp3')
    cacheAudioFile('./assets/audio/ui/save.mp3')
    cacheAudioFile('./assets/audio/ui/stash.mp3')
    new Array(5).fill(null).map((item, index) => cacheAudioFile(`./assets/audio/action/action-${index + 1}.mp3`))
    cacheWeaponSoundEffects()
}

const cacheWeaponSoundEffects = () => {
    for (const weaponName of getGunDetails().keys()) {
        cacheAudioFile(`./assets/audio/weapon/shoot/${weaponName}.mp3`)
        cacheAudioFile(`./assets/audio/weapon/reload/${weaponName}.mp3`)
        cacheAudioFile(`./assets/audio/weapon/equip/${weaponName}.mp3`)
    }
}

async function cacheAudioFile(audioUrl, dbName = 'audioCache', storeName = 'audioFiles') {
    // Fetch the actual file data
    const response = await fetch(audioUrl)
    const audioBlob = await response.blob() // This gets the actual binary data

    // Open IndexedDB
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

            // Store the actual Blob (file data)
            const putRequest = store.put(audioBlob, audioUrl) // Using URL as key

            putRequest.onsuccess = () => resolve()
            putRequest.onerror = e => reject(e)
        }

        request.onerror = event => reject(event.target.error)
    })
}

const getWeaponSoundEffects = async () => {
    const result = []
    for (const weaponName of getGunDetails().keys()) {
        result.push({
            weaponName,
            shoot: await getCachedAudio(`./assets/audio/weapon/shoot/${weaponName}.mp3`),
            reload: await getCachedAudio(`./assets/audio/weapon/reload/${weaponName}.mp3`),
            equip: await getCachedAudio(`./assets/audio/weapon/equip/${weaponName}.mp3`),
        })
    }
    return result
}

let sfx

export const retrieveAllAudio = async () => {
    sfx = {
        footstep: await getCachedAudio('./assets/audio/footstep.mp3'),
        emptyWeapon: await getCachedAudio('./assets/audio/empty-weapon.mp3'),
        explosion: await getCachedAudio('./assets/audio/explosion.mp3'),
        breakCrate: await getCachedAudio('./assets/audio/break-crate.mp3'),
        flashbang: await getCachedAudio('./assets/audio/flashbang.mp3'),
        coinPickup: await getCachedAudio('./assets/audio/pickup/coin-pickup.mp3'),
        ammoPickup: await getCachedAudio('./assets/audio/pickup/ammo-pickup.mp3'),
        gunPickup: await getCachedAudio('./assets/audio/pickup/gun-pickup.mp3'),
        pickup: await getCachedAudio('./assets/audio/pickup/pickup.mp3'),
        trade: await getCachedAudio('./assets/audio/ui/trade.mp3'),
        upgrade: await getCachedAudio('./assets/audio/ui/upgrade.mp3'),
        hover: await getCachedAudio('./assets/audio/ui/hover.mp3'),
        click: await getCachedAudio('./assets/audio/ui/click.mp3'),
        peace: [
            await getCachedAudio('./assets/audio/ui/serenity.mp3'),
            await getCachedAudio('./assets/audio/ui/save.mp3'),
            await getCachedAudio('./assets/audio/ui/stash.mp3'),
        ],
        action: new Array(5)
            .fill(null)
            .map(async (item, index) => await getCachedAudio(`./assets/audio/action/action-${index + 1}.mp3`)),
        weapons: getWeaponSoundEffects(),
    }
    sfx.peace.forEach(music => addMusicEndEvent(music, sfx.peace))
    sfx.action.forEach(music => addMusicEndEvent(music, sfx.action))
}

async function getCachedAudio(audioUrl, dbName = 'audioCache', storeName = 'audioFiles') {
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
                    reject(new Error('Audio not in cache'))
                    return
                }

                // Create object URL from the Blob
                const audioObjectUrl = URL.createObjectURL(audioBlob)

                // Create Audio object
                const audio = new Audio(audioObjectUrl)

                // Clean up the object URL when the audio is loaded
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
    if (!sound.paused) {
        const clone = sound.cloneNode()
        clone.play()
        playingSoudEffects.push(clone)
        clone.addEventListener('ended', () => {
            playingSoudEffects = playingSoudEffects.filter(effect => effect !== clone)
        })
        return
    }
    sound.play()
    playingSoudEffects.push(sound)
    sound.addEventListener('ended', () => {
        playingSoudEffects = playingSoudEffects.filter(effect => effect !== sound)
    })
}

export const playFootstep = () => {
    sfx.footstep.volume = getSettings().audio.sound
    playSound(sfx.footstep)
}

export const playEmptyWeapon = () => playSound(sfx.emptyWeapon)

export const playGunShot = name => {
    const gunShot = sfx.weapons.find(item => item.weaponName === name).shoot
    gunShot.volume = getSettings().audio.sound
    playSound(gunShot)
}

export const playReload = equipped => {
    const reloadSpeed = getGunUpgradableDetail(equipped.name, 'reloadspeed', equipped.reloadspeedlvl)
    const reload = sfx.weapons.find(item => item.weaponName === equipped.name).reload
    reload.volume = getSettings().audio.sound
    reload.preload = 'metadata'
    reload.onloadedmetadata = () => {
        const scaledRate = reload.duration / reloadSpeed
        reload.playbackRate = scaledRate < 0.5 ? reload.duration : scaledRate
    }
    playSound(reload)
}

export const playEquip = name => {
    if (isThrowable(name)) return
    const equip = sfx.weapons.find(item => item.weaponName === name).equip
    setPlayingEquipSoundEffect(equip)
    equip.volume = getSettings().audio.sound
    playSound(equip)
}

export const playExplosion = () => {
    sfx.explosion.volume = getSettings().audio.sound
    playSound(sfx.explosion)
}

export const playFlashbang = () => {
    const flashbang = sfx.flashbang
    flashbang.currentTime = 1.5
    flashbang.volume = getSettings().audio.sound
    playSound(flashbang)
}

export const playBreakCrate = () => {
    const breakCrate = sfx.breakCrate
    breakCrate.volume = getSettings().audio.sound
    playSound(breakCrate)
}

export const playPickup = name => {
    if (name === 'coin') var pickup = sfx.coinPickup
    else if (isGun(name)) var pickup = sfx.gunPickup
    else if (name.toLowerCase().includes('ammo') || name.toLowerCase() === 'shotgunshells') var pickup = sfx.ammoPickup
    else var pickup = sfx.pickup
    pickup.volume = getSettings().audio.sound
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
        hover.play()
    })
}

export const playClickSoundEffect = () => {
    const click = sfx.click
    click.volume = getSettings().audio.ui
    click.play()
}

const addMusicEndEvent = (music, list) => {
    music.addEventListener('ended', () => {
        const newMusic = list.sort(() => Math.random() - 0.5)[0]
        newMusic.currentTime = 0
        setPlayingMusic(newMusic)
        playMusic(newMusic)
    })
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

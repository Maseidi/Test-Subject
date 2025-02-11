import { getGunUpgradableDetail, isGun } from './gun-details.js'
import { IS_MOBILE } from './script.js'
import { getSettings } from './settings.js'
import { isThrowable } from './throwable-details.js'

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
    sound.play()
    playingSoudEffects.push(sound)
    sound.addEventListener('ended', () => {
        playingSoudEffects = playingSoudEffects.filter(effect => effect !== sound)
    })
}

export const playFootstep = () => {
    const footstep = new Audio('../assets/audio/footstep.mp3')
    footstep.volume = getSettings().audio.sound
    playSound(footstep)
}

export const playEmptyWeapon = () => {
    const empty = new Audio('../assets/audio/empty-weapon.mp3')
    playSound(empty)
}

export const playGunShot = name => {
    const gunShot = new Audio(`../assets/audio/weapon/shoot/${name}.mp3`)
    gunShot.volume = getSettings().audio.sound
    playSound(gunShot)
}

export const playReload = equipped => {
    const reloadSpeed = getGunUpgradableDetail(equipped.name, 'reloadspeed', equipped.reloadspeedlvl)
    const gunShot = new Audio(`../assets/audio/weapon/reload/${equipped.name}.mp3`)
    gunShot.volume = getSettings().audio.sound
    gunShot.preload = 'metadata'
    gunShot.onloadedmetadata = () => {
        const scaledRate = gunShot.duration / reloadSpeed
        gunShot.playbackRate = scaledRate < 0.5 ? gunShot.duration : scaledRate
    }
    playSound(gunShot)
}

export const playEquip = name => {
    if (isThrowable(name)) return
    const gunShot = new Audio(`../assets/audio/weapon/equip/${name}.mp3`)
    setPlayingEquipSoundEffect(gunShot)
    gunShot.volume = getSettings().audio.sound
    playSound(gunShot)
}

export const playExplosion = () => {
    const explosion = new Audio('../assets/audio/explosion.mp3')
    explosion.volume = getSettings().audio.sound
    playSound(explosion)
}

export const playFlashbang = () => {
    const flashbang = new Audio('../assets/audio/flashbang.mp3')
    flashbang.currentTime = 1.5
    flashbang.volume = getSettings().audio.sound
    playSound(flashbang)
}

export const playBreakCrate = () => {
    const breakCrate = new Audio('../assets/audio/break-crate.mp3')
    breakCrate.volume = getSettings().audio.sound
    playSound(breakCrate)
}

export const playPickup = name => {
    if (name === 'coin') var pickup = new Audio('../assets/audio/pickup/coin-pickup.mp3')
    else if (isGun(name)) var pickup = new Audio('../assets/audio/pickup/gun-pickup.mp3')
    else if (name.toLowerCase().includes('ammo') || name.toLowerCase() === 'shotgunshells')
        var pickup = new Audio('../assets/audio/pickup/ammo-pickup.mp3')
    else var pickup = new Audio('../assets/audio/pickup/pickup.mp3')
    pickup.volume = getSettings().audio.sound
    playSound(pickup)
}

export const playTrade = () => {
    const trade = new Audio('../assets/audio/ui/trade.mp3')
    trade.volume = getSettings().audio.sound
    trade.play()
}

export const playUpgrade = () => {
    const upgrade = new Audio('../assets/audio/ui/upgrade.mp3')
    upgrade.volume = getSettings().audio.sound
    upgrade.play()
}

export const addHoverSoundEffect = element => {
    if (IS_MOBILE) return
    element.addEventListener('mouseenter', () => {
        const hover = new Audio('../assets/audio/ui/hover.mp3')
        hover.volume = getSettings().audio.ui
        hover.play()
    })
}

export const playClickSoundEffect = () => {
    const click = new Audio('../assets/audio/ui/click.mp3')
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

const peaceMusicCollection = [
    new Audio('../assets/audio/ui/serenity.mp3'),
    new Audio('../assets/audio/ui/save.mp3'),
    new Audio('../assets/audio/ui/stash.mp3'),
]

peaceMusicCollection.forEach(music => addMusicEndEvent(music, peaceMusicCollection))

export const playPeaceMusic = () => {
    const music = peaceMusicCollection.sort(() => Math.random() - 0.5)[0]
    music.currentTime = 0
    setPlayingMusic(music)
    playMusic(music)
}

const actionMusicCollection = new Array(5)
    .fill(null)
    .map((item, index) => new Audio(`../assets/audio/action/action-${index + 1}.mp3`))

actionMusicCollection.forEach(music => addMusicEndEvent(music, actionMusicCollection))

export const playActionMusic = () => {
    const music = actionMusicCollection.sort(() => Math.random() - 0.5)[0]
    music.currentTime = 0
    setPlayingMusic(music)
    playMusic(music)
}

const playMusic = music => {
    music.volume = getSettings().audio.music
    music.play()
}

export const isPeaceMusicPlaying = () => peaceMusicCollection.includes(playingMusic)

export const isActionMusicPlaying = () => actionMusicCollection.includes(playingMusic)
import { getGunDetail, getGunDetails } from './gun-details.js'
import { IS_MOBILE } from './platform.js'
import { getSettings } from './settings.js'

const weapons = [...getGunDetails().keys()].map(weaponName => ({
    weaponName,
    shoot: new Audio(`./assets/audio/weapon/shoot/${weaponName}.mp3`),
    reload: new Audio(`./assets/audio/weapon/reload/${weaponName}.mp3`),
    equip: new Audio(`./assets/audio/weapon/equip/${weaponName}.mp3`),
}))

const sfx = {
    footstep: new Audio('./assets/audio/footstep.mp3'),
    emptyWeapon: new Audio('./assets/audio/empty-weapon.mp3'),
    explosion: new Audio('./assets/audio/explosion.mp3'),
    flashbang: new Audio('./assets/audio/flashbang.mp3'),
    ammoPickup: new Audio('./assets/audio/pickup/ammo-pickup.mp3'),
    pickup: new Audio('./assets/audio/pickup/pickup.mp3'),
    hover: new Audio('./assets/audio/ui/hover.mp3'),
    click: new Audio('./assets/audio/ui/click.mp3'),
    action: Array.from({ length: 5 }, (_, index) => new Audio(`./assets/audio/action/action-${index + 1}.mp3`)),
}

let playingSoundEffects = []
let playingEquipSoundEffect = null
let playingMusic = null

export const setPlayingSoundEffects = value => (playingSoundEffects = value)
export const getPlayingSoundEffects = () => playingSoundEffects
export const setPlayingEquipSoundEffect = value => (playingEquipSoundEffect = value)
export const getPlayingEquipSoundEffect = () => playingEquipSoundEffect
export const setPlayingMusic = value => (playingMusic = value)
export const getPlayingMusic = () => playingMusic

const safelyPlay = audio => audio.play()?.catch?.(() => {})

const playSound = (sound, currentTime = 0, volume = getSettings().audio.sound) => {
    if (!sound) return null
    const clone = sound.cloneNode()
    clone.volume = volume
    clone.currentTime = currentTime
    safelyPlay(clone)
    playingSoundEffects.push(clone)
    clone.addEventListener('ended', () => {
        playingSoundEffects = playingSoundEffects.filter(effect => effect !== clone)
    })
    return clone
}

const getWeaponSounds = name => weapons.find(item => item.weaponName === name)

export const playFootstep = () => playSound(sfx.footstep)
export const playEmptyWeapon = () => playSound(sfx.emptyWeapon)
export const playGunShot = name => playSound(getWeaponSounds(name)?.shoot)

export const playReload = equipped => {
    const clone = playSound(getWeaponSounds(equipped.name)?.reload)
    if (!clone) return
    clone.addEventListener(
        'loadedmetadata',
        () => {
            const expectedSeconds = getGunDetail(equipped.name, 'reloadspeed')
            clone.playbackRate = Math.max(0.5, Math.min(4, clone.duration / expectedSeconds))
        },
        { once: true },
    )
}

export const playEquip = name => {
    playingEquipSoundEffect?.pause()
    playingEquipSoundEffect = playSound(getWeaponSounds(name)?.equip)
}

export const playExplosion = () => playSound(sfx.explosion)
export const playFlashbang = () => playSound(sfx.flashbang, 1.5)
export const playPickup = name => playSound(name.toLowerCase().includes('ammo') ? sfx.ammoPickup : sfx.pickup)

export const addHoverSoundEffect = element => {
    if (IS_MOBILE) return
    element.addEventListener('mouseenter', () => {
        sfx.hover.pause()
        sfx.hover.currentTime = 0
        sfx.hover.volume = getSettings().audio.ui
        safelyPlay(sfx.hover)
    })
}

export const playClickSoundEffect = () => {
    sfx.click.pause()
    sfx.click.currentTime = 0
    sfx.click.volume = getSettings().audio.ui
    safelyPlay(sfx.click)
}

const playMusic = music => {
    music.volume = getSettings().audio.music
    safelyPlay(music)
}

const selectActionTrack = () => sfx.action[Math.floor(Math.random() * sfx.action.length)]

sfx.action.forEach(music =>
    music.addEventListener('ended', () => {
        const next = selectActionTrack()
        next.currentTime = 0
        playingMusic = next
        playMusic(next)
    }),
)

export const playActionMusic = () => {
    const music = selectActionTrack()
    music.currentTime = 0
    playingMusic = music
    playMusic(music)
}

export const isActionMusicPlaying = () => sfx.action.includes(playingMusic)

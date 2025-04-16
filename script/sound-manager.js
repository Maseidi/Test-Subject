import { getGunDetails, getGunUpgradableDetail, isGun } from './gun-details.js'
import { IS_MOBILE } from './script.js'
import { getSettings } from './settings.js'
import { getChaos } from './survival/variables.js'
import { isThrowable } from './throwable-details.js'

const getWeaponSoundEffects = () => {
    const result = []
    for (const weaponName of getGunDetails().keys()) {
        result.push({
            weaponName,
            shoot: new Audio(`./assets/audio/weapon/shoot/${weaponName}.mp3`),
            reload: new Audio(`./assets/audio/weapon/reload/${weaponName}.mp3`),
            equip: new Audio(`./assets/audio/weapon/equip/${weaponName}.mp3`),
        })
    }
    return result
}

const sfx = {
    footstep: new Audio('./assets/audio/footstep.mp3'),
    emptyWeapon: new Audio('./assets/audio/empty-weapon.mp3'),
    explosion: new Audio('./assets/audio/explosion.mp3'),
    breakCrate: new Audio('./assets/audio/break-crate.mp3'),
    flashbang: new Audio('./assets/audio/flashbang.mp3'),
    coinPickup: new Audio('./assets/audio/pickup/coin-pickup.mp3'),
    ammoPickup: new Audio('./assets/audio/pickup/ammo-pickup.mp3'),
    gunPickup: new Audio('./assets/audio/pickup/gun-pickup.mp3'),
    pickup: new Audio('./assets/audio/pickup/pickup.mp3'),
    trade: new Audio('./assets/audio/ui/trade.mp3'),
    upgrade: new Audio('./assets/audio/ui/upgrade.mp3'),
    hover: new Audio('./assets/audio/ui/hover.mp3'),
    click: new Audio('./assets/audio/ui/click.mp3'),
    peace: [
        new Audio('./assets/audio/ui/serenity.mp3'),
        new Audio('./assets/audio/ui/save.mp3'),
        new Audio('./assets/audio/ui/stash.mp3'),
    ],
    action: new Array(5).fill(null).map((item, index) => new Audio(`./assets/audio/action/action-${index + 1}.mp3`)),
    weapons: getWeaponSoundEffects(),
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
    if (playingSoudEffects.includes(sound)) {
        sound.currentTime = 0
        sound.play()
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

sfx.peace.forEach(music => addMusicEndEvent(music, sfx.peace))

export const playPeaceMusic = () => {
    if (getChaos() === 0) return
    const music = sfx.peace.sort(() => Math.random() - 0.5)[0]
    music.currentTime = 0
    setPlayingMusic(music)
    playMusic(music)
}

sfx.action.forEach(music => addMusicEndEvent(music, sfx.action))

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

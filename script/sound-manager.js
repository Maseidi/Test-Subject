import { getGunUpgradableDetail } from './gun-details.js'

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

const playSound = sound => {
    sound.play()
    playingSoudEffects.push(sound)
    sound.addEventListener('ended', () => {
        playingSoudEffects = playingSoudEffects.filter(effect => effect !== sound)
    })
}

export const playFootstep = () => {
    const footstep = new Audio('../assets/audio/footstep.mp3')
    footstep.volume = 0.3
    playSound(footstep)
}

export const playEmptyWeapon = () => {
    const empty = new Audio('../assets/audio/empty-weapon.mp3')
    playSound(empty)
}

export const playGunShot = name => {
    const gunShot = new Audio(`../assets/audio/weapon/shoot/${name}.mp3`)
    gunShot.volume = 0.5
    playSound(gunShot)
}

export const playReload = equipped => {
    const reloadSpeed = getGunUpgradableDetail(equipped.name, 'reloadspeed', equipped.reloadspeedlvl)
    const gunShot = new Audio(`../assets/audio/weapon/reload/${equipped.name}.mp3`)
    gunShot.volume = 0.5
    gunShot.preload = 'metadata'
    gunShot.onloadedmetadata = () => {
        gunShot.playbackRate = gunShot.duration / reloadSpeed
    }
    playSound(gunShot)
}

export const playEquip = name => {
    const gunShot = new Audio(`../assets/audio/weapon/equip/${name}.mp3`)
    playingEquipSoundEffect = gunShot
    gunShot.volume = 0.5
    playSound(gunShot)
}

export const playExplosion = () => {
    const explosion = new Audio(`../assets/audio/explosion.mp3`)
    explosion.volume = 0.5
    playSound(explosion)
}

export const playBreakCrate = () => {
    const explosion = new Audio(`../assets/audio/break-crate.mp3`)
    explosion.volume = 0.5
    playSound(explosion)
}

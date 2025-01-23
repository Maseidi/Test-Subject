import { getGunUpgradableDetail, isGun } from './gun-details.js'

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
    gunShot.volume = 0.3
    playSound(gunShot)
}

export const playReload = equipped => {
    const reloadSpeed = getGunUpgradableDetail(equipped.name, 'reloadspeed', equipped.reloadspeedlvl)
    const gunShot = new Audio(`../assets/audio/weapon/reload/${equipped.name}.mp3`)
    gunShot.volume = 0.3
    gunShot.preload = 'metadata'
    gunShot.onloadedmetadata = () => {
        const scaledRate = gunShot.duration / reloadSpeed
        gunShot.playbackRate = scaledRate < 0.5 ? gunShot.duration : scaledRate
    }
    playSound(gunShot)
}

export const playEquip = name => {
    const gunShot = new Audio(`../assets/audio/weapon/equip/${name}.mp3`)
    setPlayingEquipSoundEffect(gunShot)
    gunShot.volume = 0.3
    playSound(gunShot)
}

export const playExplosion = () => {
    const explosion = new Audio('../assets/audio/explosion.mp3')
    explosion.volume = 0.3
    playSound(explosion)
}

export const playBreakCrate = () => {
    const breakCrate = new Audio('../assets/audio/break-crate.mp3')
    breakCrate.volume = 0.3
    playSound(breakCrate)
}

export const playPickup = name => {
    if (name === 'coin') var pickup = new Audio('../assets/audio/pickup/coin-pickup.mp3')
    else if (isGun(name)) var pickup = new Audio('../assets/audio/pickup/gun-pickup.mp3')
    else if (name.toLowerCase().includes('ammo') || name.toLowerCase() === 'shotgunshells')
        var pickup = new Audio('../assets/audio/pickup/ammo-pickup.mp3')

    else var pickup = new Audio('../assets/audio/pickup/pickup.mp3')
    pickup.volume = 0.3
    playSound(pickup)
}

export const playTrade = () => {
    const trade = new Audio('../assets/audio/ui/trade.mp3')
    trade.volume = 0.3
    trade.play()
}

export const playUpgrade = () => {
    const upgrade = new Audio('../assets/audio/ui/upgrade.mp3')
    upgrade.volume = 0.3
    upgrade.play()
}

export const addHoverSoundEffect = element => {
    element.addEventListener('mouseenter', () => {
        const hover = new Audio('../assets/audio/ui/hover.mp3')
        hover.volume = 0.1
        hover.play()
    })
}

export const playClickSoundEffect = () => {
    const click = new Audio('../assets/audio/ui/click.mp3')
    click.volume = 0.1
    click.play()
}

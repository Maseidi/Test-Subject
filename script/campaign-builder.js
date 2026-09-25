import { getGunUpgradableDetail } from './gun-details.js'
import { getItemDescription } from './item-descriptions.js'
import {
    AdrenalineShopItem, AntidoteShopItem, ArmorShopItem, BandageShopItem, EnergyDrinkShopItem,
    FlashbangShopItem, GrenadeShopItem, GunShopItem, HardDriveShopItem, HealthPotionShopItem,
    LuckPillsShopItem, MagnumAmmoShopItem, PistolAmmoShopItem, Pouch, RifleAmmoShopItem,
    ShotgunShellsShopItem, SmgAmmoShopItem,
} from './shop-item.js'

// Rooms 1-40 contain the tutorial, 29 regular fights, and ten safe rooms.
// Room 41 is the boss, 42 the exit, and 43 the temporary testing room.
const ALWAYS = String(Number.MAX_SAFE_INTEGER)
const ALL = ['mild', 'middle', 'survival']
const GUNS = {
    pistol: ['glock', 'm1911', 'mauser'], shotgun: ['remington870', 'benellim4', 'spas'],
    smg: ['uzi', 'mp5k', 'p90', 'ppsh'], rifle: ['steyrssg69', 'parkerhalem85', 'arcticwarfare'],
    magnum: ['revolver', 'remington1858'],
}
const GUN_INFO = {
    glock: ['glock', 'pistolAmmo', 1, 14], m1911: ['m 1911', 'pistolAmmo', 1, 13], mauser: ['mauser', 'pistolAmmo', 1, 15],
    remington870: ['remington 870', 'shotgunShells', 3, 35], benellim4: ['benelli m4', 'shotgunShells', 3, 70], spas: ['spas', 'shotgunShells', 2, 50],
    uzi: ['uzi', 'smgAmmo', 1, 21], mp5k: ['mp5k', 'smgAmmo', 2, 24], p90: ['p90', 'smgAmmo', 2, 23], ppsh: ['ppsh', 'smgAmmo', 2, 22],
    steyrssg69: ['steyr ssg 69', 'rifleAmmo', 3, 70], parkerhalem85: ['parker hale m 85', 'rifleAmmo', 3, 75], arcticwarfare: ['arctic warfare', 'rifleAmmo', 3, 65],
    revolver: ['revolver', 'magnumAmmo', 2, 90], remington1858: ['remington 1858', 'magnumAmmo', 2, 100],
}
const ITEMS = {
    pistolAmmo: ['pistol ammo', 25, 30, 1 / 30], shotgunShells: ['shotgun shells', 20, 20, 1 / 20], smgAmmo: ['smg ammo', 20, 90, 1 / 90],
    rifleAmmo: ['rifle ammo', 15, 10, 1 / 10], magnumAmmo: ['magnum ammo', 20, 5, 1 / 5], bandage: ['bandage', 25, 3, 1 / 3],
    harddrive: ['hard drive', 15, 2, 1 / 2], antidote: ['antidote', 15, 3, 1 / 3], grenade: ['grenade', 10, 2, 1 / 2],
    flashbang: ['flashbang', 10, 3, 1 / 3], coin: ['coin', 12, 50, 0], armor: ['body armor', 15, 1, 50],
    pouch: ['hip pouch', 25, 1, 5], adrenaline: ['adrenaline', 10, 1, 20], healthpotion: ['health potion', 5, 1, 20],
    luckpills: ['luck pills', 15, 1, 20], energydrink: ['energy drink', 15, 1, 20],
    redvaccine: ['red vaccine', 15, 3, 1 / 3], bluevaccine: ['blue vaccine', 15, 3, 1 / 3],
    greenvaccine: ['green vaccine', 15, 3, 1 / 3], yellowvaccine: ['yellow vaccine', 15, 3, 1 / 3],
    purplevaccine: ['purple vaccine', 15, 3, 1 / 3],
}
const LOOT_AMMO = { pistolAmmo: 'pistolammo', shotgunShells: 'shotgunshells', smgAmmo: 'smgammo', rifleAmmo: 'rifleammo', magnumAmmo: 'magnumammo' }
const BUDGET = { pistolAmmo: 25, shotgunShells: 12, smgAmmo: 40, rifleAmmo: 14, magnumAmmo: 7 }
const SHOP_ITEMS = {
    bandage: BandageShopItem, harddrive: HardDriveShopItem, pistolAmmo: PistolAmmoShopItem,
    shotgunShells: ShotgunShellsShopItem, smgAmmo: SmgAmmoShopItem, rifleAmmo: RifleAmmoShopItem,
    magnumAmmo: MagnumAmmoShopItem, grenade: GrenadeShopItem, flashbang: FlashbangShopItem,
    pouch: Pouch, antidote: AntidoteShopItem, armor: ArmorShopItem,
    adrenaline: AdrenalineShopItem, healthpotion: HealthPotionShopItem,
    luckpills: LuckPillsShopItem, energydrink: EnergyDrinkShopItem,
}
const pick = list => list[Math.floor(Math.random() * list.length)]
const flag = room => String(10000 + room * 10)
const waveFlag = (room, wave) => String(10000 + room * 10 + wave)
const map = () => Object.fromEntries(Array.from({ length: 43 }, (_, i) => [i + 1, []]))
const item = (name, amount, left, top, progress = {}) => ({
    width: ITEMS[name][1], left, top, name, heading: ITEMS[name][0], popup: 'Pick up', solid: false,
    amount, space: 1, description: getItemDescription(name), price: ITEMS[name][3], renderProgress: progress.renderProgress ?? ALWAYS,
    killAll: progress.killAll ?? null, progress2Active: progress.progress2Active ?? [], progress2Deactive: [], onexamine: [],
    difficulties: progress.difficulties ?? ALL,
})
const gun = (name, left, top, progress = {}, level = 1) => {
    const [heading, ammotype, space, price] = GUN_INFO[name]
    return { ...item('pistolAmmo', 1, left, top, progress), name, heading, width: 35, space, price, ammotype,
        description: getItemDescription(name), currmag: getGunUpgradableDetail(name, 'magazine', level),
        damageLvl: level, rangeLvl: level, reloadspeedLvl: level, magazineLvl: level, fireratelvl: level }
}
const fixture = (name, left, top) => ({ ...item('pouch', 0, left, top), name,
    heading: name === 'vendingMachine' ? 'vending machine' : name,
    width: name === 'vendingMachine' ? 35 : 50,
    popup: ({ computer: 'Save game', stash: 'Open stash', vendingMachine: 'Trade' })[name], solid: true, space: 0 })
const crate = (left, top, loot = 'random', amount = 1) => ({ ...item('bandage', 0, left, top),
    name: 'crate', heading: 'crate', popup: 'Break', width: 35, solid: true,
    'loot-name': loot, 'loot-amount': amount, 'loot-active': [], 'loot-deactive': [] })
const door = killAll => ({ name: 'door', heading: '', popup: '', key: null, code: null, value: '', type: 1,
    renderProgress: null, progress2Active: [], killAll, campaign: true })
const loader = (target, side, offset, lock) => ({ className: target,
    width: side === 'top' || side === 'bottom' ? 100 : 5, height: side === 'left' || side === 'right' ? 100 : 5,
    left: side === 'left' ? -26 : side === 'right' ? null : offset, right: side === 'right' ? -26 : null,
    top: side === 'top' ? -26 : side === 'bottom' ? null : offset, bottom: side === 'bottom' ? -26 : null,
    door: door(lock) })
const connect = (s, a, b, sideA = 'right', sideB = 'left') => {
    const offset = (id, side) => a === 1 && b === 43 ? 120 :
        Math.floor(((side === 'top' || side === 'bottom') ? s.rooms[id - 1].width : s.rooms[id - 1].height) / 2 - 50)
    const lock = id => id === 41 ? waveFlag(41, 6) : id >= 2 && id <= 39 && id % 4 !== 0 ? waveFlag(id, 3) : null
    s.loaders[a].push(loader(b, sideA, offset(a, sideA), lock(a)))
    s.loaders[b].push(loader(a, sideB, offset(b, sideB), lock(b)))
}
const available = room => {
    const types = ['torturer']
    for (const [at, type] of [[2, 'soul-drinker'], [3, 'ranger'], [5, 'grabber'], [6, 'spiker'],
        [7, 'rock-crusher'], [9, 'stinger'], [10, 'scorcher'], [11, 'tracker']]) if (room >= at) types.push(type)
    return types
}
const featured = { 2: 'soul-drinker', 3: 'ranger', 5: 'grabber', 6: 'spiker', 7: 'rock-crusher',
    9: 'stinger', 10: 'scorcher', 11: 'tracker' }
const unlockedLoot = room => {
    const pool = [['bandage', 1], ['coin', 2], ['pistolammo', 6]]
    if (room >= 5) pool.push(['shotgunshells', 4], ['grenade', 1], ['flashbang', 1], ['harddrive', 1])
    if (room >= 9) pool.push(['smgammo', 18], ['antidote', 1])
    if (room >= 13) pool.push(['rifleammo', 2])
    return pool
}
const enemyLoot = room => {
    if (Math.random() >= 0.15) return {}
    const [name, amount] = room >= 17 ? ['random', 1] : pick(unlockedLoot(room))
    return { 'loot-name': name, 'loot-amount': amount, 'loot-active': [], 'loot-deactive': [] }
}
const enemy = (room, wave, index, type, difficulties = ALL) => {
    const size = room === 41 ? 1000 : 850
    const x = 110 + ((index * 157 + wave * 71) % (size - 230))
    const y = 105 + ((index * 113 + wave * 129) % (size - 300))
    return { type, waypoint: { points: [{ x, y }, { x: size - x - 50, y: size - y - 50 }] },
        health: null, damage: 1, x, y, level: Number((1 + (room - 1) * 0.1).toFixed(1)),
        renderProgress: wave === 1 ? flag(room) : waveFlag(room, wave), killAll: wave === 1 ? null : waveFlag(room, wave - 1),
        progress2Active: [], progress2Deactive: [], knock: 100, knockImmune: false, healthMultiplier: 1,
        loot: enemyLoot(room),
        virus: pick(['red', 'green', 'yellow', 'blue', 'purple']), difficulties }
}
const maxWaves = room => room <= 3 ? 1 : 1 + Math.floor((room - 1) / 4)
const waveCount = room => room % 4 === 3 ? maxWaves(room) : 1 + room % maxWaves(room)
const lastWave = room => waveCount(room) + (room >= 5 ? 1 : 0)
const combat = (s, room) => {
    const pool = available(room)
    const waves = waveCount(room)
    const easyWaves = Math.max(1, waves - 1)
    const finalWave = lastWave(room)
    for (let wave = 1; wave <= finalWave; wave++) {
        const waveDifficulties = wave <= easyWaves ? ALL : wave <= waves ? ['middle', 'survival'] : ['survival']
        const base = 4 + ((room + wave) % 2)
        for (let i = 0; i < base; i++) {
            const type = wave === 1 && i === 0 ? (featured[room] || pick(pool)) : pick(pool)
            const difficulties = i === base - 1 && waveDifficulties === ALL ? ['middle', 'survival'] : waveDifficulties
            s.enemies[room].push(enemy(room, wave, i, type, difficulties))
        }
        s.enemies[room].push(enemy(room, wave, base, pick(pool), ['survival']))
    }
    for (const passage of s.loaders[room]) passage.door.killAll = waveFlag(room, finalWave)
    const ammo = room <= 3 ? 'pistolAmmo' : room <= 7 ? 'shotgunShells' :
        room <= 11 ? 'smgAmmo' : room <= 15 ? 'rifleAmmo' : 'magnumAmmo'
    const budget = BUDGET[ammo] * waves * (room === 3 ? 2.5 : 1)
    s.interactables[room].push(item(ammo, Math.ceil(budget * 0.7), 140, 330))
    s.interactables[room].push(item(ammo, Math.ceil(budget * 0.3), 210, 330, { difficulties: ['middle', 'survival'] }))
    s.interactables[room].push(item(ammo, Math.ceil(budget * 0.65), 275, 330, { difficulties: ['survival'] }))
    if (room >= 7) {
        const backup = room <= 7 ? 'pistolAmmo' : room <= 11 ? 'shotgunShells' :
            room <= 15 ? 'smgAmmo' : 'rifleAmmo'
        s.interactables[room].push(item(backup, Math.ceil(BUDGET[backup] / (room <= 10 ? 3 : 2)), 350, 330))
    }
    if (room % 3 === 0) s.interactables[room].push(item('bandage', 2, 620, 490))
    if (room >= 9 && room % 4 === 1) s.interactables[room].push(item('antidote', 1, 625, 180))
    s.interactables[room].push(item('coin', Math.min(12, 3 + Math.floor(room / 6)), 625, 320))
    const count = Math.floor(Math.random() * (room <= 10 ? 3 : 4))
    for (let i = 0; i < count; i++) {
        const contents = Math.random() < (room <= 10 ? 0.45 : 0.6) ? LOOT_AMMO[ammo] : 'random'
        s.interactables[room].push(crate(280 + i * 105, i % 2 ? 510 : 175, contents,
            contents === 'random' ? 1 : room <= 10 ? 4 : 6))
    }
}
const stock = (name, room) => {
    const ShopItem = SHOP_ITEMS[name]
    const item = ShopItem ? new ShopItem(flag(room)) : new GunShopItem(name, flag(room))
    return { ...item, roomId: room }
}
export const normalizeCampaignShopItems = items => {
    if (!items.some(item => item.roomId)) return items

    const pouches = items.filter(item => item.name === 'pouch' && item.roomId)
    const oldPouchRooms = [4, 4, 12, 20, 20, 28, 36, 36]
    const newPouchRooms = [4, 8, 12, 20, 24, 28, 36, 40]
    if (pouches.length === oldPouchRooms.length &&
        pouches.every((item, index) => item.roomId === oldPouchRooms[index])) {
        pouches.forEach((item, index) => { item.roomId = newPouchRooms[index] })
    }

    return items.map(item => {
        if (!item.roomId || (!SHOP_ITEMS[item.name] && !GUN_INFO[item.name])) return item
        return { ...stock(item.name, item.roomId), sold: item.sold }
    })
}
const safe = (s, room) => {
    s.interactables[room].push(fixture('computer', 135, 155), fixture('stash', 255, 155), fixture('vendingMachine', 675, 155))
    const n = room / 4
    const goods = ['bandage', 'bandage', 'pistolAmmo', 'shotgunShells', 'smgAmmo', 'rifleAmmo', 'magnumAmmo', 'grenade', 'flashbang']
    if (n % 2 === 1) goods.push('harddrive')
    if (n % 2 === 1 || n % 4 === 2) goods.push('pouch')
    if (room > 8) goods.push('antidote')
    if (room >= 20) goods.push('armor')
    goods.push(pick(['adrenaline', 'healthpotion', 'luckpills', 'energydrink']))
    goods.forEach(name => s.shopItems.push(stock(name, room)))
    s.interactables[room].push(item('coin', n * 5, 440, 360))
}
const boss = s => {
    s.enemies[41].push({ ...enemy(41, 0, 0, 'campaign-boss'), health: 50000, level: 1,
        x: 465, y: 400, waypoint: { points: [{ x: 465, y: 400 }] }, renderProgress: flag(41),
        killAll: null, knockImmune: true, loot: {} })
    const types = available(41)
    for (let phase = 1; phase <= 3; phase++) for (let wave = 1; wave <= phase; wave++) {
        const number = phase * (phase - 1) / 2 + wave
        for (let i = 0; i < 5; i++) {
            const e = enemy(41, number, i, types[(i + phase + wave - 2) % types.length])
            e.level = 5
            e.killAll = wave === 1 ? null : waveFlag(41, number - 1)
            s.enemies[41].push(e)
        }
    }
    for (const passage of s.loaders[41]) {
        passage.door.killAll = null
        passage.door.renderProgress = '10419'
    }
}
const testingRoom = s => {
    const drops = s.interactables[43]
    for (let i = 0; i < 8; i++) drops.push(item('pouch', 1, 100 + i * 90, 140))
    Object.keys(GUN_INFO).forEach((name, i) => drops.push(gun(name, 100 + (i % 5) * 130, 250 + Math.floor(i / 5) * 85, {}, 5)))
    Object.keys(BUDGET).forEach((name, i) => drops.push(item(name, ITEMS[name][2], 100 + i * 130, 545)))
    for (const [name, amount, x] of [['armor', 1, 90], ['bandage', ITEMS.bandage[2], 180],
        ['bandage', ITEMS.bandage[2], 245], ['antidote', 20, 330],
        ['grenade', 20, 450], ['flashbang', 20, 550], ['harddrive', 10, 660]]) drops.push(item(name, amount, x, 650))
    const extras = ['coin', 'adrenaline', 'healthpotion', 'luckpills', 'energydrink',
        'redvaccine', 'bluevaccine', 'greenvaccine', 'yellowvaccine', 'purplevaccine']
    extras.forEach((name, i) => drops.push(item(name, name === 'coin' ? 100 : 1,
        80 + (i % 6) * 115, 705 + Math.floor(i / 6) * 48)))
    drops.push(fixture('stash', 760, 110), fixture('computer', 760, 230))
}
export const buildCampaign = () => {
    const s = { rooms: [], walls: map(), loaders: map(), enemies: map(), interactables: map(), shopItems: [] }
    for (let id = 1; id <= 43; id++) s.rooms.push({ id, width: id === 41 ? 1000 : 850,
        height: id === 41 ? 1000 : id === 43 ? 800 : 700, label: '', brightness: 10,
        background: id % 4 === 0 ? '#a8aaa1' : '#777e83', progress2Active: [flag(id)], progress2Deactive: [] })
    for (let id = 1; id < 42; id++) connect(s, id, id + 1, id === 1 ? 'top' : 'right', id === 1 ? 'bottom' : 'left')
    connect(s, 1, 43, 'right', 'left')
    connect(s, 43, 41, 'top', 'bottom')
    for (let id = 1; id <= 40; id++) {
        if (id % 4 === 0) safe(s, id)
        else if (id > 1) combat(s, id)
    }
    s.enemies[1].push({ ...enemy(1, 1, 0, 'torturer'), renderProgress: '6010' })
    s.loaders[1].find(passage => passage.className === 2).door.killAll = '6010'
    const dropped = new Set()
    for (const [roomText, group] of Object.entries({ 1: 'pistol', 3: 'shotgun', 7: 'smg', 11: 'rifle', 15: 'magnum' })) {
        const room = Number(roomText), name = pick(GUNS[group])
        dropped.add(name)
        s.interactables[room].push(gun(name, 400, room === 1 ? 240 : 310,
            { progress2Active: room === 1 ? ['6010'] : [], killAll: room === 1 ? null : waveFlag(room, lastWave(room)) }))
    }
    const shopGuns = Object.keys(GUN_INFO).filter(name => !dropped.has(name))
    for (let id = 4; id <= 40; id += 4) {
        const categories = Object.keys(GUNS).filter(group =>
            ({ pistol: 1, shotgun: 3, smg: 7, rifle: 11, magnum: 15 })[group] < id)
        const availableGuns = shopGuns.filter(name => categories.some(group => GUNS[group].includes(name)))
        const name = pick(availableGuns)
        shopGuns.splice(shopGuns.indexOf(name), 1)
        s.shopItems.push(stock(name, id))
    }
    s.interactables[1].push(item('pistolAmmo', 40, 335, 300), item('bandage', 2, 475, 300, { progress2Active: ['6011'] }))
    boss(s)
    for (const [name, amount, x] of [['magnumAmmo', 100, 160], ['rifleAmmo', 100, 300], ['smgAmmo', 200, 440],
        ['shotgunShells', 100, 580], ['pistolAmmo', 200, 720]]) s.interactables[41].push(item(name, amount, x, 790))
    for (let i = 0; i < 6; i++) s.interactables[41].push(item('bandage', 3, 145 + i * 135, 900))
    s.interactables[41].push(item('grenade', 6, 250, 850), item('antidote', 5, 675, 850))
    testingRoom(s)
    return { rooms: s.rooms, walls: s.walls, loaders: s.loaders, enemies: s.enemies, interactables: s.interactables,
        shopItems: s.shopItems, passwordNames: [], dialogues: [], popups: [
            { message: { kind: 'movement' }, renderProgress: flag(1), progress2Active: [] },
            { message: { kind: 'shooting' }, renderProgress: '6010', progress2Active: [] },
            { message: { kind: 'healing' }, renderProgress: '6011', progress2Active: [] },
            { message: { kind: 'switching' }, renderProgress: '6012', progress2Active: [] },
            { message: 'Trackers are blind. Sprinting and gunshots alert them to your position.', renderProgress: flag(11), progress2Active: [] },
            { message: 'You are poisoned. Your movement controls are reversed.', renderProgress: '6020', progress2Active: ['6021'] },
            { message: { kind: 'antidote' }, renderProgress: '6021', progress2Active: [] },
            { message: { kind: 'finish' }, renderProgress: flag(42), progress2Active: [] },
        ] }
}

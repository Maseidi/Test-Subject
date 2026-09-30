export const MAUSER = 'mauser'
export const BENELLI_M4 = 'benellim4'
export const STEYR_SSG_69 = 'steyrssg69'
export const MP5K = 'mp5k'
export const REVOLVER = 'revolver'

// Every weapon uses its former level-three values. There are no upgrade levels.
const gunDetails = new Map([
    [
        MAUSER,
        {
            heading: 'mauser',
            category: 'pistol',
            ammotype: 'pistolAmmo',
            height: 12,
            color: 'darkgray',
            antivirus: 'red',
            damage: 72,
            range: 550,
            reloadspeed: 2.2,
            magazine: 11,
            firerate: 1.5,
            knock: 50,
        },
    ],
    [
        BENELLI_M4,
        {
            heading: 'benelli m4',
            category: 'shotgun',
            ammotype: 'shotgunShells',
            height: 16,
            color: 'lightgray',
            antivirus: 'blue',
            damage: 480,
            range: 260,
            reloadspeed: 2.3,
            magazine: 7,
            firerate: 1,
            knock: 350,
        },
    ],
    [
        STEYR_SSG_69,
        {
            heading: 'steyr ssg 69',
            category: 'rifle',
            ammotype: 'rifleAmmo',
            height: 14,
            color: 'lightgray',
            antivirus: 'yellow',
            damage: 840,
            range: 700,
            reloadspeed: 2.25,
            magazine: 10,
            firerate: 1.5,
            knock: 150,
        },
    ],
    [
        MP5K,
        {
            heading: 'mp5k',
            category: 'smg',
            ammotype: 'smgAmmo',
            height: 12,
            color: 'black',
            antivirus: 'green',
            damage: 27,
            range: 550,
            reloadspeed: 2,
            magazine: 30,
            firerate: 0.12,
            knock: 25,
        },
    ],
    [
        REVOLVER,
        {
            heading: 'revolver',
            category: 'magnum',
            ammotype: 'magnumAmmo',
            height: 14,
            color: 'gray',
            antivirus: 'purple',
            damage: 1548,
            range: 475,
            reloadspeed: 3.7,
            magazine: 8,
            firerate: 2,
            knock: 200,
        },
    ],
])

export const getGunDetail = (gunName, detail) => gunDetails.get(gunName)?.[detail]

export const getGunDetails = () => gunDetails

export const isGun = name => gunDetails.has(name)

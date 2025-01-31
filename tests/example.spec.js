// @ts-check
import { expect, test } from '@playwright/test'

test('should be able to create a room', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await page.getByText('map maker').click()
    await page.getByTestId('new-map-maker').click()
    await page.getByText('add item').click()

    await page.getByLabel('set as spawn room').check()

    const WIDTH = '1000'
    await page.getByLabel('width').clear()
    await page.getByLabel('width').click()
    await page.keyboard.type(WIDTH, { delay: 100 })

    const HEIGHT = '500'
    await page.getByLabel('height').clear()
    await page.getByLabel('height').click()
    await page.keyboard.type(HEIGHT, { delay: 100 })

    const ROOM_LABEL = 'Test room'
    await page.getByLabel('label').clear()
    await page.getByLabel('label').click()
    await page.keyboard.type(ROOM_LABEL, { delay: 100 })

    await page.getByLabel('background').fill('#a7a7a7')

    await page.getByText('play').click()

    expect(page.getByText(ROOM_LABEL)).toBeVisible()
    expect(page.locator('.room')).toHaveCSS('width', `${WIDTH}px`)
    expect(page.locator('.room')).toHaveCSS('height', `${HEIGHT}px`)
})

test('should be able enter another room', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await page.getByText('map maker').click()
    await page.getByTestId('new-map-maker').click()
    await page.getByText('add item').click()

    await page.getByLabel('set as spawn room').check()

    const SPAWN_Y = '200'
    await page.getByLabel('spawn y').clear()
    await page.getByLabel('spawn y').click()
    await page.keyboard.type(SPAWN_Y, { delay: 100 })

    const WIDTH_1 = '1000'
    await page.getByLabel('width').clear()
    await page.getByLabel('width').click()
    await page.keyboard.type(WIDTH_1, { delay: 100 })

    const HEIGHT_1 = '500'
    await page.getByLabel('height').clear()
    await page.getByLabel('height').click()
    await page.keyboard.type(HEIGHT_1, { delay: 100 })

    const ROOM_LABEL_1 = 'Test room 1'
    await page.getByLabel('label').clear()
    await page.getByLabel('label').click()
    await page.keyboard.type(ROOM_LABEL_1, { delay: 100 })

    await page.getByLabel('background').fill('#a7a7a7')

    await page.getByText('loaders').click()
    await page.getByText('add item').click()
    await page.getByLabel('room to load').fill('2')

    await page.getByText('rooms').click()
    await page.getByText('add item').click()

    const WIDTH_2 = '2000'
    await page.getByLabel('width').clear()
    await page.getByLabel('width').click()
    await page.keyboard.type(WIDTH_2, { delay: 100 })

    const HEIGHT_2 = '500'
    await page.getByLabel('height').clear()
    await page.getByLabel('height').click()
    await page.keyboard.type(HEIGHT_2, { delay: 100 })

    const ROOM_LABEL_2 = 'Test room 2'
    await page.getByLabel('label').clear()
    await page.getByLabel('label').click()
    await page.keyboard.type(ROOM_LABEL_2, { delay: 100 })

    await page.getByLabel('background').fill('#a7a7a7')

    await page.getByText('loaders').click()
    await page.getByText('add item').click()
    await page.getByLabel('room to load').fill('1')
    await page.getByLabel('type').selectOption('bottom-loader')

    await page.getByText('play').click()

    expect(page.getByText(ROOM_LABEL_1)).toBeVisible()
    expect(page.locator('.room')).toHaveCSS('width', `${WIDTH_1}px`)
    expect(page.locator('.room')).toHaveCSS('height', `${HEIGHT_1}px`)

    await page.waitForTimeout(3000)
    await page.keyboard.down('KeyW')
    await page.waitForTimeout(3000)

    expect(page.getByText(ROOM_LABEL_2)).toBeVisible()
    expect(page.locator('.room')).toHaveCSS('width', `${WIDTH_2}px`)
    expect(page.locator('.room')).toHaveCSS('height', `${HEIGHT_2}px`)
})

test('should be able to pickup a weapon, examine it and equip it in the inventory', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await page.getByText('map maker').click()
    await page.getByTestId('new-map-maker').click()
    await page.getByText('add item').click()

    await page.getByLabel('set as spawn room').check()

    await page.getByLabel('width').clear()
    await page.getByLabel('width').click()
    await page.keyboard.type('1000', { delay: 100 })

    await page.getByLabel('height').clear()
    await page.getByLabel('height').click()
    await page.keyboard.type('500', { delay: 100 })

    await page.getByLabel('label').clear()
    await page.getByLabel('label').click()
    await page.keyboard.type('Test room', { delay: 100 })

    await page.getByLabel('background').fill('#a7a7a7')

    await page.getByText('interactables').click()
    await page.getByText('add item').click()
    const NAME = 'glock'
    const DESCRIPTION = 'Small and fast paced pistol with a pretty decent range'
    await page.getByLabel('type').selectOption(NAME)

    const LEFT = '200'
    await page.getByLabel('left').clear()
    await page.getByLabel('left').click()
    await page.keyboard.type(LEFT, { delay: 100 })

    const TOP = '200'
    await page.getByLabel('top').clear()
    await page.getByLabel('top').click()
    await page.keyboard.type(TOP, { delay: 100 })

    await page.getByText('play').click()

    await page.waitForTimeout(3000)
    expect(page.locator('.interactable')).toHaveAttribute('name', NAME)
    await page.keyboard.down('KeyS')
    await page.keyboard.down('KeyD')
    await page.waitForTimeout(700)
    await page.keyboard.up('KeyS')
    await page.keyboard.up('KeyD')
    await page.keyboard.press('KeyF')
    await page.keyboard.press('Tab')
    const weaponBlock = page.locator(`[name="${NAME}"]`)
    expect(weaponBlock).toBeVisible()
    const box = await weaponBlock.boundingBox()
    if (box) {
        const { x, y, width, height } = box
        await page.mouse.move(x + width / 2, y + height / 2)
        expect(page.getByText(NAME)).toBeVisible()
        expect(page.getByText(DESCRIPTION)).toBeVisible()
        await page.waitForTimeout(2000)
        await weaponBlock.click()
        await page.getByText('examine').click()
        await page.waitForTimeout(2000)
        await page.keyboard.press('Escape')
        await weaponBlock.click()
        await page.getByText('equip').click()
        await page.getByText('quit').click()
        expect(page.locator('.weapon-icon')).toBeVisible()
        await page.keyboard.press('Digit2')
        expect(page.locator('.weapon-icon')).toHaveCount(0)
        await page.waitForTimeout(2000)
        await page.keyboard.press('Digit1')
        expect(page.locator('.weapon-icon')).toBeVisible()
        await page.waitForTimeout(2000)
    }
})

test('should be able to buy a weapon, buy ammo, upgrade it, fight off some enemies, take damage, get infected, kill enemies, loot enemies, use vaccine, use bandage, note should be appearing after killing all enemies, note has a code for a door, should unlock the door with the code, a popup must apper, then a dialogue should begin', async ({
    page,
}) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await page.getByText('map maker').click()
    await page.getByTestId('new-map-maker').click()
    // start room 1
    await page.getByText('add item').click()

    // setting as the room the player spawns
    await page.getByLabel('set as spawn room').check()

    // room width
    await page.getByLabel('width').clear()
    await page.getByLabel('width').click()
    await page.keyboard.type('1000', { delay: 100 })

    // room height
    await page.getByLabel('height').clear()
    await page.getByLabel('height').click()
    await page.keyboard.type('500', { delay: 100 })

    // room label
    await page.getByLabel('label').clear()
    await page.getByLabel('label').click()
    await page.keyboard.type('Test room 1', { delay: 100 })

    // room 1 background color
    await page.getByLabel('background').fill('#a7a7a7')

    // flag will be true as soon as the room renders
    const SHOP_WEAPON_RENDER_FLAG = '8000'
    await page.getByLabel('progresses to active').fill(SHOP_WEAPON_RENDER_FLAG)

    // connect room 2 to room 1
    await page.getByText('loaders').click()
    await page.getByText('add item').click()
    await page.getByLabel('room to load').fill('2')

    // add coin
    await page.getByText('interactables').click()
    await page.getByText('add item').click()
    await page.getByLabel('type').selectOption('coin')
    await page.getByLabel('amount').fill('100')

    // set coin x
    await page.getByLabel('left').clear()
    await page.getByLabel('left').click()
    await page.keyboard.type('200', { delay: 100 })

    // set coin y
    await page.getByLabel('top').clear()
    await page.getByLabel('top').click()
    await page.keyboard.type('200', { delay: 100 })

    // add shop
    await page.getByText('add item').click()
    await page.getByLabel('type').selectOption('vendingMachine')

    // set shop x
    await page.getByLabel('left').clear()
    await page.getByLabel('left').click()
    await page.keyboard.type('300', { delay: 100 })

    // set shop y
    await page.getByLabel('top').clear()
    await page.getByLabel('top').click()
    await page.keyboard.type('300', { delay: 100 })

    // start room 2
    await page.getByText('rooms').click()
    await page.getByText('add item').click()

    // width
    await page.getByLabel('width').clear()
    await page.getByLabel('width').click()
    await page.keyboard.type('2000', { delay: 100 })

    // height
    await page.getByLabel('height').clear()
    await page.getByLabel('height').click()
    await page.keyboard.type('500', { delay: 100 })

    // room label
    await page.getByLabel('label').clear()
    await page.getByLabel('label').click()
    await page.keyboard.type('Test room 2', { delay: 100 })

    // room background color
    await page.getByLabel('background').fill('#a7a7a7')
    const ENEMIES_RENDER_FLAG = '3000'
    await page.getByLabel('progresses to active').fill(ENEMIES_RENDER_FLAG)

    // conect room 2 to room 1
    await page.getByText('loaders').click()
    await page.getByText('add item').click()
    await page.getByLabel('room to load').fill('1')
    await page.getByLabel('type').selectOption('bottom-loader')

    // enemy 1
    await page.getByText('enemies').click()
    await page.getByText('add item').click()
    await page.getByLabel('x0').fill('20')
    await page.getByLabel('y0').fill('75')
    await page.getByLabel('virus').selectOption('blue')
    await page.getByLabel('has loot').check()
    await page.getByLabel('name').selectOption('bluevaccine')
    await page.getByLabel('loot amount').fill('1')
    await page.getByLabel('render progress').fill(ENEMIES_RENDER_FLAG)

    // enemy 2
    await page.getByText('add item').click()
    await page.getByLabel('x0').fill('20')
    await page.getByLabel('y0').fill('150')
    await page.getByLabel('virus').selectOption('blue')
    await page.getByLabel('has loot').check()
    await page.getByLabel('name').selectOption('bandage')
    await page.getByLabel('loot amount').fill('1')
    await page.getByLabel('render progress').fill(ENEMIES_RENDER_FLAG)

    // enemy 3
    await page.getByText('add item').click()
    await page.getByLabel('x0').fill('20')
    await page.getByLabel('y0').fill('225')
    await page.getByLabel('virus').selectOption('blue')
    await page.getByLabel('render progress').fill(ENEMIES_RENDER_FLAG)

    // adding the note
    await page.getByText('interactables').click()
    await page.getByText('add item').click()
    await page.getByLabel('type').selectOption('note')
    await page.getByLabel('heading').fill('Test heading')
    await page.getByLabel('description').fill('test description')
    const NOTE_DATA = 'this is a sample data'
    await page.getByLabel('data').fill(NOTE_DATA)
    const POPUP_RENDER_FLAG = '400'
    await page.getByLabel('on examine progress to active').fill(POPUP_RENDER_FLAG)
    await page.getByLabel('kill all').fill(ENEMIES_RENDER_FLAG)
    await page.getByLabel('left').fill('20')
    await page.getByLabel('top').fill('275')

    // start shop
    await page.getByText('shop').click()
    // add weapon to shop
    await page.getByText('add item').click()
    const SHOP_WEAPON = 'benellim4'
    await page.getByLabel('item').selectOption(SHOP_WEAPON)
    await page.getByLabel('render progress').fill(SHOP_WEAPON_RENDER_FLAG)

    // add ammo to shop
    await page.getByText('add item').click()
    const AMMO = 'shotgunShells'
    await page.getByLabel('item').selectOption(AMMO)
    await page.getByLabel('render progress').fill(SHOP_WEAPON_RENDER_FLAG)

    // add popup
    await page.getByText('popups').click()
    await page.getByText('add item').click()
    const POPUP_CONTENT = 'This is a test message'
    await page.getByText('message').fill(POPUP_CONTENT)
    await page.getByText('render progress').fill(POPUP_RENDER_FLAG)
    const DIALOGUE_RENDER_FLAG = '4000'
    await page.getByText('progresses to active').fill(DIALOGUE_RENDER_FLAG)
    const POPUP_DURATION = '3000'
    await page.getByText('duration (ms)').fill(POPUP_DURATION)

    // add dialogue
    await page.getByText('dialogues').click()
    await page.getByText('add item').click()
    const DIALOGUE_CONTENT = 'This is a test dialogue'
    await page.getByText('message').fill(DIALOGUE_CONTENT)
    await page.getByText('render progress').fill(DIALOGUE_RENDER_FLAG)
    const DIALOGUE_DURATION = '3000'
    await page.getByText('duration (ms)').fill(DIALOGUE_DURATION)

    // start play testing
    await page.getByText('play').click()
    // start moving to right and bottom
    await page.keyboard.down('KeyS')
    await page.keyboard.down('KeyD')
    await page.waitForTimeout(700)
    // pickup coin
    await page.keyboard.press('KeyF')
    await page.waitForTimeout(300)
    // stop moving
    await page.keyboard.up('KeyS')
    await page.keyboard.up('KeyD')
    // interact with the shop
    await page.keyboard.press('KeyF')
    await page.waitForTimeout(2000)
    // weapon must be visible
    expect(page.locator(`[name="${SHOP_WEAPON}"]`)).toBeVisible()
    // ammo must be visible
    expect(page.locator(`[name="${AMMO}"]`)).toBeVisible()

    // buy weapon
    await page.locator(`[name="${SHOP_WEAPON}"]`).click()
    await page.waitForTimeout(2000)
    await page.locator('.popup-confirm').click()
    // check shop to confirm the weapon does not exist
    expect(page.locator(`[name="${SHOP_WEAPON}"]`)).toHaveCount(0)
    await page.waitForTimeout(2000)

    // buy ammo
    await page.locator(`[name="${AMMO}"]`).click()
    await page.waitForTimeout(2000)
    await page.locator('.popup-confirm').click()
    // check the shop to confirm there are no ammo left
    expect(page.locator(`[name="${AMMO}"]`)).toHaveCount(0)
    await page.waitForTimeout(2000)

    // navigate to sell tab
    await page.getByText('sell').click()
    // the weapon and the ammo must be visible since we just bought them
    expect(page.locator(`[name="${SHOP_WEAPON}"]`)).toBeVisible()
    expect(page.locator(`[name="${AMMO}"]`)).toBeVisible()
    await page.waitForTimeout(2000)

    // navigate to upgrade tab
    await page.getByText('upgrade').click()
    // opening stats for upgrade
    await page.locator(`[name="${SHOP_WEAPON}"]`).click()
    // upgrading damage
    await page.getByText('damage').click()
    await page.waitForTimeout(2000)
    await page.locator('.popup-confirm').click()
    // check the levels after the 1st upgrade
    expect(page.getByText('lvl.3')).toHaveCount(1)
    expect(page.getByText('lvl.1')).toHaveCount(4)

    // upgrading damage again
    await page.getByText('damage').click()
    await page.waitForTimeout(2000)
    await page.locator('.popup-confirm').click()
    // check the levels after the 2nd upgrade
    expect(page.getByText('lvl.4')).toHaveCount(1)
    expect(page.getByText('lvl.1')).toHaveCount(4)
    await page.waitForTimeout(2000)

    // leave shop
    await page.keyboard.press('Escape')
    // open inventory
    await page.keyboard.press('Tab')
    // check the bought items in the inventory
    expect(page.locator(`[name="${SHOP_WEAPON}"]`)).toBeVisible()
    expect(page.locator(`[name="${AMMO}"]`)).toBeVisible()
    await page.waitForTimeout(2000)
    // open examine modal
    await page.locator(`[name="${SHOP_WEAPON}"]`).click()
    await page.getByText('examine').click()
    expect(page.getByText('lvl. 3')).toHaveCount(1)
    expect(page.getByText('lvl. 1')).toHaveCount(4)
    await page.waitForTimeout(2000)
    // quit examine modal
    await page.keyboard.press('Escape')
    // quit inventory
    await page.keyboard.press('Escape')
    // equip weapon
    await page.mouse.wheel(0, 100)
    // start moving up and left
    await page.keyboard.down('KeyW')
    await page.keyboard.down('KeyA')
    // start sprinting
    await page.keyboard.down('ShiftLeft')
    await page.waitForTimeout(1000)
    // stop moving left
    await page.keyboard.up('KeyA')
    await page.waitForTimeout(250)
    // reload the weapon
    await page.keyboard.down('KeyR')
    // stop sprinitng
    await page.keyboard.up('ShiftLeft')
    // stop moving up
    await page.keyboard.up('KeyW')
    // check if there are three enemies in the room
    expect(page.locator('.enemy')).toHaveCount(3)
    // no note should be available in the room
    expect(page.locator('[name="note"]')).toHaveCount(0)
    await page.waitForTimeout(5000)
    // enter aim mode
    await page.mouse.down({ button: 'right' })
    const box = await page.locator('.enemy').first().boundingBox()
    if (box) {
        // get the coordinates of the enemy
        const { x, y, width, height } = box
        const enemyX = x + width / 2
        const enemyY = y + height / 2
        // aim to the enemies
        await page.mouse.move(enemyX, enemyY)
        // shooting enemies
        await page.mouse.down({ button: 'left' })
        await page.waitForTimeout(10000)

        // check if all the 3 enemies are dead
        expect(page.locator('.dead')).toHaveCount(3)
        // note should be rendered since all enemies are dead
        expect(page.locator('[name="note"]')).toBeVisible()

        // stop shooting and aiming
        await page.mouse.up({ button: 'right' })
        await page.mouse.up({ button: 'left' })

        // cheking if the blue virus icon exists on the page
        expect(page.locator(`[src="/assets/images/bluevirus.png"]`)).toBeVisible()

        // checking the healthbar based on width percentage
        const style = await page.locator('.health').getAttribute('style')
        const health = Number(style?.replace('width:', '').replace('%;', ''))
        expect(health).toBeLessThan(100)

        //pickup bandage and blue vaccine
        await page.keyboard.down('KeyW')
        await page.waitForTimeout(100)
        await page.keyboard.up('KeyW')
        await page.keyboard.press('KeyF')
        await page.waitForTimeout(20)
        await page.keyboard.press('KeyF')

        // open inventory
        await page.keyboard.press('Tab')

        // bandage and blue vaccine must exist in the inventory
        expect(page.locator('[name="bandage"]')).toBeVisible()
        expect(page.locator('[name="bluevaccine"]')).toBeVisible()

        // using the blue vaccine
        await page.locator(`[name="bluevaccine"]`).click()
        await page.getByText('use').first().click()
        await page.keyboard.press('Escape')

        // no virus icons should be visible now
        expect(page.locator(`[src="/assets/images/bluevirus.png"]`)).toHaveCount(0)
        await page.waitForTimeout(2000)

        // heal
        await page.keyboard.press('KeyH')

        // checking the health since we've just healed
        const newStyle = await page.locator('.health').getAttribute('style')
        const newHealth = Number(newStyle?.replace('width:', '').replace('%;', ''))
        expect(newHealth).toBeGreaterThan(health)
        await page.waitForTimeout(2000)
        await page.keyboard.down('KeyW')
        await page.waitForTimeout(500)
        await page.keyboard.up('KeyW')
        await page.keyboard.press('KeyF')
        await page.keyboard.press('Tab')
        await page.locator('[name="note"]').click()
        await page.getByText('examine').click()
        expect(page.getByText(NOTE_DATA)).toBeVisible()
        await page.waitForTimeout(2000)
        // exit note examination
        await page.keyboard.press('Escape')
        // exit inventory
        await page.keyboard.press('Escape')
        // popup showing
        expect(page.getByText(POPUP_CONTENT)).toBeVisible()
        await page.waitForTimeout(Number(POPUP_DURATION) + 100)
        // popup disappear and show dialogue
        expect(page.getByText(POPUP_CONTENT)).toHaveCount(0)
        expect(page.getByText(DIALOGUE_CONTENT)).toBeVisible()
        await page.waitForTimeout(Number(DIALOGUE_DURATION) + 100)
        // dialogue disappear
        expect(page.getByText(DIALOGUE_CONTENT)).toHaveCount(0)
    }
})

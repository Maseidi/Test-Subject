import { getGunDetails, isGun } from '../../gun-details.js'
import { GunDrop } from '../../interactables.js'
import { lootMap } from '../../loot-manager.js'
import { KeyLoot, Loot, NoteLoot, RANDOM, SingleLoot } from '../../loot.js'
import { getAttributesEl } from '../elements.js'
import { autocomplete, checkbox, input } from './shared.js'

export const manageLootAttribute = (model, reRenderCallback, canHaveKeyAsLoot = false) => {
    const { 'loot-name': name, 'loot-amount': amount, 'loot-active': active, 'loot-deactive': deactive } = model
    getAttributesEl().append(
        checkbox(
            'has loot',
            name,
            value => {
                resetAllLootValues(model)
                if (value) {
                    model['loot-amount'] = 1
                    model['loot-name'] = RANDOM
                }
                reRenderCallback()
            },
            'Set if a loot will be appeared if you destroy this resource',
        ),
    )

    if (model['loot-name']) {
        getAttributesEl().append(
            autocomplete(
                'name',
                name.includes('key') ? 'key' : name,
                value => {
                    let loot = findLoot(value, model)
                    if (!loot) return
                    resetAllLootValues(model)
                    model['loot-amount'] = loot.amount
                    model['loot-name'] = loot['loot-name']
                    model['loot-active'] = loot.progress2Active
                    model['loot-deactive'] = loot.progress2Deactive
                    if (value === 'note') {
                        model['note-data'] = loot.data
                        model['note-code'] = loot.code
                        model['note-heading'] = loot.heading
                        model['note-description'] = loot.description
                    } else if (value === 'key') {
                        model['key-code'] = loot.code
                        model['key-heading'] = loot.heading
                        model['key-unlocks'] = loot.unlocks
                        model['key-description'] = loot.description
                    }
                    reRenderCallback()
                },
                Array.from([
                    { heading: 'random', name: 'random' },
                    { heading: 'note', name: 'note' },
                    ...[...lootMap.entries()].map(([name, Instance]) => ({
                        heading: new Instance().heading,
                        name: name,
                    })),
                    ...[...getGunDetails().keys()].map(gunName => new GunDrop(0, 0, gunName, 0, 1, 1, 1, 1, 1)),
                    ...(canHaveKeyAsLoot ? [{ heading: 'key', name: 'key' }] : []),
                ]).map(item => ({ label: item.heading || item.name, value: item.name })),
                'Select what the type of the loot is with the options available',
            ),
        )

        if (!isGun(name) && name !== 'note' && !name.includes('key') && name !== RANDOM) {
            getAttributesEl().append(
                input(
                    'loot amount',
                    amount,
                    value => (model['loot-amount'] = value),
                    'number',
                    Number.MAX_SAFE_INTEGER,
                    1,
                    null,
                    'Set how many of the loot should be in the pack',
                ),
            )
        }

        if (name === 'note') {
            const {
                'note-heading': heading,
                'note-description': description,
                'note-data': data,
                'note-code': code,
            } = model
            getAttributesEl().append(
                input(
                    'note heading',
                    heading,
                    value => (model['note-heading'] = value),
                    'text',
                    null,
                    null,
                    null,
                    'The heading of the note that will be visible when interacting with it (After being examined)',
                ),
            )

            getAttributesEl().append(
                input(
                    'note description',
                    description,
                    value => (model['note-description'] = value),
                    'text',
                    null,
                    null,
                    null,
                    'A short description of the note that will be visible when interacting with it (After being examined)',
                ),
            )

            getAttributesEl().append(
                input(
                    'note data',
                    data,
                    value => (model['note-data'] = value),
                    'textarea',
                    null,
                    null,
                    null,
                    'Insert the data that the peace of paper will reveal to the player. If you wish to add a code in the text of the note, first set a name for the <b>code</b> property of the note, and the use <b>PLACE_CODE_HERE</b> in the note data so that the generated code will be revealed at the desired position',
                ),
            )

            getAttributesEl().append(
                input(
                    'note code',
                    code,
                    value => (model['note-code'] = value),
                    'text',
                    null,
                    null,
                    null,
                    'The code used for some doors. This property <b>MUST</b> be equal to the door code property of the desired doors. Keep in mind, <b>PLACE_CODE_HERE MUST</b> be provided in the data',
                ),
            )
        }

        if (name.includes('key')) {
            const {
                'key-heading': heading,
                'key-description': description,
                'key-unlocks': unlocks,
                'key-code': code,
            } = model
            getAttributesEl().append(
                input(
                    'key heading',
                    heading,
                    value => (model['key-heading'] = value),
                    'text',
                    null,
                    null,
                    null,
                    'The heading of the key that will be visible when interacting with it',
                ),
            )

            getAttributesEl().append(
                input(
                    'key description',
                    description,
                    value => (model['key-description'] = value),
                    'text',
                    null,
                    null,
                    null,
                    'A short description of the key that will be visible when interacting with it',
                ),
            )

            getAttributesEl().append(
                input(
                    'key unlocks',
                    unlocks,
                    value => (model['key-unlocks'] = value),
                    'textarea',
                    null,
                    null,
                    null,
                    'Doors will be opened by this key if they have the same <b>key</b> property as this value',
                ),
            )

            getAttributesEl().append(
                input(
                    'key code',
                    code,
                    value => {
                        model['key-code'] = value
                        model['loot-name'] = `key-${value}`
                    },
                    'number',
                    15,
                    1,
                    null,
                    'Select the shape of the key',
                ),
            )
        }

        getAttributesEl().append(
            input(
                'loot progress to active',
                active,
                value => (model['loot-active'] = value),
                'number',
                null,
                null,
                null,
                'The progress flag that will be activated if the player picks up this item',
            ),
        )

        getAttributesEl().append(
            input(
                'loot progress to deactive',
                deactive,
                value => (model['loot-deactive'] = value),
                'number',
                null,
                null,
                null,
                'The progress flag that will be deactivated if the player picks up this item',
            ),
        )
    }
}

const resetAllLootValues = model => {
    resetKeyLootValues(model)
    resetNoteLootValues(model)
    model['loot-name'] = null
    model['loot-amount'] = null
    model['loot-active'] = null
    model['loot-deactive'] = null
}

const resetKeyLootValues = model => {
    model['key-code'] = null
    model['key-heading'] = null
    model['key-unlocks'] = null
    model['key-description'] = null
}

const resetNoteLootValues = model => {
    model['note-data'] = null
    model['note-code'] = null
    model['note-heading'] = null
    model['note-description'] = null
}

const findLoot = (name, src) => {
    const { 'loot-amount': amount, 'loot-active': progress2Active, 'loot-deactive': progress2Deactive } = src
    const progress = { progress2Active, progress2Deactive }

    if (lootMap.has(name) || name === 'random') return new Loot(name, amount, progress)

    if (isGun(name)) return new SingleLoot(name, progress)

    if (name === 'note') return new NoteLoot('heading', 'description', 'data PLACE_CODE_HERE', 'dorm-code', progress)

    if (name === 'key') return new KeyLoot('heading', 'description', 1, 'unlocks', progress)
}

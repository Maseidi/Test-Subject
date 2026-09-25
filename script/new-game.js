import { buildCampaign } from './campaign-builder.js'

// Generate the route when a new run starts so weapon and crate rolls change.
export const createNewGameData = () => {
    const campaign = buildCampaign()
    return {
        rooms: JSON.stringify(campaign.rooms),
        walls: JSON.stringify(campaign.walls),
        loaders: JSON.stringify(campaign.loaders),
        enemies: JSON.stringify(campaign.enemies),
        interactables: JSON.stringify(campaign.interactables),
        popups: JSON.stringify(campaign.popups),
        dialogues: JSON.stringify(campaign.dialogues),
        shopItems: JSON.stringify(campaign.shopItems),
        passwordNames: campaign.passwordNames,
    }
}

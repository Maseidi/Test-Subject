# Test Subject agent guide

## Project shape

This is a vanilla JavaScript top-down shooter. The browser entry point is `index.html`; game modules live in `script/`, styles in `style/`, and runtime media in `assets/`. It uses native ES modules and has no build step or automated package-script test suite.

## Current game design

- The campaign has 50 generated rooms. Room `n` owns `n + 5` enemies, and every enemy is level 2.5. Room 50 contains the campaign boss.
- A room locks on entry and immediately spawns one enemy. Remaining enemies spawn one at a time at one-second intervals from deterministic room spawn points, preferring the point farthest from the player. Both doors open only after every room enemy is dead.
- Completing a room restores health, stamina, all weapon ammunition, grenades, and flashbangs, then writes the single autosave used by Continue.
- Progress uses descriptive flags such as `ROOM_4_COMBAT_ACTIVE` and `ROOM_4_CLEARED`. Do not reintroduce numeric render-progress thresholds or waves.
- Player maximum health is 300. Sprinting becomes available again at 5% stamina. Health regenerates by 10 HP each second after five seconds without damage. Poison expires after ten seconds.
- Fixed weapon slots are: 1 Mauser/pistol (red), 2 Benelli M4/shotgun (blue), 3 Steyr SSG 69/rifle (yellow), 4 MP5K/SMG (green), and 5 Revolver/magnum (purple). Matching an enemy color deals 10x damage; a mismatch deals 0.1x.
- Grenades and flashbangs are built into the player and use G and Z. They are not inventory items or drops.
- Enemy deaths have a 1% total chance to drop either full health or maximum ammunition. Pickup is automatic on collision.
- Enemies and the player do not block one another. Walls and closed doors must always block enemies. Enemy pursuit uses projected player movement only when the projection remains inside the room and has a clear wall-free line.
- The main menu is intentionally static: its title and options appear immediately without entrance, flicker, or underline animations.

## Important modules

- `script/campaign-builder.js`: deterministic room geometry, spawn points, enemy roster, and doors.
- `script/progress-manager.js`: interval spawning, room completion, refills, progress flags, and autosave trigger.
- `script/room-loader.js`: room/door/wall rendering and runtime enemy placement.
- `script/enemy/service/abstract/path-finding.js`: wall line tests and rectangular-obstacle routing.
- `script/enemy/service/abstract/movement.js`: final collision-safe enemy displacement.
- `script/enemy/service/abstract/notification.js`: current-player versus predicted-destination target selection.
- `script/loadout.js`, `script/gun-details.js`, and `script/weapon-manager.js`: fixed loadout and combat actions.
- `script/data-manager.js`: the single autosave/Continue state.

## Removed systems

Inventory, stash, shopping, vending machines, computers, item loot, manual healing items, dialogue, notes, keys, vaccines, passwords, room names, survival mode, the map maker, save slots, Load Game, and Credits were deliberately removed. Do not restore their modules, UI, storage fields, or assets unless explicitly requested. The bandage and SMG-ammo images remain only as power-up icons.

## Change and verification conventions

- Preserve native ES-module imports and explicit named exports.
- Keep game state behind the accessors in `script/variables.js`; keep DOM references behind `script/elements.js`.
- Generated rooms and spawn locations must not intersect walls. Interior walls must remain separated because navigation treats them as rectangles.
- Path planning chooses the route, but movement collision checks are the final authority and must prevent tunnelling through walls at every supported FPS.
- After gameplay changes, verify module imports/assets, start the game in a browser, and exercise the affected behavior. Campaign-generation checks should cover all 50 rooms.

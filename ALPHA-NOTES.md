# Cavegame Reborn Closed Alpha 0.4.13 — Craft Max, Movement & Compass

- Online walking speed increases slightly from 340 to 350 world units per second. Sneak, flight and the offline game retain their existing speeds.
- Shift-click a recipe in the crafting shop to craft the maximum your resources and inventory can support. Normal click still crafts once. Costs, research discounts/yields, gold accounting and item limits remain server-authoritative; one bulk request avoids flooding crafting packets.
- A cooling-down Gold Compass uses the native on-screen announcement, with remaining seconds, instead of blue chat. The account-wide ten-minute cooldown and saved readiness time remain unchanged.
- Community top-ten/bot filtering, button placement and menu focus fixes from 0.4.12 are retained. Same world, season, identities, inventories, XP rewards and permissions; fresh complete backup before the private server update.
- Local acceptance: 463/463 regressions, signed player inventory/authorization checks, eleven real packaged Edge checks including normal/Shift-click and the compass announcement without chat, and the signed Linux server preflight.
- Windows release checks cover signed 0.4.12 → 0.4.13 automatic updating, MSI installation/upgrade/uninstall, real normal/Shift-click crafting, gameplay, session recovery and canonical installer download before stable promotion.
- Existing installed players receive the update by closing and reopening their normal shortcut while online. No reinstall or identity replacement is required.

---

# Cavegame Reborn Closed Alpha 0.4.12 — Community & Menu Fixes

- Community sits directly below Gold Empire, clear of the native EXP bar and gold HUD.
- Closing Community or Gold Empire returns keyboard focus to the game. Space no longer reopens the menu.
- Community keeps only the top ten entries per kills, mining and lifetime-gold board. Exact generated CI/test-bot labels are excluded. Native online HUD rankings and all accounts/progress remain intact.
- Same world and season; no XP/balance/inventory/permission changes or account deletion. The private Oracle deployment passed HTTPS readiness and preserved all 23 accounts and 14 saved player records, with a fresh complete backup.
- Local acceptance: 458/458 regressions, signed packaged-client authorization/assets, seven actual Edge menu/layout checks, and the signed Linux server HTTP preflight.
- Windows release checks verify the signed 0.4.11 → 0.4.12 update, MSI install/upgrade/uninstall, agreement/login/gameplay, native HUD, menu focus/layout and session recovery before stable promotion.
- Existing installed players receive the signed update when they reopen their normal game shortcut with internet access. No reinstall or new identity is needed.

---

# Cavegame Reborn Closed Alpha 0.4.11 — Gold HUD & Classic Content

- Restores the original live gold leaderboard and shop balance: top five online players, with your row red at its real rank; if below fifth, your own rank appears beneath the top five.
- Original enchantment caps restored: Efficiency/Sharpness/Protection/Power V; Fortune/Looting/Pickpocket/Web Cutter/Grind III; Rush/Burst/Shotgun II; Infinity I. Burst II limits Shotgun to I. These caps are also enforced on commands, saved gear and item transfers.
- Experimental Aethersteel resource/ore/tools/armor, Arc Launcher/Charges and 15 custom enchantments removed from Online. Existing experimental ore becomes stone. Original gear, accounts, balances, world seed and Season 2 are preserved; the server has a complete pre-update backup. No season wipe.
- The player package excludes experimental artwork. Shared source assets remain preserved for the offline build and historical releases.
- Classic caps are corroborated by the [community enchantment reference](https://cavegame-io.fandom.com/wiki/Enchantments); the original private server's roll probabilities remain unavailable.
- 437 local regression tests and 13 Linux cloud staging tests passed. [Clean Windows release checks](https://github.com/alexaa1212ss/game/actions/runs/39181879282) also passed: native install, signed 0.4.10 → 0.4.11 automatic update, agreement/login/gameplay, native HUD/shop balance, session recovery, identity-preserving uninstall, and canonical installer download/hash/install. Physical remote testers still need to confirm their experience.
- The original HUD's integer wire format saturates displayed balances at 2,147,483,647; the Gold Empire dashboard retains exact large balances. Server transactions remain authoritative.

---

# Cavegame Reborn Closed Alpha 0.4.10 — Stable Hosting & Launcher Recovery

- Press Escape three times quickly in the launcher to reveal Backup server connection. Explicitly enable the address for that connection; Use official server clears it. The override is not retained across launcher restarts. HTTPS, identity protection, agreement enforcement and the official signed updater remain required.
- Backup address: https://reborn-alpha.147-224-150-14.sslip.io . Use the hostname for a valid HTTPS certificate, rather than the bare IP.
- The Alpha now runs on a separate Oracle Chicago VM with a reserved address and HTTPS/WSS. It starts automatically after a VM reboot and does not require the developer PC to stay online.
- Season 2, V5 terrain, accounts, inventories, research, clans, owner permissions and Tester grants are preserved. No world reset.
- The launcher retains the newest verified server directory across overlapping old/new launcher processes. A late response cannot restore an older cached address.
- A second signed-directory retrieval route uses GitHub's API when its raw-file CDN is unavailable. Both routes require the existing release signature.
- An unexpected HTML server response produces a useful reconnect message instead of a JSON syntax error.
- Existing installations receive the signed player update through their normal shortcut. Identities, settings and progress are preserved. Offline or network-blocked PCs cannot be updated remotely while unreachable.

The player installer contains no server implementation/data, moderation or WorldEdit tools, private identity or signing keys. Application updates remain signature/hash verified. Project binaries remain unsigned by Authenticode and Windows reputation prompts may appear; never disable Windows security protections.

Hosting currently uses expiring trial credits. Availability and capacity are not guaranteed. The 60-player configuration is not a claim of a verified 60-player cloud load test.

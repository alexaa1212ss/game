# Playing Cavegame Reborn

[**Cavegame: Reborn — Download Closed Alpha**](https://github.com/alexaa1212ss/game/releases/latest/download/CavegameRebornSetup.msi) · [Release notes](../ALPHA-NOTES.md) · [Report a bug](https://github.com/alexaa1212ss/game/issues)

## First launch

1. Download the official Windows MSI above and run it.
2. Choose **Install**, then **Play Cavegame Reborn**.
3. Read the Closed Alpha agreement and explicitly select **I AGREE**.
4. Enter your nickname and press **Play**.

No Node.js, Git, terminal, server download or ZIP extraction is required. Declining the agreement prevents login/play. There is no account approval queue or invite-code requirement.

The project installer/launcher are not yet Authenticode-signed, so Windows reputation warnings may appear. Do not disable security software or add exclusions.

## Already installed

Close all Reborn windows and reopen your usual shortcut. The launcher checks for compatible signed updates and the official server address. Your protected identity, settings and server-saved progress are preserved.

Your PC must be online and able to reach GitHub to receive an update. Closing the app does not cause an offline PC to update in the background. Share the stable download link above rather than re-uploading an older installer.

## Hosting

The game runs on Oracle Chicago independently of the developer’s laptop. Your laptop can be asleep or switched off without stopping the cloud server. Automatic startup after a VM reboot was tested.

The host currently uses expiring Oracle trial credits. Availability is not guaranteed. The two-week test plan is a budget estimate, not a configured automatic shutdown; the trial’s actual expiry still applies. Existing Season 2 / V5 progress was preserved during migration.

## Connection help

First close Reborn, reopen the usual shortcut and press Play. If an error remains, note the exact message and version. “Fetch failed” alone does not identify a stale cache or prove a latency/routing cause.

### Backup server menu — player 0.4.10 and newer

1. In the **launcher**, press **Escape three times quickly**.
2. Enter this address in **Backup server connection**:

   **`https://reborn-alpha.147-224-150-14.sslip.io`**

3. Check **Use this address for this connection**, then press **Play**.

**Use official server** clears the override. Restarting the launcher returns to automatic official discovery. This is a temporary gameplay destination; it cannot change the signed update feed or bypass the Alpha agreement, HTTPS, identity or server permissions.

The underlying IPv4 is `147.224.150.14`, but use the hostname above so its HTTPS certificate validates. No port number is needed; HTTPS/WSS use 443. A raw IP needs a certificate matching that IP.

If both automatic and manual connections fail, report the version, exact error and time. A manual address cannot fix an unavailable network or blocked endpoint. Do not delete your identity, recovery files or saves.

## XP and levels

Current game XP uses a flat **100 XP per level**. Higher levels do not become more expensive.

| Displayed level | Total XP threshold |
| :--- | ---: |
| 1 | 100 |
| 5 | 500 |
| 10 | 1,000 |
| 50 | 5,000 |
| 100 | 10,000 |

The displayed level is the whole-number part of total XP divided by 100. Moving from level 49 to 50 costs the same 100 XP as moving from level 0 to 1. Enchanting spends XP, so your displayed level can drop afterward. XP levels and Gold Empire ranks are separate progression systems.

## Keep your identity

Export an encrypted recovery file before replacing your PC. Keep it and its passphrase private. The server stores your inventory and progression; local identity files prove that account is yours.

Never publish private keys, recovery files, session tokens, account data or unredacted logs. Follow the current Alpha confidentiality agreement when sharing builds, links, unreleased media and private development information.

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

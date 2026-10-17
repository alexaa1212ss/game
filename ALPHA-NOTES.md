# Cavegame: Reborn — Closed Alpha 0.4.1

Connection recovery update. Existing installations update through the signed launcher channel; no reinstall or manual server address is required. Season 2 / V5 and player identities, inventories, progress and agreement receipts are preserved.

- Refresh the verified official server directory when opening the launcher, pressing Play, checking updates, and during launcher/game heartbeats.
- Signed directory cache retains the latest valid destination across launches, rejects older/conflicting records and forgery, and bypasses stale intermediary caches.
- A new verified app version replaces an already-running older launcher instead of silently opening its stale process.
- A moved host is reported clearly; return to the launcher and press Play to connect to its new verified address. An in-progress login retries once only when a newly signed directory changes the destination.
- Host-only tools log failures, retry unexpected exits with a limit, verify local/public server identity, and publish the signed directory automatically after one-time owner GitHub authorization. Those tools and credentials are excluded from the player package.
- Existing V5 generation, streamed terrain privacy, mining/inventory/UI fixes, and explicit Closed Alpha agreement gate remain in place. Anyone may accept the current agreement and play; there is no tester allowlist.

Hosting still runs on the owner's PC through a temporary tunnel, so the PC and host window must remain running. GitHub hosts installers/updates, not the game simulation. Permanent 24/7 hosting and Authenticode signing remain outstanding. Never disable Windows security features.

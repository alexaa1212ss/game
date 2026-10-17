# Cavegame Reborn Closed Alpha 0.4.3

Session stability patch for ordinary players. Existing installations update automatically when the usual shortcut is opened. No reinstall or server-address entry is needed.

- Serialize login/session refresh and reuse an authenticated session instead of revoking it during overlapping game handshakes.
- Recover an expired session once, using the existing protected identity and agreement acceptance. Bans and other authorization failures remain enforced.
- Retire outdated game windows so they cannot refresh and invalidate a newer session.
- Initialize online interfaces with the authenticated account ID.
- Add bounded connection/input diagnostics to distinguish browser focus/input, packet delivery, server rejection and rendered state. No login keys, session tokens or chat contents are logged by this diagnostic.
- Preserve Season 2, V5 terrain, inventories, research and developer permissions. No world wipe or authority/rate-limit relaxation.

Reproduced the released 0.4.1 session race with a genuine ordinary-player fixture: overlapping login replies can leave the client holding a revoked token and produce the exact `Session expired. Reconnect through the launcher.` response. The patched test remains authorized. Historical evidence cannot establish every input stage on the remote tester PC; its movement/attack repair still requires the tester's own confirmation.

404/404 local regression tests passed, plus signed-package/agreement and native private-server checks. Windows installer/update and real-browser recovery acceptance are required by the release workflow before promotion.

The MSI is not yet Authenticode-signed; new-application SmartScreen reputation warnings remain possible. No Defender bypasses or exclusions are used. The temporary Alpha server currently runs on the developer's host PC and is available only while that host and tunnel run.

Automatic validated recovery bypasses the recovered beforeunload confirmation. Manual exits and denied recovery keep the normal guard. Server diagnostics remain on 0.4.2 with the same protocol and saved world.

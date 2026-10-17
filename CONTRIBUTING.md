# Contributing to Cavegame Reborn

Useful feedback includes a clear reproduction case, an accurate description of the result, and enough environment information to investigate.

## Report a bug

[Open an issue](https://github.com/alexaa1212ss/game/issues) and include:

- Player version and Windows version.
- Steps to reproduce the problem.
- Expected behavior and what happened instead.
- Whether the problem happens consistently.
- A relevant, redacted error message or screenshot if available.

For connection failures, mention roughly when the problem occurred. The alpha server currently depends on an operator PC and temporary tunnel.

## Protect your identity

Do not publish identity recovery files, private keys, session tokens, account data, or unredacted logs. Remove personal paths and identifiers from diagnostic material before posting it.

## Propose a change

For larger changes, describe the problem and proposed approach in an issue first. Keep pull requests focused, explain the resulting behavior, and describe the checks you ran.

Release tooling affects installation and updates. Changes to workflows, manifests, channels, and signing logic need careful review. Do not include private server files or signing material.

## Understand the build

Read the [engineering overview](docs/ENGINEERING.md). The public repository contains player distribution inputs and tooling, not the full private server source. Some scripts require a reconstructed payload and a Windows build environment.

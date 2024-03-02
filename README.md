# Multi IC Wallet Menu
## Version 0.6.0

A modular typescript react framework for a login menu that supports multiple internet computer login providers.

Currently Supported:

* Stoic
* Plug
* Internet Identity
* NFID

### Getting Setup:

You will need:

* DFX 0.15.1+
* Node 18 + NPM

### Clone and Setup:

This project comes with an automated setup function. If you have all of the correct tools configured, just run the commands below!

```
git clone https://github.com/cp-daniel-mccoy/multi-wallet-menu.git
cd multi-wallet-menu
npm run setup
```

### Manual Project Setup:

If for some reason that does not work, here are the manal commands:

```
npm install
npm audit fix
dfx start --clean --background
dfx deploy
dfx stop
```

### Dev/Production:

To open up a local development instance with vite:

Dev Mode:
```
npm run dev
```

To test a compiled build on a dedicated server:

Production Mode:
```
npm run serve
```

Author: Daniel McCoy

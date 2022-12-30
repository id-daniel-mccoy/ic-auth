# Multi IC Wallet Menu
## Version 0.4.0

A modular typescript react framework for a login menu that supports multiple internet computer login providers.

### Getting Setup:

You will need:

* DFX 0.10.0+
* Node 18 + NPM

### Clone and Install:

```
git clone https://github.com/cp-daniel-mccoy/multi-wallet-menu.git
cd multi-wallet-menu
npm install
```

### Project Setup:

```
dfx start --clean --background
dfx canister create --all
dfx build
```

### Dev/Production:

Dev Mode:
```
npm run dev
```

Production Mode:
```
npm run serve
```

Note: Make sure to stop your dfx replica when you are done testing. You can do this by runnning `dfx stop` in the root folder of your project.

Author: cp-daniel-mccoy

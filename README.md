<div align="center">
    <h3 style="font-size: 30px">Easy IC Login<h3>
    <h3 style="font-size: 24px">Version 0.8.2</h3>
</div>

<br>

A modular typescript react framework for a login menu that supports multiple internet computer login providers. This program comes wrapped with both UI elements and abstracted function calls to allow more complete integrations with ease.

Providers Currently Supported:

* Stoic
* Plug
* Internet Identity
* NFID

<br>

<h3 style="font-size: 24px" align="center">Using The NPM Package</h3>

<p align="center">If you are looking to use the NPM package version please follow these instructions:</p>

<br>

### Getting Setup:

```
npm install ic-auth && npm audit fix
```
<br>

### Build Your Login:

These steps are for creating your own simple login UI/UX using the modular functions. A more advanced design will be shown below.

<br>

#### Step 1 - Import:

Import the providers you want to support.

```ts
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from 'ic-auth';
```

<br>

#### Step 2 - Handle Your Login:

Create a function to trigger the login and catch the data afterwards. If you're using Plug, it requires a list of canister addresses that you plan to make calls to. This is only required for Plug so we will show that here.

```ts
const whitelist = ["oyjva-2yaaa-aaaam-qbaya-cai"];

const handleLogin = async() => {
    const userObject = await PlugLogin(whitelist);
    console.log(userObject);
    // Handle code will go here...
}
```

<br>

#### Step 3 - Attach To Your UI:

Take the login handler and attach it to a UI element of your choice.

```html
<button onClick={handleLogin}>Login</button>
```

<br>

#### Step 4 - Using The Login

After a successful login you should receive the `UserObject`, which looks like this:

```ts
type UserObject = {
    principal: string,
    agent: HttpAgent,
    provider: string
}
```

It can be used to create an actor for canister calls, display the user's principal address, or trigger code depending on the provider chosen. This example shows how to create an actor using the `CreateActor` function.

To create an actor you will need to pass in the canister address, the associated IDL, and the agent from the UserObject. The data we import here is included in the package and is just for a simple hello world canister.

```ts
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from 'ic-auth';
import { HelloIDL, CreateActor } from 'ic-auth';

const canisterID = "oyjva-2yaaa-aaaam-qbaya-cai";
const whitelist = ["oyjva-2yaaa-aaaam-qbaya-cai"];

const handleLogin = async() => {
    const userObject = await PlugLogin(whitelist);
    console.log(userObject);
    const actor = await CreateActor(userObject.agent, HelloIDL, canisterID);
    const result = await actor.hello();
    console.log(result);
    // Handle code will go here...
}
```

<br>

## Login Menu Example Project

These are instructions for setting up and running the example version of this package. This will show a finished menu UI template that can be used or styled to your liking.

### Getting Setup:

You will need:

* DFX 0.15.1+
* Node 18 + NPM

### Clone and Setup:

This project comes with an automated setup function. If you have all of the correct tools configured, just run the commands below.

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

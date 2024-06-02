# IC-Auth
## Version 0.9.1

<br>

Modular, interoperable tooling designed to make it easy for Internet Computer developers to integrate their favorite wallet providers. This repo serves as an npm package but also contains a pre-built template of a login menu.

Currently Supported:

* Stoic
* Plug
* Internet Identity
* NFID

<br>

## NPM Package Instructions:

If you are looking to use the NPM package version please follow these instructions:

### Getting Setup:

```
npm install ic-auth && npm audit fix
```

<br>

### Build Your Login:

These steps are for creating your own simple login UI/UX using the modular functions. A more advanced design will be shown below.

<br>

#### Step 1: Import

Import the providers you want to support.

```ts
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from 'ic-auth';
```

<br>

#### Step 2: Handle Your Login

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

#### Step 3: Attach To Your UI

Take the login handler and attach it to a UI element of your choice.

```html
<button onClick={handleLogin}>Login</button>
```

<br>

#### Step 4: Using The Login

After a successful login you should receive the `UserObject`, which looks like this:

```ts
type UserObject = {
    principal: string,
    agent: HttpAgent,
    provider: string
}
```

Tip: You can also import the type definitions for this package by adding `Types` to your import line.

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
    const actor = await CreateActor(userObject.agent!, HelloIDL, canisterID);
    const result = await actor.hello();
    console.log(result);
    // Handle code will go here...
}
```

Now you can style the elements, add more providers, or continue on to see a more complex and full featured example.

<br>

### Supporting Multiple Wallets

This example will bring you through the steps of building a login flow that supports multiple wallets.

<br>

#### Step 1: Basic Setup

Following steps 1 and 2 from above, start with importing the functions from the package, creating the canister whitelist, and making the handler. You will also need the type definitions for this.

```ts
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin, Types } from 'ic-auth';

const canisterID = "oyjva-2yaaa-aaaam-qbaya-cai";
const whitelist = ["oyjva-2yaaa-aaaam-qbaya-cai"];

const handleLogin = async() => {
    const userObject = await PlugLogin(whitelist);
    console.log(userObject);
    // Handle code will go here...
}
```

<br>

#### Step 2: Modify The Handler

Add a string argument that the handler can use to determine which login function to execute, then edit the handler to use it.

```ts
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin, Types } from 'ic-auth';
import { HelloIDL, CreateActor } from 'ic-auth';

const canisterID = "oyjva-2yaaa-aaaam-qbaya-cai";
const whitelist = ["oyjva-2yaaa-aaaam-qbaya-cai"];

const handleLogin = async(provider: string) => {
    let userObject: Types.UserObject = {
        principal: "Not Connected.",
        agent: undefined,
        provider: "N/A"
    };
    if (provider === "Plug") {
        userObject = await PlugLogin(whitelist);
    } else if (provider === "Stoic") {
        userObject = await StoicLogin();
    } else if (provider === "NFID") {
        userObject = await NFIDLogin();
    } else if (provider === "Identity") {
        userObject = await IdentityLogin();
    }
    console.log(userObject);
    const actor = await CreateActor(userObject.agent!, HelloIDL, canisterID);
    const result = await actor.hello();
    console.log(result);
    // Handle code will go here...
}
```

<br>

#### Step 3: Attach Your Login To The UI

Now that the login handler is designed for multiple possible inputs, the UI elements can selectively call their respective logins.

```js
<div className="myLoginMenu">
    <button onClick={async() => await handleLogin("Plug")}>Plug</button>
    <button onClick={async() => await handleLogin("Stoic")}>Stoic</button>
    <button onClick={async() => await handleLogin("NFID")}>NFID</button>
    <button onClick={async() => await handleLogin("Identity")}>Identity</button>
</div>
```

<br>

### Login Menu Example Project

These are instructions for setting up and running the example version of this package. This will show a finished menu UI template that can be used or styled to your liking.

### Getting Setup:

You will need:

* DFX 0.15.1+
* Node 18 + NPM

<br>

### Clone and Setup:

This project comes with an automated setup function. If you have all of the correct tools configured, just run the commands below.

```
git clone https://github.com/cp-daniel-mccoy/multi-wallet-menu.git
cd multi-wallet-menu
npm run setup
```

<br>

### Manual Project Setup:

If for some reason that does not work, here are the manal commands:

```
npm install
npm audit fix
dfx start --clean --background
dfx deploy
dfx stop
```

<br>

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

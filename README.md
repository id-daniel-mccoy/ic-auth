# IC-Auth
## Version 1.1.0


<br>

**Welcome to IC-Auth! The easiest way to integrate Plug, Stoic, Internet Identity, and NFID authentication for your Internet Computer apps.**

<br>

## 📌 What can you do with IC-Auth?

**IC-Auth** is a lightweight, modular TypeScript package that helps developers plug wallet authentication directly into their DFINITY dapps.\
It gives you simple, type-safe helpers for the **most common IC wallets**, so you can focus on your frontend and canister logic to get up and running quickly.

<br>

## ✅ **Currently Supported Wallets**

- **Plug Wallet**
- **Internet Identity**
- **NFID**
- **Stoic**

---

## ⚠️ **Known Issues**

- **Stoic:** A known issue with cookie storage affects Stoic logins in some browsers. This will be addressed in a future Stoic release.
- **NFID:** Supports anonymous mode only for now — so canister calls work, but **payments and session delegation** are limited. This will be expanded soon.

---

## 🚀 **What’s New In Verson 1.x**

- Fully modernized: Uses **latest DFINITY agent APIs** (`Agent` instead of `HttpAgent`).
- Dependencies updated to **latest stable versions**.
- **No more embedded frontend** — the package is framework-agnostic.
- **Cleaner exports:** `UserObject` type is inline.
- Local dev now supported for all providers via `host` parameter.
- Removed legacy `hello` canister and embedded assets.
- Designed to pair cleanly with any custom canister IDL.

---

## 📦 **Installation**

```bash
npm install ic-auth
```

---

## ✨ **Build Your Login**
These steps are for creating your own simple login UI/UX using the modular functions. A more advanced design will be shown below.


### ✅ **Step 1: Import**

Import the login functions you want and the universal `UserObject` type:

```ts
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin, CreateActor, UserObject } from "ic-auth";
```

---

### ✅ **Step 2: Handle Your Login**

Create a function to trigger the login and catch the data afterwards. If you're using Plug, it requires a list of canister addresses that you plan to make calls to. This is only required for Plug so we will show that here.

You will also need to define the host URL that the authentication will be looking towards for login. Again, if not using Plug you only need
to toss the host as a string.

```ts
const canisterID = "oyjva-2yaaa-aaaam-qbaya-cai";
const whitelist = [canisterID];
const host = "https://icp0.io" // "https://localhost:XXXX" for local dfx instances.

const handleLogin = async() => {
    const userObject = await PlugLogin(whitelist, host);
    console.log(userObject);
    // Handle code will go here...
}
```

---

### ✅ **Step 3: Attach To Your UI**

Take the login handler and attach it to a UI element of your choice.

```html
<button onClick={handleLogin}>Login</button>
```

---

### ✅ **Using The Login - What is a UserObject?**

After a successful login you should receive the `UserObject`, which looks like this:

```ts
type UserObject = {
    principal: string,
    agent: Agent | undefined,
    provider: string
}
```

Reminder: You can import this specific type by adding `UserObject` into your imports directly from `ic-auth`.

The `UserObject` can be used to create an actor for canister calls, display the user's principal address, or trigger code depending on the provider chosen. This next example shows how to create an actor using the `CreateActor` function.

To create an actor you will need to pass in the canister address you wish to call, the associated canister interface description language (IDL) file, and the agent from the UserObject. You can generate the interfaces folder by running `dfx generate` after building your backend canister, then import from that folder.

```ts
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin, UserObject, CreateActor } from 'ic-auth';
import { idlFactory as YourIDL } from "./interfaces/your_canister";

const canisterID = "oyjva-2yaaa-aaaam-qbaya-cai";
const whitelist = [canisterID];
const host = "https://icp0.io"; // or your local dev host

const handleLogin = async() => {
    const userObject = await PlugLogin(whitelist, host);
    console.log(userObject);
    const actor = await CreateActor(userObject.agent!, YourIDL, canisterID);
    
    // Handle code will go here...
}
```

Now you can style the elements, add more providers, or continue on to see a more complex and full featured example.

---

## 🎛️ **Multi-Provider Login Example**

This example will bring you through the steps of creating a multi-wallet supported login menu.

---

### **1️⃣ Import + Define Everything**

```ts
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin, UserObject, CreateActor } from 'ic-auth';

const canisterID = "oyjva-2yaaa-aaaam-qbaya-cai";
const whitelist = [canisterID];
const host = "https://icp0.io"; // or your local dev host
```

---

### **2️⃣ Create a Unified Handler**

```ts
const handleLogin = async (provider: string) => {
  let user: UserObject = {
    principal: "Not Connected.",
    agent: undefined,
    provider: "N/A"
  };

  if (provider === "Plug") {
    user = await PlugLogin(whitelist, host);
  } else if (provider === "Stoic") {
    user = await StoicLogin(host);
  } else if (provider === "NFID") {
    user = await NFIDLogin(host);
  } else if (provider === "Identity") {
    user = await IdentityLogin(host);
  }

  console.log(user);

  const actor = await CreateActor(user.agent!, YourIDL, canisterID);
  // Interact with your canister here
};
```

---

### **3️⃣ Attach Buttons to Your UI**

```html
<div class="wallet-buttons">
  <button onclick="handleLogin('Plug')">Plug</button>
  <button onclick="handleLogin('Stoic')">Stoic</button>
  <button onclick="handleLogin('NFID')">NFID</button>
  <button onclick="handleLogin('Identity')">Internet Identity</button>
</div>
```

---

## 📚 **More Info & Resources**

- 🔌 **Plug Wallet:** [plugwallet.ooo](https://plugwallet.ooo/)
- 🔐 **NFID:** [nfid.one](https://nfid.one/)
- 🧊 **Stoic Wallet:** [stoicwallet.com](https://stoicwallet.com/)
- 🗝️ **Internet Identity:** [internetcomputer.org/internet-identity](https://internetcomputer.org/internet-identity/)
- 🧩 **Internet Computer Docs (AI Powered):** [internetcomputer.org/docs/home/](https://internetcomputer.org/docs/home/)
- 📌 **Mainnet Canisters:** [DFINITY Forum](https://forum.dfinity.org/t/where-can-i-find-the-canister-id-for-the-mainnet-ledger-canister/11599/2)

---

**Author:** [Daniel McCoy](https://danielmccoy.us/)\
**Twitter:** [@Real](https://x.com/RealDanMcCoy)[DanMcCoy](https://x.com/RealDanMcCoy)

---

Enjoy building on the Internet Computer 🚀

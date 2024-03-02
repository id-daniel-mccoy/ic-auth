import React, { useState } from "react"
import { ICWalletList } from "./components/ICWalletList";
import { HttpAgent } from "@dfinity/agent";
import "./assets/index.css";
import * as tests from "../index";
import * as hello from "./interfaces/hello";

export function MainPage() {

  const [user, setUser] = useState("Not Connected");
  const [provider, setProvider] = useState("None");

  const receiveFromChild = async(user: string) => {
    setUser(user);
  }

  const whitelist = new Array<string>();

  const testLogin = async(provider: string) => {
    let userObject : tests.types.UserObject = {
      principal: "Not Connected.",
      agent: undefined,
      provider: "N/A"
    };
    if (provider === "Stoic") {
      userObject = await tests.StoicLogin();
    } else if (provider === "Plug") {
      userObject = await tests.PlugLogin(whitelist);
    } else if (provider === "NFID") {
      userObject = await tests.NFIDLogin();
    } else if (provider === "Identity") {
      userObject = await tests.IdentityLogin();
    }
    const actor = await tests.CreateActor(userObject.agent as HttpAgent, hello.idlFactory, "oyjva-2yaaa-aaaam-qbaya-cai");
    const result = await (actor as any).hello();
    console.log("Non permissioned test: " + result);
    const permissionedResult = await (actor as any).permissionTest();
    console.log("Permissioned test: " + permissionedResult);
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Welcome!</h1>
      </div>
      <div className="content">
        <h3>Login</h3>
        <ICWalletList giveToParent={receiveFromChild} />
        <h5>Current User:</h5>
        <p className="data">{user}</p>
        <button onClick={async() => await testLogin("Plug")}>Plug</button>
        <button onClick={async() => await testLogin("Stoic")}>Stoic</button>
        <button onClick={async() => await testLogin("NFID")}>NFID - Test</button>
        <button onClick={async() => await testLogin("Identity")}>Identity - Test</button>
      </div>
    </div>
  )
}
import React, { useState } from "react"
import { StoicWallet as Stoic } from "./components/Stoic";
import { PlugWallet as Plug} from "./components/Plug";
import { InfinityWallet as Infinity} from "./components/Infinity";
import { InternetIdentity } from "./components/InternetIdentity";
import { NFID } from "./components/NFID";
import "./assets/index.css";

export function MainPage() {

  const [user, setUser] = useState("Not Connected");

  const changeUserAuth = async(user: string) => {
    setUser(user);
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Welcome!</h1>
      </div>
      <div className="content">
        <h3>Login</h3>
        <Stoic changeProvider={changeUserAuth}/>
        <Plug changeProvider={changeUserAuth}/>
        <Infinity changeProvider={changeUserAuth}/>
        <NFID changeProvider={changeUserAuth}/>
        <InternetIdentity changeProvider={changeUserAuth}/>
        <h5>Current User:</h5>
        <p className="data">{user}</p>
      </div>
    </div>
  )
}
import React, { useEffect, useState } from "react"
import { StoicWallet as Stoic } from "./components/Stoic";
import { PlugWallet as Plug} from "./components/Plug";
import { InfinityWallet as Infinity} from "./components/Infinity";
import { InternetIdentity } from "./components/InternetIdentity";

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
        <h3>Wallet Testing</h3>
        <Stoic changeProvider={changeUserAuth}/>
        <Plug changeProvider={changeUserAuth}/>
        <Infinity changeProvider={changeUserAuth}/>
        <InternetIdentity changeProvider={changeUserAuth}/>
        <p>User Logged In:</p>
        <p>{user}</p>
      </div>
    </div>
  )
}
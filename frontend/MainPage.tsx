import React, { useState } from "react"
import { ICWalletList } from "./components/ICWalletList";
import "./assets/index.css";

export function MainPage() {

  const [user, setUser] = useState("Not Connected");
  const [provider, setProvider] = useState("None");

  const receiveFromChild = async(user: string) => {
    setUser(user);
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
      </div>
    </div>
  )
}
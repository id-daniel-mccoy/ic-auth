import React, { useEffect, useState } from "react"
// @ts-ignore
import {StoicIdentity} from "ic-stoic-identity";
import {Actor, HttpAgent} from "@dfinity/agent";
import * as helloIDL from "./interfaces/hello";
import { Stoic } from "./components/Stoic";
import { PlugWallet as Plug} from "./components/Plug";
import { InfinityWallet as Infinity} from "./components/Infinity";

export function MainPage() {

  const filler = "This is content!";

  return (
    <div className="app">
      <div className="header">
        <h1>Welcome!</h1>
      </div>
      <div className="content">
        <p>{filler}</p>
        <Stoic />
        <Plug />
        <Infinity />
      </div>
    </div>
  )
}
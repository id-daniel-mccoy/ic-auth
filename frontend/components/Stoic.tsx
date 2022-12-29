import React, { useEffect, useState, useRef } from "react"
// @ts-ignore
import {StoicIdentity} from "ic-stoic-identity";
import {Actor, HttpAgent} from "@dfinity/agent";
import * as helloIDL from "../interfaces/hello";
import "../assets/plugWallet.css";

export function Stoic() {

  const [stoicButtonText, setStoicButtonText] = useState("Stoic Connect");
  const buttonState = useRef<HTMLButtonElement>(null);
  const stoicStatus = useRef<HTMLDivElement>(null);

  const stoicLogin = async () => {
    let identity;
    // @ts-ignore
    StoicIdentity.load().then(async identity => {
      if (identity !== false) {
        console.log("You have already logged in with Stoic.");
      } else {
        identity = await StoicIdentity.connect();
      }
      console.log("Logged In With: " + identity.getPrincipal().toText());
      setStoicButtonText("Connected!");
      buttonState.current!.disabled = true;
      stoicStatus.current!.style.backgroundColor = "rgba(0,255,0,0.5)";
    });
    return identity;
  }

  const createStoicActor = async () => {
    // @ts-ignore
    let identity = await stoicLogin();
    const host = "https://ic0.app";
    const idlFactory = helloIDL.idlFactory;
    const actor = Actor.createActor(idlFactory, {
      agent: new HttpAgent({ identity, host }),
      canisterId: "oyjva-2yaaa-aaaam-qbaya-cai"
    });
    return actor;
  }

  const testStoic = async () => {
    const actor = await createStoicActor();
    const result = await actor.hello_world();
    console.log(result);
  }

  return (
    <div className="walletContainer">
      <button ref={buttonState} onClick={testStoic} className="plugMenu">{stoicButtonText}<div ref={stoicStatus} className="statusBubble" id="statusBubble"></div></button>
    </div>
  )
}
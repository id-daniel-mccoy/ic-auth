import React, { useState, useRef } from "react";
// @ts-ignore
import { StoicIdentity } from "ic-stoic-identity";
import { Actor, HttpAgent } from "@dfinity/agent";
import * as helloIDL from "../interfaces/hello";
import StoicImage from "../assets/logos/stoic.png";
import "../assets/index.css";

export function StoicWallet(props: any) {

  const changeProvider = props.changeProvider;
  const [stoicButtonText, setStoicButtonText] = useState("Stoic");
  const [loggedIn, setLoggedIn] = useState(false);
  const buttonState = useRef<HTMLButtonElement>(null);
  const stoicStatus = useRef<HTMLDivElement>(null);

  const stoicLogin = async () => {
    let identity;
    // @ts-ignore
    StoicIdentity.load().then(async identity => {
      if (identity == false) {
        identity = await StoicIdentity.connect();
      }
      const theUserPrincipal = identity.getPrincipal().toText();
      changeProvider(theUserPrincipal);
      setStoicButtonText("Connected!");
      setLoggedIn(true);
      buttonState.current!.disabled = true;
      stoicStatus.current!.style.backgroundColor = "#42ff0f";
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
      <button ref={buttonState} onClick={!loggedIn ? testStoic : undefined}><img src={StoicImage} /><p>{stoicButtonText}</p><div ref={stoicStatus} className="statusBubble" id="statusBubble"></div></button>
    </div>
  )
}
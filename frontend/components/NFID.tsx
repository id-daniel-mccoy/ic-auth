import React, { useRef, useState } from "react"
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import * as helloIDL from "../interfaces/hello";
import NFIDLogo from "../assets/logos/nfid.png"
import '../assets/index.css';

export function NFID(props: any) {

  const changeProvider = props.changeProvider;
  const [nfidButtonText, setnfidButtonText] = useState("NFID");
  const [loggedIn, setLoggedIn] = useState(false);
  const buttonState = useRef<HTMLButtonElement>(null);
  const nfidStatus = useRef<HTMLDivElement>(null);

  const manageLogin = async () => {
    let identity;
    let actor;
    const appName = "wallet-testing";
    const appLogo = "https://nfid.one/icons/favicon-96x96.png";
    const authPath = "/authenticate/?applicationName="+appName+"&applicationLogo="+appLogo+"#authorize";
    const authUrl = "https://nfid.one" + authPath;

    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: authUrl,
      onSuccess: async () => {
        identity = await authClient.getIdentity();
        const theUserPrincipal = Principal.from(identity.getPrincipal()).toText();
        changeProvider(theUserPrincipal);
        nfidStatus.current!.style.backgroundColor = "#42ff0f";
        setnfidButtonText("Connected!");
        setLoggedIn(true);
        buttonState.current!.disabled = true;
        actor = await createInternetIdentityActor(identity);
        try {
          const result = await actor.hello_world();
          console.log(result);
        } catch (error) {
          console.log(error);
          return;
        }
      },
      onError: async (error) => {
        console.log("Login Failed:\n\n" + error);
        return "Error";
      },
    });
  }

  const createInternetIdentityActor = async (user: Identity) => {
    let actor;
    const identity = user;
    const host = "https://ic0.app";
    const idlFactory = helloIDL.idlFactory;
    actor = await Actor.createActor(idlFactory, {
      agent: new HttpAgent({ identity, host }),
      canisterId: "oyjva-2yaaa-aaaam-qbaya-cai"
    });
    return actor;
  }

  return (
    <div className="walletContainer">
      <button ref={buttonState} onClick={!loggedIn ? manageLogin : undefined} id='nfidMenu'><img src={NFIDLogo} /><p>{nfidButtonText}</p><div ref={nfidStatus} className='statusBubble' id='statusBubble'></div></button>
    </div>
  )
}
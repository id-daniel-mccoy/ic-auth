import React, { useRef, useState } from "react"
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import * as helloIDL from "../interfaces/hello";
import DfinityLogo from "../assets/logos/dfinity.png"
import '../assets/index.css';

export function InternetIdentity(props: any) {

  const changeProvider = props.changeProvider;
  const [plugButtonText, setPlugButtonText] = useState("Identity");
  const [loggedIn, setLoggedIn] = useState(false);
  const buttonState = useRef<HTMLButtonElement>(null);
  const plugStatus = useRef<HTMLDivElement>(null);

  const manageLogin = async() => {
    let identity;
    let actor;
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        identity = await authClient.getIdentity();
        const theUserPrincipal = Principal.from(identity.getPrincipal()).toText();
        changeProvider(theUserPrincipal);
        plugStatus.current!.style.backgroundColor = "#42ff0f";
        setPlugButtonText("Connected!");
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
      <button ref={buttonState} onClick={!loggedIn ? manageLogin : undefined} id='plugMenu'><img src={DfinityLogo} /><p>{plugButtonText}</p><div ref={plugStatus} className='statusBubble' id='statusBubble'></div></button>
    </div>
  )
}
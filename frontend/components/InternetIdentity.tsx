import React, { useRef, useState } from "react"
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import '../assets/plugWallet.css';
import * as helloIDL from "../interfaces/hello";

export function InternetIdentity(props: any) {

  const changeProvider = props.changeProvider;
  const [plugButtonText, setPlugButtonText] = useState("II Connect");
  const buttonState = useRef<HTMLButtonElement>(null);
  const plugStatus = useRef<HTMLDivElement>(null);

  const manageLogin = async() => {
    let identity;
    const authClient = await AuthClient.create();
    const loginResult = await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        console.log("Login succeeded");
        identity = await authClient.getIdentity();
        const theUserPrincipal = Principal.from(identity.getPrincipal()).toText();
        changeProvider(theUserPrincipal);
        plugStatus.current!.style.backgroundColor = "rgba(0,255,0,0.5)";
        setPlugButtonText("Connected!");
        buttonState.current!.disabled = true;
      },
      onError: (error) => {
        console.log("Login failed", error);
      },
    });
    return identity;
  }

  const createInternetIdentityActor = async () => {
    // @ts-ignore
    let identity = await manageLogin();
    const host = "https://ic0.app";
    const idlFactory = helloIDL.idlFactory;
    const actor = Actor.createActor(idlFactory, {
      agent: new HttpAgent({ identity, host }),
      canisterId: "oyjva-2yaaa-aaaam-qbaya-cai"
    });
    return actor;
  }

  const testInternetIdentity = async () => {
    await manageLogin();
    const actor = await createInternetIdentityActor();
    const result = await actor.hello_world();
    console.log(result);
  }

// HTML(UI) returns stay inside of the export function

  return (
    <>
      <div className="walletContainer">
        <button ref={buttonState} onClick={testInternetIdentity} id='plugMenu' className='plugMenu'>{plugButtonText}<div ref={plugStatus} className='statusBubble' id='statusBubble'></div></button>
      </div>
    </>
  )
}
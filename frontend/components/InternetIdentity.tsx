import React, { useRef, useState } from "react"
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import '../assets/index.css';
import * as helloIDL from "../interfaces/hello";

export function InternetIdentity(props: any) {

  const changeProvider = props.changeProvider;
  const [plugButtonText, setPlugButtonText] = useState("II Connect");
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


// HTML(UI) returns stay inside of the export function

  return (
    <>
      <div className="walletContainer">
        <button ref={buttonState} onClick={manageLogin} id='plugMenu'><p>{plugButtonText}</p><div ref={plugStatus} className='statusBubble' id='statusBubble'></div></button>
      </div>
    </>
  )
}
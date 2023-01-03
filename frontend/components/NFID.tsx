import React, { useRef, useState } from "react"
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import '../assets/index.css';
import * as helloIDL from "../interfaces/hello";

export function NFID(props: any) {

  const changeProvider = props.changeProvider;
  const [nfidButtonText, setnfidButtonText] = useState("NFID Connect");
  const buttonState = useRef<HTMLButtonElement>(null);
  const nfidStatus = useRef<HTMLDivElement>(null);

  const manageLogin = async() => {
    let identity;
    const appName = "wallet-testing";
    const appLogo = "https://nfid.one/icons/favicon-96x96.png";
    const authPath = "/authenticate/?applicationName="+appName+"&applicationLogo="+appLogo+"#authorize";
    const authUrl = "https://nfid.one" + authPath;

    const authClient = await AuthClient.create();
    const loginResult = await authClient.login({
      identityProvider: authUrl,
      // windowOpenerFeatures: {
      //   `left=${window.screen.width / 2 - 525 / 2}, `+ 
      //   `top=${window.screen.height / 2 - 705 / 2},` + 
      //   `toolbar=0,location=0,menubar=0,width=525,height=705`
      // },
      onSuccess: async () => {
        console.log("Login succeeded");
        identity = await authClient.getIdentity();
        const theUserPrincipal = Principal.from(identity.getPrincipal()).toText();
        changeProvider(theUserPrincipal);
        nfidStatus.current!.style.backgroundColor = "#42ff0f";
        setnfidButtonText("Connected!");
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
        <button ref={buttonState} onClick={testInternetIdentity} id='nfidMenu'><p>{nfidButtonText}</p><div ref={nfidStatus} className='statusBubble' id='statusBubble'></div></button>
      </div>
    </>
  )
}
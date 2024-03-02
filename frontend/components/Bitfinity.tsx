import React, { useRef, useState } from "react"
import { Principal } from "@dfinity/principal";
import * as helloIDL from "../interfaces/hello";
import InfinityLogo from "../assets/logos/infinity.png";
import '../assets/index.css'

export function Bitfinity(props: any) {

  const changeProvider = props.changeProvider;
  const [infinityButtonText, setInfinityButtonText] = useState("Bitfinity");
  const [loggedIn, setLoggedIn] = useState(false);
  const buttonState = useRef<HTMLButtonElement>(null);
  const infinityStatus = useRef<HTMLDivElement>(null);

  const manageLogin = async() => {
    await (window as any).ic.infinityWallet.requestConnect();
    const theUserPrincipal = Principal.from(await (window as any).ic.infinityWallet.getPrincipal()).toText();
    changeProvider(theUserPrincipal);
    infinityStatus.current!.style.backgroundColor = "#42ff0f";
    setInfinityButtonText("Connected!");
    setLoggedIn(true);
    buttonState.current!.disabled = true;
  }

  const infinityLogin = async() => {
    const hasLoggedIn = await (window as any).ic.infinityWallet.isConnected();
    if(!hasLoggedIn) {
      await manageLogin();
    } else {
      const theUserPrincipal = Principal.from(await (window as any).ic.infinityWallet.getPrincipal()).toText();
      changeProvider(theUserPrincipal);
      infinityStatus.current!.style.backgroundColor = "#42ff0f";
      setInfinityButtonText("Connected!");
      setLoggedIn(true);
      buttonState.current!.disabled = true;
    }
  }

  const createInfinityActor = async () => {
    const actor = await (window as any).ic.infinityWallet.createActor({interfaceFactory: helloIDL.idlFactory, canisterId: "oyjva-2yaaa-aaaam-qbaya-cai"});
    return actor;
  }

  const testInfinity = async () => {
    await infinityLogin();
    const actor = await createInfinityActor();
    const result = await actor.hello_world();
    console.log(result);
  }

  return (
    <div className="walletContainer">
      <button ref={buttonState} onClick={!loggedIn ? testInfinity : undefined} id='infinityMenu'><img src={InfinityLogo} /><p>{infinityButtonText}</p><div ref={infinityStatus} className='statusBubble' id='statusBubble'></div></button>
    </div>
  )
}
import React, { useRef, useState } from "react"
import { Principal } from "@dfinity/principal";
import * as helloIDL from "../interfaces/hello";
import PlugLogo from "../assets/logos/plug.png";
import "../assets/index.css"

export function PlugWallet(props: any) {

  const changeProvider = props.changeProvider;
  const [plugButtonText, setPlugButtonText] = useState("Plug");
  const [loggedIn, setLoggedIn] = useState(false);
  const buttonState = useRef<HTMLButtonElement>(null);
  const plugStatus = useRef<HTMLDivElement>(null);

  const manageLogin = async() => {
    await (window as any).ic.plug.requestConnect();
    const theUserPrincipal = Principal.from(await (window as any).ic.plug.agent.getPrincipal()).toText();
    changeProvider(theUserPrincipal);
    plugStatus.current!.style.backgroundColor = "#42ff0f";
    setPlugButtonText("Connected!");
    buttonState.current!.disabled = true;
  }

  const plugLogin = async() => {
    const hasLoggedIn = await (window as any).ic.plug.isConnected();
    if (!hasLoggedIn) {
      await manageLogin();
    } else {
      await (window as any).ic.plug.createAgent();
      const theUserPrincipal = Principal.from(await (window as any).ic.plug.agent.getPrincipal()).toText();
      changeProvider(theUserPrincipal);
      plugStatus.current!.style.backgroundColor = "#42ff0f";
      setPlugButtonText("Connected!");
      setLoggedIn(true);
      buttonState.current!.disabled = true;
    }
  }

  const createPlugActor = async () => {
    const actor = await (window as any).ic.plug.createActor({interfaceFactory: helloIDL.idlFactory, canisterId: "oyjva-2yaaa-aaaam-qbaya-cai"});
    return actor;
  }

  const testPlug = async () => {
    await plugLogin();
    const actor = await createPlugActor();
    const result = await actor.hello_world();
    console.log(result);
  }

  return (
    <div className="walletContainer">
      <button ref={buttonState} onClick={!loggedIn ? testPlug : undefined} id='plugMenu'><img src={PlugLogo} /><p>{plugButtonText}</p><div ref={plugStatus} className='statusBubble' id='statusBubble'></div></button>
    </div>
  )
}
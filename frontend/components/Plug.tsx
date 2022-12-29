import React, { useRef, useState } from "react"
import '../assets/plugWallet.css';
import * as helloIDL from "../interfaces/hello";

export function PlugWallet() {

  // convert the variables above to state variables
  const [userPrincipal, setUserPrincipal] = useState("Not Connected");
  const [plugButtonText, setPlugButtonText] = useState("Plug Connect");
  const buttonState = useRef<HTMLButtonElement>(null);
  const plugStatus = useRef<HTMLDivElement>(null);

  const manageLogin = async() => {
    await (window as any).ic.plug.requestConnect();
    const theUserPrincipal = await (window as any).ic.plug.agent.getPrincipal();
    setUserPrincipal(theUserPrincipal.toText());
    plugStatus.current!.style.backgroundColor = "rgba(0,255,0,0.5)";
    setPlugButtonText("Connected!");
    buttonState.current!.disabled = true;
    console.log("Logged in as: " + userPrincipal);
  }

  const plugLogin = async() => {
    const hasLoggedIn = await (window as any).ic.plug.isConnected();
    if (!hasLoggedIn) {
      await manageLogin();
    } else {
      await (window as any).ic.plug.createAgent();
      const theUserPrincipal = await (window as any).ic.plug.agent.getPrincipal();
      setUserPrincipal(theUserPrincipal.toText());
      plugStatus.current!.style.backgroundColor = "rgba(0,255,0,0.5)";
      setPlugButtonText("Connected!");
      buttonState.current!.disabled = true;
      console.log("Logged in as: " + userPrincipal);
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

// HTML(UI) returns stay inside of the export function

  return (
    <>
      <div className="walletContainer">
        <button ref={buttonState} onClick={testPlug} id='plugMenu' className='plugMenu'>{plugButtonText}<div ref={plugStatus} className='statusBubble' id='statusBubble'></div></button>
      </div>
    </>
  )
}
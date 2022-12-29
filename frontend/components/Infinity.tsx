import React, { useRef, useState } from "react"
import '../assets/plugWallet.css';
import * as helloIDL from "../interfaces/hello";

export function InfinityWallet() {

  // convert the variables above to state variables
  const [userPrincipal, setUserPrincipal] = useState("Not Connected");
  const [infinityButtonText, setInfinityButtonText] = useState("Infinity Connect");
  const buttonState = useRef<HTMLButtonElement>(null);
  const infinityStatus = useRef<HTMLDivElement>(null);

  const manageLogin = async() => {
    await (window as any).ic.infinityWallet.requestConnect();
    const theUserPrincipal = await (window as any).ic.infinityWallet.getPrincipal();
    console.log(theUserPrincipal);
    setUserPrincipal(theUserPrincipal.toText());
    infinityStatus.current!.style.backgroundColor = "rgba(0,255,0,0.5)";
    setInfinityButtonText("Connected!");
    buttonState.current!.disabled = true;
    console.log("Logged in as: " + userPrincipal);
  }

  const infinityLogin = async() => {
    await manageLogin();
    const theUserPrincipal = await (window as any).ic.infinityWallet.getPrincipal();
    setUserPrincipal(theUserPrincipal.toText());
    infinityStatus.current!.style.backgroundColor = "rgba(0,255,0,0.5)";
    setInfinityButtonText("Connected!");
    buttonState.current!.disabled = true;
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

// HTML(UI) returns stay inside of the export function

  return (
    <>
      <div className="walletContainer">
        <button ref={buttonState} onClick={testInfinity} id='infinityMenu' className='plugMenu'>{infinityButtonText}<div ref={infinityStatus} className='statusBubble' id='statusBubble'></div></button>
      </div>
    </>
  )
}
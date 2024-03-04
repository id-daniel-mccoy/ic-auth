import React from "react"
import { StoicWallet as Stoic } from "./Stoic";
import { PlugWallet as Plug} from "./Plug";
import { Bitfinity} from "./Bitfinity";
import { InternetIdentity } from "./InternetIdentity";
import { NFID } from "./NFID";
import "../assets/index.css";

export function ICWalletList(props: any) {

  const giveToParent = props.giveToParent;

  const changeUserAuth = async(user: string) => {
    giveToParent(user);
  }

  const test = async(text: string) => {
  }

  return (
    <div className="walletList">
      <Stoic changeProvider={changeUserAuth}/>
      <Plug changeProvider={changeUserAuth}/>
      <Bitfinity changeProvider={changeUserAuth}/>
      <NFID changeProvider={changeUserAuth}/>
      <InternetIdentity changeProvider={changeUserAuth}/>
    </div>
  )
}
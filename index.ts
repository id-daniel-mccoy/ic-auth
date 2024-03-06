import { Principal } from '@dfinity/principal';
import { Identity, HttpAgent, Actor } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import * as types from "./frontend/types";
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';
import * as hello from './frontend/interfaces/hello';
//@ts-ignore
import { StoicIdentity } from 'ic-stoic-identity';
export { types as Types };
import { ActorSubclass, ActorMethod } from '@dfinity/agent';

export const HelloIDL = hello.idlFactory;

// A simple Stoic login flow with simplified return data.
export const StoicLogin = async() : Promise<types.UserObject> => {
    let identity : Identity;
    //@ts-ignore
    identity = await StoicIdentity.load().then(async identity => {
        const userIdentity = await StoicIdentity.connect();
        return userIdentity;
    });
    const agent = new HttpAgent({identity, host: "https://ic0.app"});
    const principal = identity.getPrincipal().toText();
    const returnObject : types.UserObject = {
        principal: principal,
        agent: agent,
        provider: "Stoic"
    }
    console.log("Connected!");
    console.log(returnObject);
    return returnObject;
}

// Full featured Plug wallet login with simplified return data.
export const PlugLogin = async(whitelist: string[]) : Promise<types.UserObject> => {
    const isConnected = await (window as any).ic.plug.isConnected() as boolean;
    if (isConnected) {
        await (window as any).ic.plug.createAgent({whitelist});
        const agent = (window as any).ic.plug.agent as HttpAgent;
        const principal = (await agent.getPrincipal()).toText();
        const returnObject : types.UserObject = {
            principal: principal,
            agent: agent,
            provider: "Plug"
        }
        console.log("Connected!");
        console.log(returnObject);
        return returnObject;
    } else {
        await (window as any).ic.plug.requestConnect({whitelist});
        const agent = (window as any).ic.plug.agent as HttpAgent;
        const principal = (await agent.getPrincipal()).toText();
        const returnObject : types.UserObject = {
            principal: principal,
            agent: agent,
            provider: "Plug"
        }
        console.log("Connected!");
        console.log(returnObject);
        return returnObject;
    }
}

// A full featured NFID login flow with simplified return data.
export const NFIDLogin = async (): Promise<types.UserObject> => {
    return new Promise<types.UserObject>(async (resolve, reject) => {
      let identity: Identity;
      const appName = "wallet-testing";
      const appLogo = "https://nfid.one/icons/favicon-96x96.png";
      const authPath = "/authenticate/?applicationName=" + appName + "&applicationLogo=" + appLogo + "#authorize";
      const authUrl = "https://nfid.one" + authPath;
  
      let userObject: types.UserObject = {
        principal: "Not Connected.",
        agent: undefined,
        provider: "N/A",
      };
  
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: authUrl,
        onSuccess: async () => {
          try {
            identity = authClient.getIdentity();
            const agent = new HttpAgent({ identity: identity, host: "https://ic0.app" });
            console.log(await agent.getPrincipal());
            userObject = {
              principal: Principal.from(identity.getPrincipal()).toText(),
              agent: agent,
              provider: "NFID",
            };
            console.log("Connected!");
            resolve(userObject);
          } catch (error) {
            console.error("Error in onSuccess:", error);
            reject(error);
          }
        },
        onError: async (error) => {
          console.log("Login Failed:\n\n" + error);
          reject(error);
        },
      });
    });
  };
  

// A fully featured Internet Identity login flow with simplified return data.
export const IdentityLogin = async (): Promise<types.UserObject> => {
    return new Promise<types.UserObject>(async (resolve, reject) => {
      let identity: Identity;
      let userObject: types.UserObject = {
        principal: "Not Connected.",
        agent: undefined,
        provider: "N/A",
      };
  
      try {
        const authClient = await AuthClient.create();
        await authClient.login({
          identityProvider: "https://identity.ic0.app",
          onSuccess: async () => {
            identity = authClient.getIdentity();
            userObject = {
              principal: Principal.from(identity.getPrincipal()).toText(),
              agent: new HttpAgent({ identity, host: "https://ic0.app" }),
              provider: "Internet Identity",
            };
            console.log("Connected!");
            console.log(userObject);
            resolve(userObject);
          },
          onError: async (error: any) => {
            userObject = {
              principal: "Not Connected.",
              agent: undefined,
              provider: "N/A",
            };
            console.log("Error Logging In");
            reject(error);
          },
        });
      } catch (error) {
        console.error("Error creating AuthClient:", error);
        reject(error);
      }
    });
  };
  

// A basic actor creation flow for calling canisters.
export const CreateActor = async(agent: HttpAgent, idl: InterfaceFactory, canisterId: string) : Promise<ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>> => {
    const actor = Actor.createActor(idl, {
        agent: agent,
        canisterId: canisterId
    });
    console.log(actor);
    return actor;
}

// Creates an agent with no identity, can be passed into CreateActor for making non permissioned canister calls.
export const CreateAnonAgent = async() : Promise<HttpAgent> => {
    const agent = new HttpAgent({host: "https://ic0.app"});
    return agent;
}
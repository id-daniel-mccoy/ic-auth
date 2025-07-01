import { Principal } from '@dfinity/principal';
import { Identity, HttpAgent, Agent, Actor } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';
//@ts-ignore
import { StoicIdentity } from 'ic-stoic-identity';
import { ActorSubclass, ActorMethod } from '@dfinity/agent';

// Types

/**
 * Represents an authenticated user session.
 */
export type UserObject = {
    principal: string,
    agent: Agent | undefined,
    provider: string
}

// Helpers

const shouldFetchRootKey = (host: string): boolean => {
  return !(host.includes('ic0.app') || host.includes('icp0.io'));
};

// A simple Stoic login flow with simplified return data.
// Todo: Stoic is giving a cookies error, need to wait for a response from the stoic team.
/**
 * Authenticate the user with the Stoic Wallet provider and return a connected UserObject.
 *
 * This flow checks if Stoic is already connected, otherwise prompts the user to connect.
 * If successful, it creates a new Agent tied to the identity and returns the principal and agent.
 *
 * @param host - The IC replica host to connect to (e.g., local or mainnet).
 * @returns A Promise resolving to a UserObject containing principal, agent, and provider info.
 * @throws If Stoic identity cannot be loaded or connection fails.
 *
 * @todo Stoic is currently known to throw a cookie-related error in some browsers.
 *       This may be fixed in a later version.
 */
export const StoicLogin = async(host: string) : Promise<UserObject> => {
  // Checks to see if stoic is already connected or not, then prompts.
    let identity: Identity | null = await StoicIdentity.load();
    if (!identity) {
      identity = await StoicIdentity.connect();
    }
    if (!identity) {
      throw new Error("Stoic Identity not found or connection failed.");
    }
    const agent = await HttpAgent.create({
      identity: identity,
      host: host,
      shouldFetchRootKey: shouldFetchRootKey(host)
    })
    const principal = identity.getPrincipal().toText();
    const returnObject : UserObject = {
        principal: principal,
        agent: agent,
        provider: "Stoic"
    }
    console.log("Connected!");
    console.log(returnObject);
    return returnObject;
}

// Full featured Plug wallet login with simplified return data.
/**
 * Logs in with Plug Wallet and returns the authenticated user's agent and information.
 *
 * @param whitelist - An array of canister IDs the app will access using Plug Wallet.
 * @param host - The URL of the Internet Computer replica to connect to.
 *               Use "https://icp0.io" or "https://ic0.app" for mainnet or "http://127.0.0.1:<YourDFXPort>" for local development.
 * @returns A Promise that resolves to a UserObject containing the agent, principal, and provider name.
 */
export const PlugLogin = async(whitelist: string[], host: string) : Promise<UserObject> => {
    const isConnected = await (window as any).ic.plug.isConnected() as boolean;
    if (isConnected) {
        await (window as any).ic.plug.createAgent({whitelist, host});
        const agent = (window as any).ic.plug.agent as Agent;
        const principal = (await agent.getPrincipal()).toText();
        const returnObject : UserObject = {
            principal: principal,
            agent: agent,
            provider: "Plug"
        }
        console.log("Connected!");
        console.log(returnObject);
        return returnObject;
    } else {
        await (window as any).ic.plug.requestConnect({whitelist, host});
        const agent = (window as any).ic.plug.agent as Agent;
        const principal = (await agent.getPrincipal()).toText();
        const returnObject : UserObject = {
            principal: principal,
            agent: agent,
            provider: "Plug"
        }
        console.log("Connected!");
        console.log(returnObject);
        return returnObject;
    }
}

// A full featured NFID login flow with modern agent and simplified return data.
/**
 * Authenticate the user using NFID and return a connected UserObject.
 *
 * This flow uses DFINITY's AuthClient with NFID as the identity provider.
 * It constructs the NFID authorization URL with application name and logo,
 * creates a modern Agent tied to the authenticated identity, and resolves the user details.
 *
 * @param host - The IC replica host to connect to (mainnet or local).
 * @returns A Promise resolving to a UserObject containing principal, agent, and provider info.
 * @throws If creating the AuthClient or login flow fails.
 */
export const NFIDLogin = async (host: string): Promise<UserObject> => {
  return new Promise<UserObject>(async (resolve, reject) => {
    const appName = "wallet-testing";
    const appLogo = "https://nfid.one/icons/favicon-96x96.png";
    const authUrl = `https://nfid.one/authenticate/?applicationName=${appName}&applicationLogo=${appLogo}#authorize`;

    let userObject: UserObject = {
      principal: "Not Connected.",
      agent: undefined,
      provider: "N/A",
    };

    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: authUrl,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const agent = await HttpAgent.create({
            identity,
            host,
            shouldFetchRootKey: shouldFetchRootKey(host),
          });
          userObject = {
            principal: Principal.from(identity.getPrincipal()).toText(),
            agent,
            provider: "NFID",
          };
          console.log("Connected!");
          console.log(userObject);
          resolve(userObject);
        },
        onError: (error) => {
          console.error("NFID Login Failed:", error);
          reject(error);
        },
      });
    } catch (error) {
      console.error("Error creating AuthClient:", error);
      reject(error);
    }
  });
};

// A fully featured Internet Identity login flow with simplified return data.
/**
 * Authenticate the user using Internet Identity and return a connected UserObject.
 *
 * This flow uses DFINITY's AuthClient to open the Internet Identity login,
 * creates an Agent with the returned identity, and resolves the user details.
 * It handles both mainnet and local environments by conditionally fetching the root key.
 *
 * @param host - The IC replica host to connect to (mainnet or local).
 * @returns A Promise resolving to a UserObject containing principal, agent, and provider info.
 * @throws If creating the AuthClient or login flow fails.
 */
export const IdentityLogin = async (host: string): Promise<UserObject> => {
  return new Promise<UserObject>(async (resolve, reject) => {
    let identity: Identity;
    let userObject: UserObject = {
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
          const agent = await HttpAgent.create({
            identity: identity,
            host: host,
            shouldFetchRootKey: shouldFetchRootKey(host),
          });
          userObject = {
            principal: Principal.from(identity.getPrincipal()).toText(),
            agent: agent,
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


/**
 * Create an actor for any canister using a provided agent.
 * @param agent - The authenticated or anonymous Agent instance.
 * @param idl - The IDL factory for the target canister.
 * @param canisterId - The canister ID to connect to.
 * @returns A typed Actor subclass for the canister.
 */
export const CreateActor = async (agent: Agent, idl: InterfaceFactory, canisterId: string): Promise<ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>> => {
  const actor = Actor.createActor(idl, {
    agent,
    canisterId,
  });
  return actor;
};

/**
 * Create an anonymous agent for public queries or read-only calls.
 * @param host - Optional IC replica host (defaults to mainnet).
 * @returns An Agent instance with no identity attached.
 */
export const CreateAnonAgent = async (host: string): Promise<Agent> => {
  const agent = await HttpAgent.create({
    host,
    shouldFetchRootKey: shouldFetchRootKey(host),
  });
  return agent;
};
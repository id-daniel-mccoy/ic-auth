import { Identity, HttpAgent, Actor } from '@dfinity/agent';

export type UserObject = {
    principal: string,
    agent: HttpAgent | undefined,
    provider: string
}
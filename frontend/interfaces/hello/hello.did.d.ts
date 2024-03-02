import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'addPermission' : ActorMethod<[string], string>,
  'hello' : ActorMethod<[], string>,
  'permissionTest' : ActorMethod<[], string>,
}

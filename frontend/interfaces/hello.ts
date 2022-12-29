// @ts-nocheck
export const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'hello_world' : IDL.Func([], [IDL.Text], ['query']) });
};
export const init = ({ IDL }) => { return []; };

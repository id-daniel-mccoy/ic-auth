export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addPermission' : IDL.Func([IDL.Text], [IDL.Text], []),
    'hello' : IDL.Func([], [IDL.Text], ['query']),
    'permissionTest' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };

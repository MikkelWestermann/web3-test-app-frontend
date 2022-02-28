import { useReducer, createContext, useContext } from 'react';

const AccountContext = createContext(null);

function accountReducer(state, action) {
  switch (action.type) {
    case 'SET_ACCOUNT':
      return action.account;
    case 'GET_ACCOUNT':
      return state;
    default:
      return state;
  }
}

function AccountProvider({ children }) {
  const [account, dispatch] = useReducer(accountReducer, null);

  const getAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    dispatch({ type: 'SET_ACCOUNT', account: accounts[0] });
  };

  return (
    <AccountContext.Provider value={{ account, dispatch, init: getAccount }}>
      {children}
    </AccountContext.Provider>
  );
}

function useAccount() {
  const context = useContext(AccountContext);
  if (context === null) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
}

export { AccountProvider, useAccount };
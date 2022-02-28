import { useReducer, createContext, useContext } from 'react';
import Marketplace from '../contracts/Marketplace.json';

const MarketplaceContext = createContext(null);

function marketplaceReducer(state, action) {
  switch (action.type) {
    case 'SET_MARKETPLACE':
      return action.marketplace;
    case 'GET_MARKETPLACE':
      return state;
    default:
      return state;
  }
}

function productsReducer(state=[], action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return action.products;
    default:
      return state;
  }
}

function MarketplaceProvider({ children }) {
  const [marketplace, dispatch] = useReducer(marketplaceReducer, null);
  const [products, dispatchProducts] = useReducer(productsReducer, []);

  const initMarketplace = async () => {
    const networkId = await window.web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketplace = new window.web3.eth.Contract(
        Marketplace.abi,
        networkData.address,
      );
      dispatch({ type: 'SET_MARKETPLACE', marketplace });
      getProducts();
    } else {
      throw new Error('Marketplace contract not deployed to detected network.');
    }
  };

  const getProducts = async () => {
    const productCount = await marketplace.methods.productCount().call();
    const promises = [];
    for (let i = 0; i < productCount; i++) {
      promises.push(
        marketplace.methods.products(i).call(),
      );
    }
    const products = await Promise.all(promises);
    dispatchProducts({ type: 'SET_PRODUCTS', products });
  };

  return (
    <MarketplaceContext.Provider value={{ marketplace, dispatch, initMarketplace, products, getProducts }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === null) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}

export { MarketplaceProvider, useMarketplace };
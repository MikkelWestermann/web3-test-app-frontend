import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useAccount } from './context/account-state';
import { useMarketplace } from './context/marketplace';
import Navbar from './components/navbar';

function App() {
  const [productName, setProductName] = useState(null)
  const [productPrice, setProductPrice] = useState(null);

  const { account, init } = useAccount();
  const { marketplace, initMarketplace, products, getProducts } = useMarketplace();
  console.log("🚀 ~ file: App.js ~ line 13 ~ App ~ products", products)

  useEffect(async () => {
    await loadWeb3();
    await init();
    await initMarketplace();
   }, []);

   // Connect web3
   const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const createProduct = async (name, price) => {
    marketplace.methods.createProduct(name, price).send({ from: account })
      .once('receipt', (receipt) => {
        console.log(receipt);
      })
      .once('error', (error) => {
        console.log(error);
      });
  }

  const purchaseProduct = async (id, value) => {
    marketplace.methods.purchaseProduct(id).send({ from: account, value })
      .once('receipt', (receipt) => {
        console.log(receipt);
      })
      .once('error', (error) => {
        console.log(error);
      });
  }
  
   return (
    <div>
      <Navbar />

      <div>

        <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = productName.value
          const price = window.web3.utils.toWei(productPrice.value.toString(), 'Ether')
          createProduct(name, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => setProductName(input)}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => setProductPrice(input)}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <h2>Buy Product</h2>
        <table className="table-auto">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {products.map((product, index) => (
              <tr key={index}>
                <th scope="row">{index}</th>
                <td>{product.name}</td>
                <td>{window.web3.utils.fromWei(product.price, 'Ether')}</td>
                <td>{product.owner}</td>
                <td>
                  <button onClick={() => purchaseProduct(product.id, product.price)}>Buy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <button onClick={getProducts}>Refresh list</button>
    </div>
   );
}

export default App;
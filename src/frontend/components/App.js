import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import logo from './logo.png';
import { useState, useEffect } from 'react';
import './App.css';
import NftMarketPlaceAddress from '../contractsData/NftMarketPlace-address.json';
import NftMarketPlaceAbi from '../contractsData/NftMarketPlace.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import Navigation from './Navbar'
import Home from './Home';
import Create from './Create';
import MyListedItems from './MyListedItems';
import Features from './Features';
import Item from './Item';

import { Spinner } from 'react-bootstrap';
import PNF from './PNF';
import Search from './Search';
import ReList from './ReList';
 
function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNft] = useState({})
  const [marketplace, setMarketplace] = useState({})

  const walletConnect = async ()=> {
    const accounts = await window.ethereum.request({method: 'eth_accounts'});
    let chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);
    if(accounts.length == 0){
      console.log('no authorised accounts found');
    }
    else {
      setAccount(accounts[0]);
      console.log(`authorized account found: ${accounts[0]}`);
      // get the contract instances
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer= provider.getSigner();
      loadContracts(signer);
    }
  }
  const web3Handler = async ()=> {

    // request metamask for accounts list
    if(account == null) {
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      setAccount(accounts[0])
    }
    // request metamask for provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer= provider.getSigner();
    loadContracts(signer);
  }

  const loadContracts = (async(signer) => {
    const marketplace = new ethers.Contract(NftMarketPlaceAddress.address, NftMarketPlaceAbi.abi, signer);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

    setMarketplace(marketplace);
    setNft(nft);
    setLoading(false);
  });

  useEffect(()=>{
    walletConnect();
  },[])

  return (
    <BrowserRouter>
    <div className='App'>
      <Navigation web3Handler={web3Handler} account = {account} />
      {loading ?
      (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
          <Spinner animation="border" style={{diplay:'flex'}}/>
          <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
      )
      :(<Routes>
        <Route path="/" element = {<Home marketplace={marketplace} nft={nft}/>} />
        <Route path = "/create" element={<Create marketplace={marketplace} nft={nft}/>} />
        <Route path = "/my-listed-items" element={<MyListedItems marketplace={marketplace} nft={nft} account={account}/>} />
        <Route path = "/popular-NFTs" element={<Features/>} />
        <Route path = "/item/:itemId" element={<Item/>}/>
        <Route path = "/search/:userAddress" element={<Search/>}/>
        <Route path = "/relist" element={<ReList marketplace = {marketplace}/>}/>"       
        <Route path ="/*" element={<PNF/>}/>
      </Routes>)}

    </div>
    </BrowserRouter>
  );
}

export default App;

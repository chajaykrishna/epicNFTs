import React from 'react'
import { useState } from 'react'
import {Row, Form, Button} from 'react-bootstrap';
import {ethers} from 'ethers';
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { useNavigate } from 'react-router-dom';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({marketplace, nft}) => {
  const [image, setImage] = useState('');
  const [name, setName]= useState('');
  const navigate= useNavigate();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);

  const uploadToIpfs = async(event) =>{
    event.preventDefault();
    const file = event.target.files[0];
    if(typeof file !== 'undefined'){
      try{
        const result= await client.add(file);
        console.log(`result is ${result.path}`);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
      } catch(error){
          console.log(`upload to ipfs failed with error: ${error}`);
      }
    }
  }

  const createNFT = async()=>{
    if(!image || !price || !name || !description){console.log('all fields must be filled.');
      return}
    try{
    const result = await client.add( JSON.stringify({image,name,description}))
    mintThenList(result)

    }catch(error){
      console.log(error)
    }
  }
  const mintThenList = async(result)=> {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    const exToken = await (await nft.mintNFT(uri)).wait();
    const tokenId = await nft._tokenIds();
    // itemprice is the price set by the user while minting the NFT.
    const itemprice = ethers.utils.parseEther(price.toString())
    const listingPrice = await marketplace.getListingPrice();
    await (await (marketplace.listMarketItem(itemprice, tokenId))).wait()
    navigate(`/my-listed-items`);

  }

  return (
    <div className="container-fluid mt-5">
    <div className="row">
      <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
        <div className="content mx-auto">
          <Row className="g-4">
            <Form.Control
              type="file"
              required
              name="file"
              onChange={uploadToIpfs}
            />
            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
            <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in Matic" />
            <div className="d-grid px-0">
              <Button onClick={createNFT} variant="dark" size="lg">
                Create & List NFT!
              </Button>
            </div>
          </Row>
        </div>
      </main>
    </div>
  </div>
  )
}

export default Create
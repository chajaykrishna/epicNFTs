import React, {useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {Row, Form, Button} from 'react-bootstrap';
import { ethers } from 'ethers';


const ReList = ({marketplace}) => {
    const [price, setPrice] = useState('');
    const {state} = useLocation();
    const navigate= useNavigate();
    const item = state.item;
    const relist = async () => {
        console.log(marketplace.address)
        const itemprice = ethers.utils.parseEther(price.toString())
        await (await marketplace.reListNfts(item.itemId, itemprice)).wait();
        navigate(`/my-listed-items`);

    }


    return (
        <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
            <div className="content mx-auto">
              <img src={item.image} className="img-fluid" alt="..."/>
              <Row className="g-4">
                <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in Matic" />
                <div className="d-grid px-0">
                  <Button onClick={relist} variant="primary" size="lg">
                    Re-List NFT!
                  </Button>
                </div>
              </Row>
            </div>
          </main>
        </div>
      </div>
      )
}

export default ReList

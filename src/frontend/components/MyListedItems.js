import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {Row, Col, Card, Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const MyListedItems = ({marketplace, nft, account}) => {
    const [items, setItems] = useState([]); 
    const [loading, setLoading] = useState(true);
    const navigate= useNavigate();

    const loadMyitems =async ()=>{
      const items_ = await marketplace.getMyItems(account);
      const items = await Promise.all(items_.map(async i => {
      const uri = await nft.tokenURI(i.tokenId);
      const meta = await axios.get(uri);
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item={
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            price: price,
            seller: i.seller,
            status: i.itemStatus,
            itemId: i.itemId
          }
      return item;
      }))
      setItems(items)
      setLoading(false)
    }

    const reListNFT = (item) => {
      navigate(`/relist`, {state: {item}});
    }

    useEffect(()=>{
      loadMyitems();
    },[])
  
    if (loading) return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    )

  return (
    <div className="flex justify-center">
      {console.log(`items array length in return: ${items.length}`)}
    {items.length > 0 ?
      <div className="px-5 container">
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {items.map((item, idx) => (
            <Col key={idx} className="overflow-hidden">
              <Card>
                <Card.Img variant="top" src={item.image} style={{width: "100%",  height: "15rem", objectFit: "cover"}} />
                <Card.Body color="secondary">
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    {item.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <div className='d-grid'>
                    {item.status == 1 ? 
                    <Button variant="primary" size="lg">
                      listed </Button>
                      : <Button variant="outline-primary" size="lg" onClick={()=>reListNFT(item)}>
                      Re-List </Button>
                    }
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
  </div>
  );
}

export default MyListedItems

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {Row, Col, Card, Button} from 'react-bootstrap'


const MyListedItems = ({marketplace, nft, account}) => {
    const [items, setItems] = useState([]); 
    const [loading, setLoading] = useState(true);

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
            staus: i.itemStatus
          }
      return item;
      }))
      setItems(items)
      setLoading(false)
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
                <Card.Img variant="top" src={item.image} />
                <Card.Body color="secondary">
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    {item.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>

                  <div className='d-grid'>
                    <Button variant="primary" size="lg">
                    {item.staus == 1 ?
                     "listed" : "not listed"}
                    </Button>
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

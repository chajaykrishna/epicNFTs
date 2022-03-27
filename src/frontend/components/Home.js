import React, { useEffect,useState } from 'react'
import { ethers } from 'ethers';
import {Row, Col, Card, Button, Spinner} from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Home = ({marketplace, nft}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate= useNavigate();

  // this function will route to item page 
  const itemSelected = (item) =>{
    navigate("/item/itemId", {state: {item_data:item}});
  }
//  function on call will load all listed nfts
  const loadMarketItems = async() => {
    const items_ = await marketplace.getListingItems();
    console.log(items_)
    const items = await Promise.all(items_.map(async i=>{
      const uri = await nft.tokenURI(i.tokenId);
      const meta = await axios.get(uri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
        itemId: i.itemId,
          price: price,
          seller: i.seller,
          name: meta.data.name,
          description: meta.data.description,
          image: meta.data.image
      }
      return item;
    }))
    setItems(items);
    setLoading(false);
  }

  const buyItem = async(item)=> {
    console.log(ethers.utils.parseEther(item.price))
    await (await marketplace.buyMarketItem(item.itemId, {value: ethers.utils.parseEther(item.price)})).wait();
    loadMarketItems();

  }

  useEffect(()=>{
    loadMarketItems();
  },[])

  if (loading) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
          <Spinner animation="border" style={{diplay:'flex'}}/>
      </div>
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
                <Card.Img variant="top" onClick ={()=>itemSelected(item)}
                 src={item.image} 
                 style={{width: "100%", height: "15rem", objectFit: "cover"}}/>
                <Card.Body color="secondary">
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    {item.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <div className='d-grid'>
                    <Button onClick={() => buyItem(item)} variant="dark" size="lg">
                      Buy for {(item.price)} ETH
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

export default Home

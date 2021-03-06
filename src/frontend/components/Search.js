import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Row, Col, Card, Spinner, Badge} from 'react-bootstrap'
import axios from 'axios';


const Search = () => {
  const {userAddress} = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const alchemyApiKey = "CzOIcyajR6W0Pi2EtKSphKKeNxI_2y12"

  const loadItemsFromAlchemy = async() => {
    setLoading(true);
    const nftData = await axios.get(`https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}/getNFTs?owner=${userAddress}`)
    const items_ = nftData.data.ownedNfts;
    const items = await Promise.all(items_.map(async i=>{
      const uri = i.tokenUri.gateway;
      console.log(uri)
      let item = {
          seller: userAddress,
          name: i.metadata.name,
          description: i.description,
          image: i.metadata.image
      }
      return item;
    }))
    setItems(items);
    setLoading(false);
  }
  useEffect(()=>{
    loadItemsFromAlchemy();
  }, [userAddress])

  if(loading){
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
          <Spinner animation="border" style={{diplay:'flex'}}/>
      </div>
    )
  }
  return (
    <div className="flex justify-center">
    {console.log(`items array length in return: ${items.length}`)}
    {items.length > 0 ?
      <div className="px-5 container">
      <h3 style ={{padding:"1rem"}}>Other NFTs</h3>
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {items.map((item, idx) => (
            <Col key={idx} className="overflow-hidden">
              <Card>
                <Card.Img variant="top" src={item.image} style={{width: "100%", height: "20rem", objectFit: "cover"}}/>
                <Card.Body color="secondary">
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    {item.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <div className='d-grid'>
          
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No assets available for the address</h2>
        </main>
      )}
  </div>
  )
}

export default Search

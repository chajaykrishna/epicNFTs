import {
    Link,useNavigate
} from "react-router-dom";
import { Navbar, Nav, Button, Container, Form, FormControl } from 'react-bootstrap'
import market from './market.png'
import { useState } from "react";


const Navigation = ({ web3Handler, account }) => {
    
    const [searchAddress, setSearchAddress] = useState("");
    const navigate = useNavigate();
    const search = (e) =>{
        e.preventDefault();
        if(searchAddress ===""){
            return;
        }
        navigate(`/search/${searchAddress}`);
    }
    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#">
                    <img src={market} width="40" height="40" className="" alt="" />
                    &nbsp; EPIC NFTS
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create">Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items">My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/popular-NFTs">popular NFTs</Nav.Link>
                    </Nav>
                    <Form className="d-flex" onSubmit={search}>
                        <FormControl
                        type="search"
                        placeholder="Enter Address"
                        className="me-2"
                        aria-label="Search"
                        onChange={(e)=>setSearchAddress(e.target.value)}
                        />
                        <input type="submit" style={{display: 'none'}} />
                    </Form>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;
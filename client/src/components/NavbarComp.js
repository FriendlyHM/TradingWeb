import React, {Component} from "react";
import axios from 'axios';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

class NavbarComp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: false,
            user: {
                username: "",
                email: ""
            }
        }
    }

    componentDidMount = () => {
        this.getUser();
        console.log(this.state.authenticated);
    }

    getUser = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:1234/user",
        }).then((res) => {
            this.setState({
                authenticated: true,
                user : {
                    username: res.data.username,
                    email: res.data.email
            }});
        }).catch(e => {console.log(e.message)});
    };

    logoutUser = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:1234/logout",
        }).then((res) => {
            this.setState({
                authenticated: false,
                user : {
                    username: "",
                    email: ""
            }});
        });
    }

    render() {
        const isLoggedIn = this.state.authenticated;
        return (
            <>
            <Navbar bg="light" expand="lg">
                <strong><Navbar.Brand href="/"> <h2>TradingWeb </h2></Navbar.Brand></strong>
                <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                        <Button variant="outline-success">Search</Button>
                </Form>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    {isLoggedIn ? 
                        <Nav className="ml-auto">
                            <Button variant="info btn-lg">{this.state.user.username}</Button>
                            <Nav.Link href="/users/post" params={{username:this.state.user.username}}><h4> POST </h4></Nav.Link>
                            <Nav.Link href="/" onClick={this.logoutUser}><h4>Log Out</h4></Nav.Link>
                        </Nav>
                        :
                        <Nav className="ml-auto">
                            <Nav.Link href="/users/login"><h4>Log In </h4></Nav.Link>
                            <Nav.Link href="/users/signup"><h4>Sign Up </h4></Nav.Link>
                        </Nav>
                    }

                </Navbar.Collapse>
            </Navbar>
            </>
        );
    }
};

export default NavbarComp;
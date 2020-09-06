import React from 'react';
import NavBar from '../components/NavbarComp';
import axios from 'axios';
import { Form, Button, Jumbotron } from 'react-bootstrap';
import UserListings from '../components/UserListings';

export default class Post extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listing: {
                username: '',
                subject: '',
                description: '',
                imageURL: ''
            },
        }

        this.handleUserChange = this
            .handleChange
            .bind(this)
    }

    //render when first mount
    componentDidMount = () => {
        this.getUser();
    }

    //grab user database if loggedin
    getUser = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:1234/user",
        }).then((res) => {
            this.setState({
                listing : {
                    username: res.data.username,
            }});
        }).catch(e => {console.log(e.message)});
    };

    //post listing to database
    handleSubmit = (e) => {
        e.preventDefault(); //console.log(this.state.listing);
        axios({
            method: "POST",
            data: this.state.listing,
            withCredentials: true,
            url: "http://localhost:1234/listings",
        }).then((res) => {
            console.log("HERE",res.data);
            //this.setState({data: res.data});
        });
    }

    //update state when type in fields
    handleChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;
        console.log(name, value);
        this.setState((state) => {
            // Important: read `state` instead of `this.state` when updating.
            return {
                listing: {
                    ...state.listing,
                    [name]: value
                }
            };
        });
    }
    
    render() {
        return (
            <>
            <NavBar/>
            <div className="row mt-5">
                <div className="col-md-10 m-auto">
                    <div className="card card-body">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group>
                                <Form.Label>Subject</Form.Label>
                                <Form.Control
                                    name="subject"
                                    onChange={this.handleChange}
                                    type="text"
                                    id="subject"
                                    required></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    name="description"
                                    onChange={this.handleChange}
                                    rows="5">
                                </Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    name="imageURL"
                                    onChange={this.handleChange}
                                    type="url"
                                    placeholder="Put an image URL dummy"></Form.Control>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Post!
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>

            <br/>
            <Jumbotron><h1>My Listings</h1></Jumbotron>
            <UserListings/>
            </>
        );
    }
};
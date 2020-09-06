import React from 'react';
import NavBar from '../components/NavbarComp';
import axios from 'axios';
import {Form, Button, Alert} from 'react-bootstrap';
//import "bootswatch/dist/darkly/bootstrap.min.css";

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: '',
                email: '',
                password: '',
                password2: ''
            },
            errormsg: [],
            pushed: [],
        };

        this.handleUserChange = this
                                    .handleChange
                                    .bind(this)

    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({ 
            errormsg: [],
            pushed: []
        })

        //validate inputs and make post request to user database
        if (this.handleValidation()) {
            axios({
                method: "POST",
                data: this.state.user,
                withCredentials: true,
                url: 'http://localhost:1234/signup'
            }).then((res) => {
                console.log(res.data);
                this.setState(res.data, () => {console.log(this.state)});
                document.getElementById("signup-form").reset();
            }).catch (e => {console.log(e)});
        } else {
            console.log('ERROR not pushed');
        }
    }

    //handle changes when user typ into fields
    handleChange = evt => {
        const name = evt.target.name;
        const value = evt.target.value;
        //console.log(name, value);
        this.setState((state) => {
            // Important: read `state` instead of `this.state` when updating.
            return {
                user: {
                    ...state.user,
                    [name]: value
                }
            };
        });
    }

    //validate inputs and assert error if necessary
    handleValidation = () => {
        let fields = this.state.user;
        console.log(fields);
        let errors = [];
        let formIsValid = true;

        //Name
        if(!fields.username || !fields.email || !fields.password || !fields.password2){
            formIsValid = false;
            errors.push("Please enter all fields"); 
        }else 

        if (fields.password !== fields.password2) {
            formIsValid = false;
            errors.push('Passwords do not match');
        } else 
        
        if (fields.password.length < 6) {
            formIsValid = false;
            errors.push('Password must be at least 6 characters');
        }

        this.setState({ errormsg: errors }, () => {
            console.log('ERRORS: ', this.state.errormsg);
        });
        return formIsValid;
   }

    render() {
        const errors = this.state.errormsg;
        const pushed = this.state.pushed;
        return (
            <div>
                <NavBar/>
                <br/>

                <div className="row mt-5">
                    <div className="col-md-6 m-auto">
                        <div className="card card-body">
                            <h1 className="text-center mb-3">
                                <i className="fas fa-user-plus"></i>
                                Register
                            </h1>
                            
                            <Form onSubmit={this.handleSubmit.bind(this)} id="signup-form">
                                {errors.map(error => (
                                    <Alert variant='warning' key={error}> {error}</Alert>
                                ))}
                                {pushed.map(msg => (
                                    <Alert variant='success' key={msg}> {msg}</Alert>
                                ))}
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        name="username"
                                        onChange={this.handleChange}
                                        placeholder="Enter username"
                                        type="text"></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        name="email"
                                        onChange={this.handleChange}
                                        placeholder="Enter Email"
                                        type="email"></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        name="password"
                                        onChange={this.handleChange}
                                        placeholder="Enter Password"
                                        type="password"></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        name="password2"
                                        onChange={this.handleChange}
                                        placeholder="Enter Password Again"
                                        type="password"></Form.Control>
                                </Form.Group>
                                
                                <Button variant="primary" type="submit">
                                    Register
                                </Button>
                            </Form>
                            <p className="lead mt-4">
                                Already Have An Account? <a href="/users/login">Login</a>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};
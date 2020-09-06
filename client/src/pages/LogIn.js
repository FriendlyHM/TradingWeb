import React from 'react';
import NavBar from '../components/NavbarComp';
import axios from 'axios';
import { Alert, Form, Button } from 'react-bootstrap';

export default class LogIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                email: '',
                password: ''
            },
            errormsg: [],
            pushed: [],
            data: {}
        };

        this.handleUserChange = this
            .handleChange
            .bind(this)

    };

    //grab user database
    getUser = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:1234/user",
        }).then((res) => {
            console.log("HERE",res.data);
            //this.setState({data: res.data});
        });
    };

    //log in request
    handleSubmit = e => {
        e.preventDefault();
        const { history } = this.props;
        //reset any error message
        this.setState({ 
            errormsg: [],
            pushed: [],
            serverError: []
        })
        
        //validate input and submit a log in request to database
        if (this.handleValidation()) {
            axios({
                method: "POST",
                data: this.state.user,
                withCredentials: true,
                url: 'http://localhost:1234/login'
            }).then((res) => {
                if(res) {
                    //console.log(res.data);
                    this.setState(res.data, () => {/*console.log(this.state)*/});
                    history.push('/');
                }
            }).catch(e => {
                this.setState(e.response.data, () => {/*console.log(this.state)*/});
            });
        } else {
            console.log('ERROR not login');
        }
    }

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

    handleValidation = () => {
        let fields = this.state.user;
        //console.log(fields);
        let errors = [];
        let formIsValid = true;

        //Name
        if(!fields.email || !fields.password ){
            formIsValid = false;
            errors.push("Please enter all fields"); 
        }

        this.setState({ errormsg: errors }, () => {
            if(!this.state.errormsg)
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
                                Log In
                            </h1>
                            <Form onSubmit={this.handleSubmit}>
                                {errors.map(error => (
                                    <Alert variant='warning' key={error}> {error}</Alert>
                                ))}
                                {pushed.map(msg => (
                                    <Alert variant='success' key={msg}> {msg}</Alert>
                                ))}
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        name="email"
                                        onChange={this.handleChange}
                                        placeholder="Enter Email"
                                        type="text"></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        name="password"
                                        onChange={this.handleChange}
                                        placeholder="Enter Password"
                                        type="password"></Form.Control>
                                </Form.Group>
                                
                                <Button variant="primary" type="submit">
                                    Log In
                                </Button>
                            </Form>
                            <p className="lead mt-4">
                                No Account? <a href="/users/SignUp">Register</a>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};
import React from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import "bootswatch/dist/darkly/bootstrap.min.css";
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Post from './pages/Post';

function App() {
    return (
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/users/login" component={LogIn}/>
            <Route path="/users/signup" component={SignUp}/>
            <Route path="/users/post" component={Post}/>
        </Switch>
    );
}

export default App;
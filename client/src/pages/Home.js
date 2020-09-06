import React from 'react';
import Listings from '../components/Listings';
import NavBar from '../components/NavbarComp';
import '../css/home.css'

function Home() {

    return (
        <div className='home'>
            <NavBar/>
            <br/>
            <Listings/>
        </div>
    );
}

export default Home;
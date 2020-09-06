import React from 'react';
import axios from 'axios';
import Item from './Item';

export default class Listings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listings: [],
        }
    }

    //when mount, grab all data and display to user
    componentDidMount() {
        axios
            .get('http://localhost:1234/listings')
            .then(response => {
                //console.log(response)
                this.setState({listings: response.data})
            })
            .catch((error) => {
                console.log(error)
            })
    };

    itemList() {
        return this
            .state
            .listings
            .reverse()
            .map(currentitem => {
                return <Item item={currentitem} key={currentitem._id}/>;
            })
    };

    render() {
        return (
            <div className="items">{this.itemList()}</div>
        );
    }
};

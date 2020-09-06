import React from 'react';
import axios from 'axios';
import Item from './Item';

export default class UserListings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listings: [],
        }
    }

    //when mount, grab all data and display to user
    componentDidMount() {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:1234/user/listings",
        }).then((res) => {
            console.log(res.data);
            this.setState({listings: res.data});
        }).catch(e => {console.log(e.response)});
    };

    itemList() {
        if(this.state.listings) {
            return this
                .state
                .listings
                .reverse()
                .map(currentitem => {
                    return <Item item={currentitem} key={currentitem._id}/>;
                })
        }
    };

    render() {
        return (
            <div className="items">{this.itemList()}</div>
        );
    }
};

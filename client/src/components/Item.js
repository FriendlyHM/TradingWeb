import React from 'react';
//import style from '../css/item.css';

const Item = props => (
    <div className="card text-white border-success bg-dark mb-3 d-flex">
        
        <h3 className="card-header">{props.item.subject}</h3>
        <div className="card-body">
            <img
                width={150}
                height={150}
                className=""
                src={props.item.imageURL}
                alt="Generic placeholder"/>
            <br/>
            <br/>
            <div className="card-text">
                <h4>
                    {props.item.description}
                </h4>
                <small>
                    from user: {props.item.username} <br />
                    {props.item.created}
                </small>
            </div>
        </div>
        <br/>
    </div>
);

export default Item;
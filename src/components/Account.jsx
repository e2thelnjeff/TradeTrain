import React from 'react';
//import setBuyingPower from '../App';

function Account({netLiq,buyingPower,bookPnl}){
    //const newBuyingPower = buyingPower + bookPnl;

    return(
        <div>
            <h1>netLiq: ${netLiq}</h1>
            <h1>Your buying power is: ${buyingPower}</h1>
        </div>
    )
};

export default Account;
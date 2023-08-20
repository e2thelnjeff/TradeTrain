import React from 'react';
//import setBuyingPower from '../App';

function Account({netLiq,buyingPower,bookPnl}){
    //const newBuyingPower = buyingPower + bookPnl;

    return(
        <div>
            <table id="account">
                <tbody>
                    <tr>
                        <th><h2>Initial NetLiq:</h2></th>
                        <th><h2>Current Buying Power:</h2></th>
                    </tr>
                    <tr>
                        <td><h2>${netLiq.toFixed(2)}</h2></td>
                        <td><h2>${buyingPower.toFixed(2)}</h2></td>
                    </tr>
                    <tr>
                        <th><h2></h2></th>
                        <td><h2></h2></td>
                    </tr>
                    <tr>
                        <th><h2></h2></th>
                        <td><h2></h2></td>
                    </tr>
                </tbody>
            </table>            
        </div>
    )
};

export default Account;



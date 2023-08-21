import React from 'react';
//import setBuyingPower from '../App';

function Account({netLiq,buyingPower,bookPnl}){
    //const newBuyingPower = buyingPower + bookPnl;

    return(
            <table id="account">
                <tbody>
                    <tr>
                        <th><h2>Initial NetLiq:</h2></th>
                        <th><h2>Current Buying Power:</h2></th>
                    </tr>
                    <tr>
                        <td><h2>${netLiq.toLocaleString('en-US', {maximumFractionDigits:2})}</h2></td>
                        <td><h2>${buyingPower.toLocaleString('en-US', {maximumFractionDigits:2})}</h2></td>
                    </tr>
                </tbody>
            </table>            
    )
};

export default Account;



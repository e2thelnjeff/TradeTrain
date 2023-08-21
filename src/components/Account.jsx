import React from 'react';
//import setBuyingPower from '../App';

function Account({netLiq,buyingPower,bookPnl}){
    //const newBuyingPower = buyingPower + bookPnl;

    return(
            <table id="account">
                <tbody>
                    <tr>
                        <th>Initial NetLiq:</th>
                        <th>Current Buying Power:</th>
                    </tr>
                    <tr>
                        <td>${netLiq.toLocaleString('en-US', {maximumFractionDigits:2})}</td>
                        <td>${buyingPower.toLocaleString('en-US', {maximumFractionDigits:2})}</td>
                    </tr>
                </tbody>
            </table>            
    )
};

export default Account;



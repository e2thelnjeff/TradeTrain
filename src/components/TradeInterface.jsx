import React from 'react';
//import BuyButton from '.';


function TradeInterface({data,position,costBasis}) {
    const pnl = (position*(data.close-costBasis)).toFixed(2)
    
    return(
        <table>
            <tbody>
                <tr>
                    <th><h2>Volume</h2></th>
                    <th><h2>Last Price</h2></th>
                </tr>
                <tr>
                    <td><h2>{data.volume}</h2></td>
                    <td><h2>{data.close}</h2></td>
                </tr>
                <tr>
                    <th><h2>Net Position</h2></th>
                    <td><h2>{position}</h2></td>
                </tr>
                <tr>
                    <th><h2>P&L</h2></th>
                    <td><h2>${pnl}</h2></td>
                </tr>
            </tbody>
        </table>
    )
}

export default TradeInterface;
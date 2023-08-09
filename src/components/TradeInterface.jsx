import React from 'react';
//import BuyButton from '.';


function TradeInterface(data,position) {
    data = data.data
    position = data.position

    return(
        <table>
            <tbody>
                <tr>
                    <th scope='col'>Volume</th>
                    <th scope='col'>Last Price</th>
                </tr>
                <tr>
                    <td><h2>{data.volume}</h2></td>
                    <td><h1>{data.close}</h1></td>
                </tr>
                <tr>
                    <th><h2>Net Position</h2></th>
                    <td><h2>{position}</h2></td>
                </tr>
            </tbody>
        </table>
    )
}

export default TradeInterface;
import React from 'react'

function tradeLogEntry(item, index){
    return (
        <tr key={index}>
            <td>{item.time}</td>
            <td>{item.side}</td>
            <td>{item.quantity}</td>
            <td>{item.price}</td>
        </tr>
    )
}

function TradeLog({trades}){
        
    return(
        //buyToClose etc tag (this can be made here) - a note
        //p&l on that trade, if closing.  In, like, SCREEN-SIZED FONT FADE-EFFECT
        //kinda like Flash
        //log the booking of that p&l and display it at the left... FIRST
        //your p&L at this point
        
        <table id='tradeLog'>
            <thead>
                <tr><th colSpan="2">Trade Log</th></tr>
                <tr>
                    <th>Time</th>
                    <th>Side</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
            </thead>

            <tbody>
            {trades.map(tradeLogEntry)}
            </tbody>
        </table>
    )
}

export default TradeLog;
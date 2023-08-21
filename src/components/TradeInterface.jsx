import React from 'react';
import { useEffect } from 'react';
//import BuyButton from '.';
import { doc, updateDoc } from "firebase/firestore";

function TradeInterface({data,position,costBasis,bookPnl,db,uid,netLiq}) {
    const pnl = (bookPnl+position*(data.close-costBasis)).toFixed(2);
    //pnl is somehow still a string, need to parseFloat it below...
    const userDoc = doc(db,"trainees",uid);

    useEffect(() => {
        const newNetLiq = parseFloat(netLiq) + parseFloat(pnl);
        updateDoc(userDoc,{
            netLiq: newNetLiq
        })
      }, [pnl]);
    
    return(
        <table id="tradeInterface">
            <tbody>
                <tr>
                    <th><h2>Volume</h2></th>
                    <th><h2>Last Price</h2></th>
                </tr>
                <tr>
                    <td><h2>{data.volume}</h2></td>
                    <td><h2>${data.close.toLocaleString('en-US', {maximumFractionDigits:2})}</h2></td>
                </tr>
                <tr>
                    <th><h2>Net Position</h2></th>
                    <td><h2>{position}</h2></td>
                </tr>
                <tr>
                    <th><h2>P&L</h2></th>
                    <td><h2>${pnl.toLocaleString('en-US', {maximumFractionDigits:2})}</h2></td>
                </tr>
            </tbody>
        </table>
    )
    }

export default TradeInterface;                                                                  
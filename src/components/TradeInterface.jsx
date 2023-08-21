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
                    <th>Volume</th>
                    <th>Last Price</th>
                </tr>
                <tr>
                    <td>{data.volume}</td>
                    <td>${data.close.toLocaleString('en-US', {maximumFractionDigits:2})}</td>
                </tr>
                <tr>
                    <th>Net Position</th>
                    <td>{position}</td>
                </tr>
                <tr>
                    <th>P&L</th>
                    <td>${pnl.toLocaleString('en-US', {maximumFractionDigits:2})}</td>
                </tr>
            </tbody>
        </table>
    )
    }

export default TradeInterface;                                                                  
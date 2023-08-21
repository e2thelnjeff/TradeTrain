import React from "react";
import moment from "moment-timezone";

function PriceTable(data){
    data = data.data;
    

    return(
      <table id="priceTable">
        <tbody>
          <tr>
            <td>Time: </td>
            <td>{moment(data.date).tz('America/New_York').format('h:mm')}</td>
          </tr>
          <tr>
            <td>High: </td>
            <td>${parseFloat(data.high).toLocaleString('en-US', {maximumFractionDigits:2})}</td>
          </tr>
          <tr>
            <td>Open: </td>
            <td>${parseFloat(data.open).toLocaleString('en-US', {maximumFractionDigits:2})}</td>
          </tr>
          <tr>
            <td>Low: </td>
            <td>${parseFloat(data.low).toLocaleString('en-US', {maximumFractionDigits:2})}</td>
          </tr>
        </tbody>
      </table>
    )
}
export default PriceTable
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
            <td>{data.high}</td>
          </tr>
          <tr>
            <td>Open: </td>
            <td>{data.open}</td>
          </tr>
          <tr>
            <td>Low: </td>
            <td>{data.low}</td>
          </tr>
        </tbody>
      </table>
    )
}
export default PriceTable
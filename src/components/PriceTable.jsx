import React from "react";

function PriceTable(data){
    data = data.data;
    

    return(
      <table id="priceTable">
        <tbody>
          <tr>
            <td>Date: </td>
            <td>{data.date}</td>
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
import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);

  async function getQuote(){

    setCount((count)=>count+1);

    const postOptions = {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type': 'application/json'
        },
      body: JSON.stringify(count)
    };

    //const postResponse = await fetch('http://localhost:3000/api',postOptions);

    const results = await fetch('http://localhost:3000/api?count='+count).then((res)=>res.json());
    
    console.log("drum roll");
    console.log("Close price is: " + results.close);
    
    setIndex(index + 1);
    console.log(index);
    
    setData(results);
  };
                                                                             

  return (
    <>
      <div>
            <h1>{data.symbol}</h1><br/>
            <table>
            <tr>
              <td>Date: </td>
              <td>{data.date}</td>
            </tr>
            <tr>
              <td>Open: </td>
              <td>{data.open}</td>
            </tr>
            <tr>
              <td>High: </td>
              <td>{data.high}</td>
            </tr>
            <tr>
              <td>Low: </td>
              <td>{data.low}</td>
            </tr>
            <tr>
              <td>Close (Last Price): </td>
              <td>{data.close}</td>
            </tr>
            <tr>
              <td>Volume: </td>
              <td>{data.volume}</td>
            </tr>
            </table>
        <br/>
        <p>
          <button onClick={() => getQuote()}>Get Next Price</button>
        </p>
        </div>        
    </>
  )
};

export default App

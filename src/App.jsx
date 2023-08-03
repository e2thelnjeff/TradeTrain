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
                                                                                                     
  //getQuote(count);  
  //getQuote(0);

  return (
    <>
      <div>
            <h1>{data.symbol}</h1><br/>
            <br/>
            Date:{data.date}<br/>
            <br/>
            Open: {data.open}<br/>
            <br/>
            High: {data.high}<br/>
            <br/>
            Low: {data.low}<br/>
            <br/>
            Close (Last Price): {data.close}<br/>
            <br/>
            Volume: {data.volume}<br/>
        <br/>
        <p>
          <button onClick={() => getQuote()}>Get Next Price</button>
        </p>
        </div>        
    </>
  )
};

export default App

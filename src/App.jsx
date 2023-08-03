import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [symbol_days, setSymbolDays] = useState([]);
  const [selected_symbol_day, setSelectedSymbolDay] = useState("2017-09-29_GOOGL");
  if (symbol_days.length == 0) {
    getSymbol_Days()
  }

  async function getSymbol_Days(){
    const response = await fetch('http://localhost:3000/api/get_symbol_days').then((res)=>res.json());
    //symbol_days.file_names.forEach((element)=>console.log(element));
    setSymbolDays(response.file_names)
  }


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

    const results = await fetch(`http://localhost:3000/api?count=${count}&symbol_day=${selected_symbol_day}`).then((res)=>res.json());
    
    console.log("drum roll");
    console.log("Close price is: " + results.close);
    
    setIndex(index + 1);
    console.log(index);
    
    setData(results);
  };

  return (
    <>
      <div>
        <h1>{data.symbol}</h1>
        <p>
          <select class="ui dropdown" title='Symbol Day' id='symbo_day_selection' onChange={()=>setSelectedSymbolDay(symbo_day_selection.value)}>
            {symbol_days.map((symbol_day, i)=>{
              return <option className='item' key={i} >{symbol_day}</option>
            })}
          </select>
        </p>
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

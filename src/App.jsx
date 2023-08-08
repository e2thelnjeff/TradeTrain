import { useEffect, useState } from 'react'
import './styles/App.css'
import GridEqualWidth from './components/GridEqualWidth.jsx'
import BuyButton from './components/BuyButton'
import SellButton from './components/SellButton'
import Input from './components/Input'
import PriceTable from './components/PriceTable'

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [symbol_days, setSymbolDays] = useState([]);
  const [selected_symbol_day, setSelectedSymbolDay] = useState("2017-09-29_GOOGL");
  const API_URL = 'http://localhost:3000/api'

  if (symbol_days.length == 0) {
    getSymbol_Days()
  }

  async function getSymbol_Days(){
    const response = await fetch(`${API_URL}/get_symbol_days`).then((res)=>res.json());
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

    const results = await fetch(`${API_URL}?count=${count}&symbol_day=${selected_symbol_day}`).then((res)=>res.json());
    
    console.log("drum roll");
    console.log("Close price is: " + results.close);
    
    setData(results);
  };

  return (
    <>
      <div>
        <h1>{data.symbol}</h1>

        <p>
          <select className="ui dropdown" title='Symbol Day' id='symbo_day_selection' onChange={()=>setSelectedSymbolDay(symbo_day_selection.value)}>
            {symbol_days.map((symbol_day, i)=>{
              return <option className='item' key={i} >{symbol_day}</option>
            })}
          </select>
        </p>
        <PriceTable data={data}/>
        <br/>
        <p>
          <button id="nextQuote" onClick={() => getQuote()}>Get Next Price</button>
        </p>

            {data.high}

            <BuyButton /> <Input />
          
            {data.volume} 
            <br/>
            {data.close}
          
          
          <SellButton />
            {data.low}

      </div>
    </>
  )
};

export default App

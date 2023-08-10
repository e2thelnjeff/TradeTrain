import { useEffect, useState } from 'react'
import './styles/App.css'
import BuyButton from './components/BuyButton'
import SellButton from './components/SellButton'
import Input from './components/Input'
import PriceTable from './components/PriceTable'
import TradeInterface from './components/TradeInterface'

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [symbol_days, setSymbolDays] = useState([]);
  const [selected_symbol_day, setSelectedSymbolDay] = useState("2017-09-29_GOOGL");
  const API_URL = 'http://localhost:3000/api'
  const [position, setPosition] = useState(0);
  const [costBasis, setCostBasis] = useState(0);

  if (symbol_days.length == 0) {
    getSymbol_Days()
  }

  async function getSymbol_Days(){
    const response = await fetch(`${API_URL}/get_symbol_days`).then((res)=>res.json());
    //symbol_days.file_names.forEach((element)=>console.log(element));
    setSymbolDays(response.file_names)
  }

  async function buy(quantity,price){
    setPosition((position)=>position+quantity);
    //it's not picking up the new position quickly enough within this function

    setCostBasis((costBasis)=>(costBasis*position+quantity*price)/(position+quantity));
    //console.log('costBasis is now: ' + costBasis);
  }

  async function sell(quantity,price){
    setPosition((position)=>position-quantity);
    setCostBasis((costBasis)=>(costBasis*position+quantity*price)/(position+quantity)) 
    // may need to call aaseparate function to set ccost basis b of lags
  }

  async function getQuote(){

    setCount((count)=>count+1);

    const results = await fetch(`${API_URL}?count=${count}&symbol_day=${selected_symbol_day}`).then((res)=>res.json());
    
    console.log("drum roll");
    
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

        <TradeInterface data={data} position={position} costBasis={costBasis}/>

        <table>
          <tbody>
            <tr>
            <button id="buy" onClick={()=>buy(1000,data.close)}>BUY</button>
            {console.log('HTML cost basis is now: ' + costBasis)}
            <button id="sell" onClick={()=>sell(500,data.close)}>SELL</button>
            </tr>
          </tbody>
        </table>

        <Input />
        <br/>
        {costBasis}
      </div>
    </>
  )
};

export default App

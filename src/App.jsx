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
  const [index, setIndex] = useState(0);
  const [symbol_days, setSymbolDays] = useState([]);
  const [selected_symbol_day, setSelectedSymbolDay] = useState("2017-09-29_GOOGL");
  const API_URL = 'http://localhost:3000/api'
  const [position, setPosition] = useState(0);
  const [costBasis, setCostBasis] = useState(0);
  const [bookPnl, setBookPnl] = useState(0);
  const [tradeQuantity, setTradeQuantity] = useState(0);

  const handleTradeQuantityChange = (event) =>{
    //console.log('datatype is: ' + typeof event.target.value); 
    setTradeQuantity(parseInt(event.target.value));
  }

  if (symbol_days.length == 0) {
    getSymbol_Days()
  }

  async function getSymbol_Days(){
    const response = await fetch(`${API_URL}/get_symbol_days`).then((res)=>res.json());
    //symbol_days.file_names.forEach((element)=>console.log(element));
    setSymbolDays(response.file_names)
  }

  async function buyTrade(quantity){
    if (position < 0) {
      if (quantity >= Math.abs(position)){
        //this means they're short and buying to get flat or flip (i.e. open) long
        setBookPnl((bookPnl)=>bookPnl+(costBasis-data.close)*Math.abs(position));
        setPosition((position)=>position+quantity);
        position+quantity == 0 ? setCostBasis(()=>0) : setCostBasis(()=>data.close);
      } else{
        //this else means they're short and buying to close
        setBookPnl((bookPnl)=>bookPnl+(costBasis-data.close)*quantity);
        setPosition((position)=>position+quantity);
        //costBasis wouldn't change
        }
      } else{
          //implies their position is flat or long
          //no pnl to book
          setPosition((position)=>position+quantity);
          position == 0 ? setCostBasis(()=>data.close) : setCostBasis((costBasis)=>((costBasis*position)+(quantity*data.close))/(quantity+position));
        }
    };

  async function sellTrade(quantity){
    if (position > 0){
      if (quantity >= position){
          setBookPnl((bookPnl)=>bookPnl+(data.close-costBasis)*position);
          setPosition((position)=>position-quantity);
          position-quantity == 0 ? setCostBasis(()=>0) : setCostBasis(()=>data.close);
        } else{
          //long and selling to close
          setBookPnl((bookPnl)=>bookPnl+(data.close-costBasis)*quantity);
          setPosition((position)=>position-quantity);
          //costBasis wouldn't change
        }
    } else{
          //implies their position is flat or short
          //no pnl to book
          setPosition((position)=>position-quantity);
          position == 0 ? setCostBasis(()=>data.close) : setCostBasis((costBasis)=>((costBasis*Math.abs(position))+(quantity*data.close))/(quantity+Math.abs(position)));          
      }
  };

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

        <TradeInterface data={data} position={position} costBasis={costBasis} bookPnl={bookPnl}/>

        <table>
          <tbody>
            <tr>
            <button id="buy" onClick={()=>buyTrade(tradeQuantity)}>BUY</button>
            <button id="sell" onClick={()=>sellTrade(tradeQuantity)}>SELL</button>
            </tr>
          </tbody>
        </table>

        <input type='number' id='tradeQuantity' onChange={handleTradeQuantityChange} />
        <br/>
        {costBasis}
      </div>
    </>
  )
};

export default App

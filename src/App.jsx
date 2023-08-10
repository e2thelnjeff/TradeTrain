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

  if (symbol_days.length == 0) {
    getSymbol_Days()
  }

  async function getSymbol_Days(){
    const response = await fetch(`${API_URL}/get_symbol_days`).then((res)=>res.json());
    //symbol_days.file_names.forEach((element)=>console.log(element));
    setSymbolDays(response.file_names)
  }

  async function buyTrade(quantity,price){
    if (position < 0) {
      if (quantity >= abs(position)){
        //this means they're short and buying to get flat or flip (i.e. open) long
        setBookPnl((bookPnl)=>bookPnl+(costBasis-data.close)*abs(position));
        setPosition((position)=>position+quantity);
        position+quantity == 0 ? setCostBasis(()=>0) : setCostBasis(()=>data.close);
      } else{
        //this else they're short and buying to close
        //this else implies quantity < abs(position)
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

  async function sellTrade(quantity,price){
    if (position > 0){
      if (quantity >= position){
          setBookPnl((bookPnl)=>bookPnl+(data.close-costBasis)*position);
          setPosition((position)=>position+quantity);
          position+quantity == 0 ? setCostBasis(()=>0) : setCostBasis(()=>data.close);
        } else{
          //long and selling to close
          setBookPnl((bookPnl)=>bookPnl+(data.close-costBasis)*quantity);
          setPosition((position)=>position-quantity);
          //costBasis wouldn't change
        }
    } else{
          //implies their position is flat or short
          //no pnl to book
          setPosition((position)=>position+quantity);
          position == 0 ? setCostBasis(()=>data.close) : setCostBasis((costBasis)=>((costBasis*abs(position))+(quantity*data.close))/(quantity+abs(position)));          
      }
  };

  
  /*async function buy(quantity,price){
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
  */

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
            <button id="buy" onClick={()=>buyTrade(1000,data.close)}>BUY</button>
            <button id="sell" onClick={()=>sellTrade(500,data.close)}>SELL</button>
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

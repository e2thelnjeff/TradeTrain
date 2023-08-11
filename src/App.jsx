import { useEffect, useState } from 'react'
import './styles/App.css'
import BuyButton from './components/BuyButton'
import SellButton from './components/SellButton'
import Input from './components/Input'
import PriceTable from './components/PriceTable'
import TradeInterface from './components/TradeInterface'
import {Bar} from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { Grid } from 'semantic-ui-react'

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [symbol_days, setSymbolDays] = useState([]);
  const [selected_symbol_day, setSelectedSymbolDay] = useState("2017-09-29_GOOGL");
  const API_URL = 'http://localhost:3000/api';
  const [position, setPosition] = useState(0);
  const [costBasis, setCostBasis] = useState(0);
  const [chartData, setChartData] = useState({datasets: []});
  const [chartOptions, setChartOptions] = useState();

  if (symbol_days.length == 0) {
    getSymbol_Days();
  }

  async function getSymbol_Days(){
    const response = await fetch(`${API_URL}/get_symbol_days`).then((res)=>res.json());
    //symbol_days.file_names.forEach((element)=>console.log(element));
    setSymbolDays(response.file_names);
  }

  async function buy(quantity,price){
    setPosition((position)=>position+quantity);
    //it's not picking up the new position quickly enough within this function

    setCostBasis((costBasis)=>(costBasis*position+quantity*price)/(position+quantity));
    //console.log('costBasis is now: ' + costBasis);
  }

  async function sell(quantity,price){
    setPosition((position)=>position-quantity);
    setCostBasis((costBasis)=>(costBasis*position+quantity*price)/(position+quantity));
    // may need to call aaseparate function to set ccost basis b of lags
  }

  async function getQuote(){

    setCount((count)=>count+1);

    const results = await fetch(`${API_URL}?count=${count}&symbol_day=${selected_symbol_day}`).then((res)=>res.json());
    
    console.log("drum roll");
    
    setData(results);
  };

  async function getChartData(symbol_day) {
    const results = await fetch(`${API_URL}/get_x_bars?end=${count}&symbol_day=${symbol_day}`).then((res)=>res.json());
    console.log(`Getting new chart data...`);
    let closeData = results.map((item) => item['close'])
    let min = Math.min(...closeData) - 0.5 // setting the minimum chart value to a little less than our lowest value
    let chartOptions = {
      responseive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: symbol_day,
        }
      },
      scales: {
        yAxis: {
          min: min
        }
      }
    }

    setChartOptions(chartOptions);

    setChartData({
        labels: results.map((item)=>[item['date']]),
        datasets: [{
          label: results[0]['symbol'],
          data: closeData,
          borderColor: "black",
          backgroundColor: "red"
        }]
      }
    );
  }

  function handleSymbolDaySelection() {
      setSelectedSymbolDay(symbol_day_selection.value)
      setTimeout(()=>{
        getChartData(symbol_day_selection.value)
      }, 1000);
      setTimeout(()=>console.log(chartData, symbol_day_selection.value, chartOptions), 2000)
      
      
  }


  return (
    <>
      <Grid columns={2}>
        <Grid.Column>
          <h1>{data.symbol}</h1>
          <div id='chartContainer'>
            <Bar options={chartOptions} data={chartData} id='bar'/>
          </div>
        </Grid.Column>

        <Grid.Column>
          <PriceTable data={data}/>
        </Grid.Column>
      </Grid>
      <p>
        <select className="ui dropdown" title='Symbol Day' id='symbol_day_selection' onChange={handleSymbolDaySelection}>
          {symbol_days.map((symbol_day, i)=>{
            return <option className='item' key={i} >{symbol_day}</option>
          })}
        </select>
      </p>
      
      <br/>
      <p>
        <button id="nextQuote" onClick={() => getQuote()}>Get Next Price</button>
      </p>

      <TradeInterface data={data} position={position} costBasis={costBasis}/>
      <div id='buyAndSell'>
          <button id="buy" onClick={()=>buy(1000,data.close)}>BUY</button>
          {console.log('HTML cost basis is now: ' + costBasis)}
          <button id="sell" onClick={()=>sell(500,data.close)}>SELL</button>
      </div>
      <Input />
      <br/>
      {costBasis}
    </>
  )
};

export default App

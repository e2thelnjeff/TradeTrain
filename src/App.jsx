import { useEffect, useState } from 'react'
import './styles/App.css'
import BuyButton from './components/BuyButton'
import SellButton from './components/SellButton'
import Input from './components/Input'
import PriceTable from './components/PriceTable'
import TradeInterface from './components/TradeInterface'
import { Line } from 'react-chartjs-2'
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
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({ responseive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: "", } }, scales: { yAxis: { min: 0 } } });
  const [bookPnl, setBookPnl] = useState(0);
  const [tradeQuantity, setTradeQuantity] = useState(1000);



  if (symbol_days.length == 0) {
    getSymbol_Days();
  }

  async function getSymbol_Days() {
    const response = await fetch(`${API_URL}/get_symbol_days`).then((res) => res.json());
    //symbol_days.file_names.forEach((element)=>console.log(element));
    setSymbolDays(response.file_names);
  }

  function handleSymbolDaySelection() {
    setSelectedSymbolDay(symbol_day_selection.value)
    setTimeout(() => {
      getChartData(symbol_day_selection.value)
    }, 1000);
    setTimeout(() => console.log(chartData, symbol_day_selection.value, chartOptions), 2000)
  }

  async function getQuote() {

    setCount((count) => count + 1);

    const results = await fetch(`${API_URL}?count=${count}&symbol_day=${selected_symbol_day}`).then((res) => res.json());

    console.log("drum roll");

    setData(results);
  };




  async function buyTrade(quantity) {
    if (position < 0) {
      if (quantity >= Math.abs(position)) {
        //this means they're short and buying to get flat or flip (i.e. open) long
        setBookPnl((bookPnl) => bookPnl + (costBasis - data.close) * Math.abs(position));
        setPosition((position) => position + quantity);
        position + quantity == 0 ? setCostBasis(() => 0) : setCostBasis(() => data.close);
      } else {
        //this else means they're short and buying to close
        setBookPnl((bookPnl) => bookPnl + (costBasis - data.close) * quantity);
        setPosition((position) => position + quantity);
        //costBasis wouldn't change
      }
    } else {
      //implies their position is flat or long
      //no pnl to book
      setPosition((position) => position + quantity);
      position == 0 ? setCostBasis(() => data.close) : setCostBasis((costBasis) => ((costBasis * position) + (quantity * data.close)) / (quantity + position));
    }
  };

  async function sellTrade(quantity) {
    if (position > 0) {
      if (quantity >= position) {
        setBookPnl((bookPnl) => bookPnl + (data.close - costBasis) * position);
        setPosition((position) => position - quantity);
        position - quantity == 0 ? setCostBasis(() => 0) : setCostBasis(() => data.close);
      } else {
        //long and selling to close
        setBookPnl((bookPnl) => bookPnl + (data.close - costBasis) * quantity);
        setPosition((position) => position - quantity);
        //costBasis wouldn't change
      }
    } else {
      //implies their position is flat or short
      //no pnl to book
      setPosition((position) => position - quantity);
      position == 0 ? setCostBasis(() => data.close) : setCostBasis((costBasis) => ((costBasis * Math.abs(position)) + (quantity * data.close)) / (quantity + Math.abs(position)));
    }
  };

  async function getQuote(increment=false, symbolday=selected_symbol_day) {
    if (increment) {
      setCount((count) => count + 1);
    }
    
    const results = await fetch(`${API_URL}?count=${count}&symbol_day=${symbolday}`).then((res) => res.json());

    console.log("drum roll");
    console.log(results);

    setData(results);
    getChartData(symbolday);
  };

  async function getChartData(symbol_day) {
    const results = await fetch(`${API_URL}/get_x_bars?end=${count}&symbol_day=${symbol_day}`).then((res) => res.json());
    console.log(`Getting new chart data...`);
    let closeData = results.map((item) => item['close'])
    //let min = Math.min(...closeData) - 0.5 // setting the minimum chart value to a little less than our lowest value
    // let max = 1.5*(closeData.avg-closeData.min   )Math.min(...closeData)
    let max = closeData+1.5*(Math.max(...closeData)-closeData)
    let min = closeData-1.5*(closeData-Math.min(...closeData))
    // maybe worth allowing these settings to vary/be varied for the user.  To test for bias, of sorts.  or to TRAIN.
    // would allow ppl to swith up custom "views"
    // 'glances'

    let chartOptions = {
      responsive: true,
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
          min: min,
          max: max
        }
      }
    }

    setChartOptions(chartOptions);
    setChartData({
      labels: results.map((item) => [
        // convert full utc to HH:MM format in NYSE time
        `${new Date(item['date']).getUTCHours() - 4}:${new Date(item['date']).getUTCMinutes()}`
      ]),
      
      datasets: [{
        label: symbol_day.slice(symbol_day.indexOf('_') + 1), // slicing symbol out of symbol day
        data: closeData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }]
    }
    );
  }

  function handleSymbolDaySelection() {
    setSelectedSymbolDay(symbol_day_selection.value);
    setTimeout(()=>getQuote(false, symbol_day_selection.value), 1000);
    setTimeout(() => {
      getChartData(symbol_day_selection.value);
    }, 2000);
    setTimeout(() => console.log(chartData, symbol_day_selection.value, chartOptions), 3000);
  }

  const handleTradeQuantityChange = (event) => {
    //console.log('datatype is: ' + typeof event.target.value); 
    setTradeQuantity(parseInt(event.target.value));
  }
  
  return (
    <>
      <Grid columns={2}>
        <Grid.Column>
          <h1>{data.symbol}</h1>
          <div id='chartContainer'>
            <Line options={chartOptions} data={chartData} id='line' />
          </div>
        </Grid.Column>

        <Grid.Column>
          <PriceTable data={data} />
        </Grid.Column>
      </Grid>
      <select className="ui dropdown" title='Symbol Day' id='symbol_day_selection' onChange={handleSymbolDaySelection}>
        {symbol_days.map((symbol_day, i) => {
          return <option className='item' key={i} >{symbol_day}</option>
        })}
      </select>
      <p>
        <button id="nextQuote" onClick={() => getQuote(true)}>Get Next Price</button>
      </p>

      <TradeInterface data={data} position={position} costBasis={costBasis} bookPnl={bookPnl} />

      <div id='buyAndSell'>
        <button id="buy" onClick={() => buyTrade(tradeQuantity)}>BUY</button>
        <button id="sell" onClick={() => sellTrade(tradeQuantity)}>SELL</button>
      </div>

      <input type='number' id='tradeQuantity' defaultValue="1000" onChange={handleTradeQuantityChange} />
      <p>
        {costBasis}
      </p>
    </>
  )
};

export default App

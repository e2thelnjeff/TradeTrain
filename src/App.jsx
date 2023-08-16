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
import TradeLog from './components/TradeLog'
import moment from 'moment-timezone'

function App() {
  const [count, setCount] = useState(1);
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
  
  //const [tradeSide, setTradeSide] = useState('');
  //const [symbol, setSymbol] = useState('GOOGL');
  //const [tradeTime, setTradeTime] = useState('');
  const [trades, setTrades] = useState([]);

  //on page load
  useEffect(() => {
    getSymbol_Days();
    getQuote(false);
  }, []);






  async function recordTrade(tradeSide){
    const trade={
      //symbol: symbol,
      //timeStamp: tradeTime,
      side: tradeSide,
      quantity: tradeQuantity,
      price: data.close
    }

    const copyOfTrades=[...trades];
    copyOfTrades.push(trade);
    setTrades(copyOfTrades);
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
    recordTrade('BUY');
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
    recordTrade('SELL');
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
    let min = Math.min(...closeData) - 0.05 // setting the minimum chart value to a little less than our lowest value
    let max = Math.max(...closeData) + 0.05 // setting the minimum chart value to a little less than our lowest value
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
        moment(data.date).tz('America/New_York').format('h:mm')
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
          <Grid.Row>
            <select className="ui dropdown" title='Symbol Day' id='symbol_day_selection' onChange={handleSymbolDaySelection}>
          {symbol_days.map((symbol_day, i) => {
          return <option className='item' key={i} value={symbol_day}>{symbol_day}</option>
        })}
          </select>
          </Grid.Row>
          
          
          

          <Grid.Row>
            <h1>{data.symbol}</h1>
              <div id='chartContainer'>
                <Line options={chartOptions} data={chartData} id='line' />
              </div>
          </Grid.Row>

          <Grid.Row>
            <Grid columns={2}>
              <Grid.Column floated='left'>
                <div id="tradeInterface">
                  <TradeInterface data={data} position={position} costBasis={costBasis} bookPnl={bookPnl} />
                </div>
              </Grid.Column>
              <Grid.Column floated='right'>
                <div>
                  <PriceTable data={data} />
                </div>
              </Grid.Column>
            </Grid>
          </Grid.Row>

          <Grid.Row>
            <div id='buyAndSell'>
              <button id="buy" onClick={() => buyTrade(tradeQuantity)}>BUY</button>
              <button id="sell" onClick={() => sellTrade(tradeQuantity)}>SELL</button>
            </div>
            <input type='number' id='tradeQuantity' defaultValue="1000" onChange={handleTradeQuantityChange} />
          </Grid.Row>

          <Grid.Row>
            <button id="nextQuote" onClick={() => getQuote(true)}>Get Next Price</button>
          </Grid.Row>
          
        </Grid.Column>

        <Grid.Column>
          <div>
            <TradeLog trades={trades} />
          </div>
        </Grid.Column>
      </Grid>
      
    </>
  )
};

export default App

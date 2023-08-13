import { useEffect, useState } from 'react'
import './styles/App.css'
import BuyButton from './components/BuyButton'
import SellButton from './components/SellButton'
import Input from './components/Input'
import PriceTable from './components/PriceTable'
import TradeInterface from './components/TradeInterface'
import { Bar } from 'react-chartjs-2'
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
  const [chartOptions, setChartOptions] = useState();
  const [bookPnl, setBookPnl] = useState(0);
  const [tradeQuantity, setTradeQuantity] = useState(0);

  const handleTradeQuantityChange = (event) => {
    //console.log('datatype is: ' + typeof event.target.value); 
    setTradeQuantity(parseInt(event.target.value));
  }

  if (symbol_days.length == 0) {
    getSymbol_Days();
  }

  async function getSymbol_Days() {
    const response = await fetch(`${API_URL}/get_symbol_days`).then((res) => res.json());
    //symbol_days.file_names.forEach((element)=>console.log(element));
    setSymbolDays(response.file_names);
  }

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

  async function getQuote() {

    setCount((count) => count + 1);

    const results = await fetch(`${API_URL}?count=${count}&symbol_day=${selected_symbol_day}`).then((res) => res.json());

    console.log("drum roll");

    setData(results);
  };

  async function getChartData(symbol_day) {
    const results = await fetch(`${API_URL}/get_x_bars?end=${count}&symbol_day=${symbol_day}`).then((res) => res.json());
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
      labels: results.map((item) => [item['date']]),
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
    setTimeout(() => {
      getChartData(symbol_day_selection.value)
    }, 1000);
    setTimeout(() => console.log(chartData, symbol_day_selection.value, chartOptions), 2000)


  }


  return (
    <>
      <Grid columns={2}>
        <Grid.Column>
          <h1>{data.symbol}</h1>
          <div id='chartContainer'>
            <Bar options={chartOptions} data={chartData} id='bar' />
          </div>
        </Grid.Column>

        <Grid.Column>
          <PriceTable data={data} />
        </Grid.Column>
      </Grid>
      <p>
        <select className="ui dropdown" title='Symbol Day' id='symbol_day_selection' onChange={handleSymbolDaySelection}>
          {symbol_days.map((symbol_day, i) => {
            return <option className='item' key={i} >{symbol_day}</option>
          })}
        </select>
      </p>
      <p>
        <button id="nextQuote" onClick={() => getQuote()}>Get Next Price</button>
      </p>

      <TradeInterface data={data} position={position} costBasis={costBasis} bookPnl={bookPnl} />

      <table>
        <tbody>
          <tr>
            <button id="buy" onClick={() => buyTrade(tradeQuantity)}>BUY</button>
            <button id="sell" onClick={() => sellTrade(tradeQuantity)}>SELL</button>
          </tr>
        </tbody>
      </table>

      <input type='number' id='tradeQuantity' onChange={handleTradeQuantityChange} />
      <br />
      {costBasis}
    </>
  )
};

export default App

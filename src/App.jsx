import { useEffect, useState } from 'react';
import './styles/App.css';
import Input from './components/Input';
import PriceTable from './components/PriceTable';
import TradeInterface from './components/TradeInterface';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Grid } from 'semantic-ui-react';
import TradeLog from './components/TradeLog';
import moment from 'moment-timezone';
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import Login from './components/Login';
import { getFirestore, onSnapshot, collection, setDoc, doc } from "firebase/firestore";


function App() {
  const [count, setCount] = useState(1);
  const [data, setData] = useState([]);
  const [symbol_days, setSymbolDays] = useState([]);
  const [selected_symbol_day, setSelectedSymbolDay] = useState();
  const API_URL = 'http://localhost:3000/api';
  const [position, setPosition] = useState(0);
  const [costBasis, setCostBasis] = useState(0);
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({ responseive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: "", } }, scales: { yAxis: { min: 0 } } });
  const [bookPnl, setBookPnl] = useState(0);
  const [tradeQuantity, setTradeQuantity] = useState(1000);
  const [userName, setUserName] = useState("");
  const TICK_INTERVAL = 1000;
  
  const [trades, setTrades] = useState([]);
  const app = initializeApp({
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "tradetrain-11cc5.firebaseapp.com",
    projectId: "tradetrain-11cc5",
    storageBucket: "tradetrain-11cc5.appspot.com",
    messagingSenderId: "303887724769",
    appId: "1:303887724769:web:196471c135cf53921ec7a0",
    measurementId: "G-TG8BCF6GN1"
  });
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const db = getFirestore();
  //on page load
  useEffect(() => {
    getSymbol_Days();
    // Initialize Firebase
  }, []);

  useEffect(()=>{
    let id = setInterval(()=>{
      if (selected_symbol_day) {
        getQuote(true, selected_symbol_day);
      }
    },TICK_INTERVAL)
    return () => clearInterval(id);
  }, [count, selected_symbol_day])

  
  function signIn(){
    signInWithPopup(getAuth(), provider)
    .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log("Credential is: " + credential.json);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    setUserName(user.displayName);
    })
  }

  async function recordTrade(tradeSide){
    const trade={
      //symbol: symbol,
      //timeStamp: tradeTime,
      time: moment(data.date).tz('America/New_York').format('h:mm'),
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
    setTimeout(()=>{
      setData(results);
      getChartData(symbolday);
    }, 100)
  };

  async function getChartData(symbol_day) {
    const results = await fetch(`${API_URL}/get_x_bars?end=${count}&symbol_day=${symbol_day}`).then((res) => res.json());
    console.log(`Getting new chart data...`);
    let closeData = results.map((item) => item['close'])
    // possible feature in varying these

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
          beginAtZero: false
        }
      }
    }

    setChartOptions(chartOptions);
    setChartData({
      labels: results.map((item) => [
        // convert full utc to HH:MM format in NYSE time
        moment(item['date']).tz('America/New_York').format('h:mm')
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

  function handleSymbolDaySelection(symbol_day_selection) {
    setSelectedSymbolDay(symbol_day_selection);
    setTimeout(() => {
      getChartData(symbol_day_selection);
      setTimeout(()=>getQuote(false, symbol_day_selection), 100);
    }, 100);
    setTimeout(() => console.log(chartData, symbol_day_selection, chartOptions), 300)
  }

  const handleTradeQuantityChange = (event) => {
    //console.log('datatype is: ' + typeof event.target.value); 
    setTradeQuantity(parseInt(event.target.value));
  }
  
  return selected_symbol_day ? (
    <>
      <Grid columns={2}>
        <Grid.Column>
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
            {/*<button id="nextQuote" onClick={() => getQuote(true)}>Get Next Price</button>*/}
          </Grid.Row>
        </Grid.Column>

        <Grid.Column>
          <Grid columns={2}>
            <Grid.Column>
              <TradeLog trades={trades} />
            </Grid.Column>
            <Grid.Column>
              <h1>
                {`Welcome, ${userName}`}
              </h1>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </>
  ) : (
    //if no symbol day is selected
    <Login>
      {!userName ?
          //user must login
          <>
            <h2>Please sign in below...</h2>
            <button onClick={signIn}>Sign in with Google</button>
          </>
        :
          //select the symbol day
          <>
            <h2>Pick a day and symbol</h2>
            <select className="ui dropdown" title='Symbol Day' id='symbol_day_selection' onChange={(e)=>handleSymbolDaySelection(e.target.value)}>
                {symbol_days.map((symbol_day, i) => {
                return <option className='item' key={i} value={symbol_day}>{symbol_day}</option>
                })}
            </select>
          </>
      }
    </Login>
  )
};

export default App

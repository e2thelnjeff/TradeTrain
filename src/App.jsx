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

import { getFirestore, onSnapshot, collection, setDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import Account from './components/Account';
import Leaderboard from './components/Leaderboard';
import NotificationBox from './components/NotificationBox'

function App() {
  const [count, setCount] = useState(1);
  const [data, setData] = useState({"date":"2021-09-29T13:33:00.000Z","open":0,"high":0,"low":0,"close":0,"volume":0});
  const [symbol_days, setSymbolDays] = useState([]);
  const [selected_symbol_day, setSelectedSymbolDay] = useState();
  const API_URL = 'https://app-d6f2drtuva-uc.a.run.app/api';
  if(import.meta.env.DEV) {
    const API_URL = 'http://localhost:3000/api';
  }
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
    apiKey: "AIzaSyBldVPj-4ks84syXnCEsAc8nE6DDGspElE",
    authDomain: "tradetrain-11cc5.firebaseapp.com",
    projectId: "tradetrain-11cc5",  
    storageBucket: "tradetrain-11cc5.appspot.com",
    messagingSenderId: "303887724769",
    appId: "1:303887724769:web:196471c135cf53921ec7a0",
    measurementId: "G-TG8BCF6GN1"
  });
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const [netLiq,setNetLiq] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0);
  const [uid, setUid] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);

  const [notificationBox, setNotificationBox] = useState({'header': 'Watch this space for trading tips, feedback, and notices.', 'body': ''})
  const notifications = [
    {'header': "Buy low, sell high", 'body':""},
    {'header': "Ride your winners, cut your losers short", 'body':""},
    {'header': "Never do anything today that will prevent you from trading tomorrow.", 'body':""},
    {'header': "The market can remain irrational longer than you can remain solvent.", 'body':""},
    {'header': "The market will fluctuate.", 'body':""},
    {'header': "Every price is either a buy or a sale", 'body':""},
    {'header': "You may buy the bottom tick or sell the top tick exactly once in your career.  You are free to do the opposite as often as you wish.", 'body':""},
    {'header': "Make a trading plan, and stick to it.", 'body':""}

  ];

  //on page load
  useEffect(() => {
    getSymbol_Days();
    // Initialize Firebase
  }, []);

  useEffect(()=>{
    if (count > 390){
      setNotificationBox({'header': <a href="https://tradetrain-11cc5.firebaseapp.com">Market closed.  Click to play again.</a>, 'body':""})
    } else{
      let id = setInterval(()=>{
        function updateLeaderboard() {
          let traineeDocs = query(collection(db, "trainees"), where("netLiq", "!=", 500000),orderBy("netLiq", "desc"));
          getDocs(traineeDocs).then((trainDocs)=>{
            setLeaderboardData(trainDocs.docs);
          })
        
        }
        if (selected_symbol_day) {
          getQuote(true, selected_symbol_day);
          updateLeaderboard();
        }
      },TICK_INTERVAL)
      return () => clearInterval(id);
    }}, [count, selected_symbol_day])

  
  const db = getFirestore(app);


  async function getUserStats(user){
    setUid(user.uid);
    const userDoc = doc(db,"trainees",user.uid);
    const docSnap = (await getDoc(userDoc));
    console.log(user.displayName, user.uid)
    if (docSnap.exists()){
      const traineeData=docSnap.data()
      setNetLiq(traineeData.netLiq)
      setBuyingPower(traineeData.netLiq+buyingPower)
      console.log("netLiq is: ", traineeData.netLiq)
      } else{
        //create a trainee and give him a netLiq
        await setDoc(doc(db,"trainees",user.uid),{
          name: user.displayName,
          netLiq: 500000
        });
        setNetLiq(500000);
        setBuyingPower(500000);
      }
  }
  
  function signIn(){
    signInWithPopup(getAuth(), provider)
    .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    setUserName(user.displayName);
    console.log("uid is: ", user.uid)
    getUserStats(user);

    })
  }

  async function recordTrade(tradeSide){
    const trade={
      //symbol: symbol,
      time: moment(data.date).tz('America/New_York').format('h:mm'),
      side: tradeSide,
      quantity: tradeQuantity,
      price: data.close
    }

    const copyOfTrades=[...trades];
    copyOfTrades.push(trade);
    setTrades(copyOfTrades)
    let randomInt = Math.ceil(Math.random()*notifications.length)-1;
    setNotificationBox(notifications[randomInt]);
  }

  async function getSymbol_Days() {
    const response = await fetch(`${API_URL}/get_symbol_days`).then((res) => res.json());
    //symbol_days.file_names.forEach((element)=>console.log(element));
    setSymbolDays(response.file_names);
  }

  async function buyTrade(quantity) {
    if ((quantity*data.close) > buyingPower){
      console.log('insufficient funds');
      setNotificationBox({'header': "Insufficient funds.", 'body':""})
      return
    } else{
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
        setBuyingPower((buyingPower)=>(buyingPower - (quantity * data.close)));
      }
      recordTrade('BUY');
    }
  };

  async function sellTrade(quantity) {
    if (position > 0) {
      if (quantity >= position) {
        if (quantity == position){
          setBookPnl((bookPnl) => bookPnl + (data.close - costBasis) * position)
          setPosition((position) => position - quantity)
          position - quantity == 0 ? setCostBasis(() => 0) : setCostBasis(() => data.close)
        } else{

          return
        }
        
      } else {
        //long and selling to close
        setBookPnl((bookPnl) => bookPnl + (data.close - costBasis) * quantity);
        setPosition((position) => position - quantity);
        //costBasis wouldn't change
      }
    } else {
      //implies their position is flat or short
      //no pnl to book
      setNotificationBox({"header":"No short-sales (yet).", "body": ""});
      return
      setPosition((position) => position - quantity);
      position == 0 ? setCostBasis(() => data.close) : setCostBasis((costBasis) => ((costBasis * Math.abs(position)) + (quantity * data.close)) / (quantity + Math.abs(position)));
    }
    recordTrade('SELL');
    setBuyingPower((buyingPower)=>buyingPower+(quantity*data.close));
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
    setTradeQuantity(parseInt(event.target.value));
  }
  
  return selected_symbol_day ? (
    <>
      <Grid columns={2}>
        <Grid.Column>
          <Grid.Row>
            <h1>{data.symbol}</h1>
            <div id='topLeftTables'>
              <Grid columns={3} celled stretched>
                <Grid.Column width={0.3}>
                  <Account netLiq={netLiq} buyingPower={buyingPower} bookPnl={bookPnl}/>
                </Grid.Column>
                <Grid.Column width={0.3}>
                  <PriceTable data={data} />
                </Grid.Column>
                <Grid.Column width={0.3}>
                  <TradeInterface data={data} position={position} costBasis={costBasis} bookPnl={bookPnl} db={db} uid={uid} netLiq={netLiq} />
                </Grid.Column>
              </Grid>
            </div>
          </Grid.Row>
          <Grid.Row>
            <div id='chartContainer'>
              <Line options={chartOptions} data={chartData} id='line' />
            </div>
          </Grid.Row>

          <Grid.Row>
            {/*insert notif box*/}
            <NotificationBox notificationBox={notificationBox}/>
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
              <Leaderboard leaderboardData={leaderboardData}/>
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
            <h2>Pick a day and ticker symbol from the drop-down list to start the game.</h2>
            <h3>(But think fast: a whole minute of market data occurs every SECOND.)</h3>
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

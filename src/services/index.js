const cors = require('cors');
let corsOptions = {
    origin: '*',
   };

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
//app.use(express.static('public'));
app.use(express.json());
//app.use(cors(origin: ['http://localhost:3001']));
app.use(cors(corsOptions));
//app.use(cors());

//app.use((req,res,next) => {
  //  res.setHeader("Access-Control-Allow-Origin","*");
  //  res.header(
  //      "Access-Control-Allow-Headers",
  //      "Origin, X-Requested-With, Content-Type, Accept"
  //  );
  //  next();
//});

var count = 0;
const quotes = require('./trade_data/2019-01-04_MSFT.json');
const symbol = 'MSFT';

const date = quotes[count].date;
const open = quotes[count].open;
const high = quotes[count].high;
const low = quotes[count].low;
const close = quotes[count].close;
const volume = quotes[count].volume;

app.get("/api",function(req,res){
    const currentQuote = {
        symbol: symbol,
        date: date,
        open: open,
        high: high,
        low: low,
        close: close,
        volume: volume
    };
    res.send(currentQuote);
});

app.post("/api",function(req,res){
    //header = {};
    count =                                                             req.body;
    res.send("acknowledged");
    console.log("server side knows count as: " + count);    
}
);

app.listen(3000, () => console.log('Listening at 3000'));
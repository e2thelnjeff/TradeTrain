const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

let corsOptions = {
    origin: '*',
};
const app = express();
//app.use(express.static('public'));
app.use(express.json());
//app.use(cors(origin: ['http://localhost:3001']));
app.use(cors(corsOptions));
//app.use(cors());

var quotes = require('./trade_data/2019-01-04_MSFT.json');

//const date = quotes[count].date;
//const open = quotes[count].open;
//const high = quotes[count].high;
//const low = quotes[count].low;
//const close = quotes[count].close;
//const volume = quotes[count].volume;

app.get("/api",function(req,res){
    count = req.query.count;
    symbol_day = req.query.symbol_day;
    let symbol = symbol_day.slice(symbol_day.indexOf('_') + 1);
    if (symbol_day) {
        quotes = require(`./trade_data/${symbol_day}.json`);
        }
    
    const currentQuote = {
        symbol: symbol,
        date: quotes[count].date,
        open: quotes[count].open,
        high: quotes[count].high,
        low: quotes[count].low,
        close: quotes[count].close,
        volume: quotes[count].volume
    };
    
    console.log(req.query.count);
    res.send(currentQuote);
});

app.get("/api/get_symbol_days",function(req,res){
    fs.readdir(path.join(__dirname, 'trade_data'), (err, files)=>{
        if (err) {
            console.log(err);
        }
        const file_names = [];
        console.log('symbol days call');
        files.forEach((file, i)=>{
            files[i] = file.slice(0, -5);
        })
        res.send({file_names: files});
    })
});


/*
app.post("/api",function(req,res){
    //header = {};
    count = req.body;
    res.send("acknowledged");
    console.log("server side knows count as: " + count);    
}
);
*/

app.listen(3000, () => console.log('Listening at 3000'));
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const path = require('path');
const {onRequest} = require("firebase-functions/v2/https");

let corsOptions = {
    origin: '*',
};
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

var quotes = require('./trade_data/2019-01-04_MSFT.json');

app.get("/api",function(req, res){
    count = req.query.count;
    symbol_day = req.query.symbol_day;
    let symbol = symbol_day.slice(symbol_day.indexOf('_') + 1);
    if (symbol_day) {
        quotes = require(`./trade_data/${symbol_day}.json`);
    }
    
    const currentQuote = quotes[count];
    currentQuote.symbol = symbol;

    console.log(req.query.count);
    res.send(currentQuote);
});

app.get("/api/get_x_bars",function(req, res){
    end = parseInt(req.query.end);
    symbol_day = req.query.symbol_day;
    let symbol = symbol_day.slice(symbol_day.indexOf('_') + 1);
    if (symbol_day) {
        quotes = require(`./trade_data/${symbol_day}.json`);
    }
    
    const listOfSymbolDayMinutes = quotes.slice(0, end+1);
    listOfSymbolDayMinutes.symbol = symbol;

    res.send(listOfSymbolDayMinutes);
});

app.get("/api/get_symbol_days",function(req, res){
    fs.readdir(path.join(__dirname, 'trade_data'), (err, files)=>{
        if (err) {
            console.log(err);
        }
        console.log('symbol days call');
        files.forEach((file, i)=>{
            files[i] = file.slice(0, -5);
        })
        res.send({file_names: files});
    })
});


/*
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
*/

/*

const logger = require("firebase-functions/logger");
*/

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.app = onRequest(app);
//app.listen(3000, () => console.log('Listening at 3000'));
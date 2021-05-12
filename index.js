//const base = require('airtable').base('app53J40fOl2DXe7L');

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyJSZmlI8uWpSwtX'}).base('app53J40fOl2DXe7L');

const { Cryptonator } = require('node-crypto-api');
 
const cryptonator = new Cryptonator();
 
class errorNode {
    constructor(time,rate) {
        this.time = time;
        this.rate = rate;
    }
}

let errorList = [];

//ticker
 function getBTC() {
    for (let i=0; i < errorList.length; i++) {
        addToAirbase(errorList[0].time,errorList[0].rate);
        errorList.shift();
    }
    let currentTime = new Date();
    cryptonator.ticker('btc', 'usd')
        .then(function(value) {
            let rate = value.ticker.price; 
            addToAirbase(currentTime,rate)
        }) 
        .catch(console.error);
}


function addToAirbase(time,rate) {
    base('BTC Table').create([
    {
        "fields": {
            "Time": time,
            "Rates": rate
        }
    }], {typecast: true},function(err, records) {
        if (err) {
            //console.error(err);
            node = new errorNode(time,rate);
            errorList.push(node);
            return;
        }
        records.forEach(function (record) {
            console.log(record.getId());
            });
      });
}

setInterval(getBTC,60000)

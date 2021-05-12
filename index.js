
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyJSZmlI8uWpSwtX'}).base('app53J40fOl2DXe7L');

const { Cryptonator } = require('node-crypto-api');
 
const cryptonator = new Cryptonator();
 

/* keeping an error list for failed entries
   each node holds time and the rate at that time
*/
class errorNode {
    constructor(time,rate) {
        this.time = time;
        this.rate = rate;
    }
}

// init error list
let errorList = [];

//ticker
 function getBTC() {
     /* to avoid infinite loop, we take the current length of the error list, because the list will change,
        and try to add it to airtable. upon each trial we shift the list. 
        if we fail again, node is appended again to the list.
    */
    let currentErrorListLength = errorList.length; 
    for (let i=0; i < currentErrorListLength; i++) {
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
            /*  if we fail entering entries to airtable, we save the time and the rate, 
                and append it to error list
            */
            node = new errorNode(time,rate);
            errorList.push(node);
            return;
        }
        records.forEach(function (record) {
            console.log(record.getId());
            });
      });
}

//code runs every minute until termination
setInterval(getBTC,60000);

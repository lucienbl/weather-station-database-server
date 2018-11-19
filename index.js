const express = require('express');
const app = express();
const superagent = require('superagent');
var JsonDB = require('node-json-db');
var db = new JsonDB("db", true, false);

let response;

setInterval(async () => {
	console.log("Store data !");
	await superagent
	  .get('https://raw.githubusercontent.com/lucienbl/weather-station-api-response-simulator/master/api.json')
	  .set('accept', 'json')
	  .end((err, data) => {
	    response = JSON.parse(data.text);
	  });
	db.push(`/${Date.now()}`, response);
}, 60000); // one hour = 600000


app.get('/', function (req, res) {
  res.send(db.getData('/'));
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});

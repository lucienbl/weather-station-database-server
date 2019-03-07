const express = require('express');
const app = express();
const superagent = require('superagent');
var JsonDB = require('node-json-db');
var db = new JsonDB("db", true, true);

const ip = 'http://172.16.3.6'

let response;

setInterval(async () => {
	console.log("Store data !");
	await superagent
	  .get(`${ip}/data`)
	  .set('accept', 'json')
	  .end((err, data) => {
	  	if (data) {
	  		response = JSON.parse(data.text);
	  	}
	  	if (err) return console.log(err);
	  });
	db.push(`/${Date.now()}`, response);
}, 20000); // one hour = 600000

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.send(db.getData('/'));
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});

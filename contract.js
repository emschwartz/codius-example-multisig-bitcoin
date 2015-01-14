var express = require('express');
var app = express();
var Promise = require('bluebird');
var secrets = Promise.promisifyAll(require('secrets'));
var localstorage = Promise.promisifyAll(require('localstorage'));

app.get('/', function(req, res) {
  secrets.getSecretAsync()
    .then(localstorage.setItemAsync.bind(localstorage, 'secret'))
    .then(localstorage.getItemAsync.bind(localstorage))
    .then(function(secret){
      res.status(200).send(secret);
    });
});

app.listen(process.env.PORT);

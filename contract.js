var secrets = require('secrets');
var localstorage = require('localstorage');

var express = require('express');
var Bitcoin = require('bitcoinjs-lib');
var BigInteger = require('bigi');
var app = express();

app.get('/', function(req, res){
  res.send('POST a JSON Bitcoin transaction in hex format to get it signed');
});

app.post('/sign', bodyParser.json(), function(req, res) {
  secrets.getKeypair(function(error, secret){
    if (error) {
      res.status(500).send(error);
      return;
    }

    var key = new Bitcoin.ECKey(new BigInteger(keypair.private, 16), false);

    var tx, signature;
    try {
      tx = Bitcoin.Transaction.fromHex(data);
      signature = tx.sign(0, key);
    } catch (e) {
      res.status(400).send(error);
      return;
    }

    res.status(200).json({
      public_key: keypair.public,
      tx_signature: signature,
      host_signature: keypair.signature
    });
  });
});

app.listen(process.env.PORT);

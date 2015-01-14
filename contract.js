▽
var secrets = require('secrets');
var localstorage = require('localstorage');
// localstorage exposes async getItem and setItem methods

var express = require('express');
var bodyParser = require('body-parser');
var Bitcoin = require('bitcoinjs-lib');
var BigInteger = require('bigi');
var app = express();

app.get('/', function(req, res){
  res.send('POST a Bitcoin transaction in hex format to get it signed');
});

app.get('/pubkey', function(req, res){
  secrets.getKeypair(function(error, keypair){
    res.send(keypair.public);
  });  
});

app.post('/sign', bodyParser.text(), function(req, res) {
 secrets.getKeypair(function(error, keypair){
    if (error) {
      res.status(500).send(error);
      return;
    }
    console.log('Got request to sign tx');

    var key = new Bitcoin.ECKey(new BigInteger(keypair.private, 16), false);

    var tx, signature;
    try {
      tx = Bitcoin.Transaction.fromHex(req.body);
      var txbuilder = Bitcoin.TransactionBuilder.fromTransaction(tx);
      txbuilder.sign(0, key);
      tx = txbuilder.build();
    } catch (e) {
      res.status(400).send(e.message);
      return;
    }

    res.status(200).json({
      public_key: keypair.public,
      signed_tx: tx.toHex(),
      host_signature: keypair.signature
    });
  });
});

app.listen(process.env.PORT);
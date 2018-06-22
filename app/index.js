const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const Network = require('./network');
const Wallet = require('../wallet');
const Pool = require('../wallet/pool');

const HTTP_PORT = process.env.HTTP_PORT || 3000;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const pool = new Pool();
const network = new Network(bc, pool);

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.json(bc.chain);
});

app.post('/', (req, res) => {
	const block = bc.addBlock(req.body.data);
	console.log(`New block added: ${block.toString()}`);
	network.broadcastNewBlock();
	res.redirect('/');
});

app.get('/transactions', (req, res) => {
	res.json(pool.pool);
});

app.post('/transact', (req, res) => {
	const { recipient, amount } = req.body;
	const transaction = wallet.createTransaction(recipient, amount, pool);
	network.broadcastTransaction(transaction);
	res.redirect('/transactions');
});

app.get('/publickey', (req, res) => {
	res.json({publicKey: wallet.publicKey});
});

app.listen(HTTP_PORT, () => {
	console.log(`Server is up and running on port ${HTTP_PORT}`);
});

network.listen();
const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const Network = require('./network');

const HTTP_PORT = process.env.HTTP_PORT || 3000;

const app = express();
const bc = new Blockchain();
const network = new Network(bc);

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.json(bc.chain);
});

app.post('/', (req,res) => {
	const block = bc.addBlock(req.body.data);
	console.log(`New block added: ${block.toString()}`);
	network.broadcastNewBlock();
	res.redirect('/');
});

app.listen(HTTP_PORT, () => {
	console.log(`Server is up and running on port ${HTTP_PORT}`);
});

network.listen();
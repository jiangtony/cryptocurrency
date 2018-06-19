const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

const bc = new Blockchain();

app.get('/', (req, res) => {
	res.json(bc.chain);
});

app.post('/', (req,res) => {
	const block = bc.addBlock(req.body.data);
	console.log(`New block added: ${block.toString()}`);
	res.redirect('/');
});

app.listen(PORT, () => {
	console.log(`Server is up and running on port ${PORT}`);
});
// Network class
// Implementation of distributed blockchain

const Websocket = require('ws');
const NETWORK_PORT = process.env.NETWORK_PORT || 5000;
const MESSAGE_TYPES = { 
	chain: 'CHAIN',
	transaction: 'TRANSACTION'
};

// A string of all the nodes separated by commas
// Example: ws://localhost:5000,ws://localhost:5001,ws://localhost:5002
const nodes = process.env.NODES ? process.env.NODES.split(',') : [];

class Network {
	// Nodes can broadcast their block
	constructor(blockchain, pool) {
		this.blockchain = blockchain;
		this.pool = pool;
		this.sockets = [];
	}

	/** 
	 * The first instance of the blockchain can create a server that
	 * future instances will connect to using this function
	 */
	listen() {
		const server = new Websocket.Server({port: NETWORK_PORT});

		// Event Listener for connections to the websocket server
		server.on('connection', socket => this.connectSocket(socket));
		this.connectToNodes();
		console.log(`Listening for connections on port ${NETWORK_PORT}`);
	}

	// Add socket to the array 
	connectSocket(socket) {
		this.sockets.push(socket);
		console.log('Socket connected');
		this.messageHandler(socket);
		this.sendChain(socket);
	}

	// Later instances of the app will connect to the server when they are started
	connectToNodes() {
		nodes.forEach(node => {
			const socket = new Websocket(node);

			// Event listener that will connect when the socket is open
			socket.on('open', () => this.connectSocket(socket));
		});
	}

	messageHandler(socket) {
		// Event listener for messages sent in connectSocket function
		socket.on('message', message => {
			const data = JSON.parse(message);
			switch(data.type) {
				case MESSAGE_TYPES.chain:
					// Replace chain if received chain is longer
					this.blockchain.replaceChain(data.chain);
					break;
				case MESSAGE_TYPES.transaction:
					// Add a broadcasted transaction to the pool
					this.pool.addToPool(data.transaction);
					break;
			}
		});
	}

	// Send a message containing the blockchain to each socket in the server
	sendChain(socket) {
		socket.send(JSON.stringify({type: MESSAGE_TYPES.chain, chain: this.blockchain.chain}));
	}

	sendTransaction(socket, transaction) {
		socket.send(JSON.stringify({type: MESSAGE_TYPES.transaction, transaction}));
	}

	// Broadcast to other nodes when a new block has been added to the chain
	broadcastNewBlock() {
		this.sockets.forEach(socket => this.sendChain(socket));
	}

	// Broadcast a transaction to other nodes
	broadcastTransaction(transaction) {
		this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
	}
}

module.exports = Network;
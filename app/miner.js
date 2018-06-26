const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
// Miner class

class Miner{
	constructor(blockchain, pool, wallet, network) {
		this.blockchain = blockchain;
		this.pool = pool;
		this.wallet = wallet;
		this.network = network;
	}

	mine() {
		// Get valid transactions from the pool
		const validTransactions = this.pool.validTransactions();

		// Reward the miner
		validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));

		// Create a block consisting of the valid transactions
		const block = this.blockchain.addBlock(validTransactions);

		// Broadcast new block to synchronize
		this.network.broadcastNewBlock();

		// Clear the transaction pool
		this.pool.clear();

		// Broadcast to other nodes to clear their transaction pool
		this.network.broadcastClear();

		return block;
	}
}

module.exports = Miner;
// Wallet class
const Util = require('../util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
	constructor() {
		this.balance = INITIAL_BALANCE;
		this.pair = Util.generatePair();
		this.publicKey = this.pair.getPublic().encode('hex');
	}

	toString() {
		return `Wallet - 
			publicKey: ${this.publicKey.toString()}
			balance  : ${this.balance}`;
	}

	sign(hashedData) {
		return this.pair.sign(hashedData);
	}

	// Creates new or updates existing transaction
	createTransaction(recipient, amount, pool, blockchain) {
		this.balance = this.calculateBalance(blockchain);
		
		if (amount > this.balance) {
			console.log(`Amount of ${amount} exceeds current balance of ${this.balance}.`);
			return;
		}

		let transaction = pool.existingTransaction(this.publicKey);
		if(transaction) {
			transaction.update(this, recipient, amount);
		} else {
			transaction = Transaction.newTransaction(this, recipient, amount);
			pool.addToPool(transaction);
		}

		return transaction;
	}

	/** 
	 * A wallet's balance is calculated by finding the wallet's most recent input transaction
	 * and adding all subsequent output transactions for that wallet
	 */
	calculateBalance(blockchain) {
		let balance = this.balance;
		let transactions = [];
		blockchain.chain.forEach(block => block.data.forEach(transaction => {
      transactions.push(transaction);
    }));

		const walletInputTrans = transactions
      .filter(transaction => transaction.input.address === this.publicKey);

		let startTime = 0;

		if(walletInputTrans.length > 0) {
			// The most recent input transaction gives the wallet's total balance
			const recentInputTrans = walletInputTrans.reduce(
				(prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current);

			// The wallet's balance from the input transaction
			balance = recentInputTrans.outputs.find(output => output.address === this.publicKey).amount;
			startTime = recentInputTrans.input.timestamp;
		}

		// Add the output transactions that come after the most recent input transaction to the balance
		transactions.forEach(transaction => {
			if(transaction.input.timestamp > startTime) {
				transaction.outputs.find(output => {
					if (output.address === this.publicKey) {
						balance += output.amount;
					}
				});
			}
		});

		return balance;
	}

	static blockchainWallet() {
		const blockchainWallet = new this();
		blockchainWallet.address = 'blockchain-wallet';
		return blockchainWallet;
	}
}

module.exports = Wallet;
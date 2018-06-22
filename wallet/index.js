// Wallet class
const Util = require('../util')
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
	createTransaction(recipient, amount, pool) {
		if (amount > this.balance) {
			console.log(`Amount of ${amount} exceeds balance.`);
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
}

module.exports = Wallet;
// Transaction pool
// All transactions are added to this pool

const Transaction = require('../wallet/transaction');

class Pool {
	constructor() {
		this.pool = [];
	}

	addToPool(transaction) {
		// Checks if the pool already contains a transaction with the same id
		let transactionId = this.pool.find(trans => trans.id === transaction.id);

		// If transaction already exists, replace with the new one. Else, push to array.
		if (transactionId) {
			this.pool[this.pool.indexOf(transactionId)] = transaction;
		} else {
			this.pool.push(transaction);
		}
	}

	existingTransaction(address) {
		return this.pool.find(trans => trans.input.address === address);
	}

	// Returns a pool of valid transactions
	// Checks amounts and signature again
	validTransactions() {
		return this.pool.filter(transaction => {
			const outputTotal = transaction.outputs.reduce((total, output) => {
				return total + output.amount;
			}, 0);

			if(transaction.input.amount !== outputTotal) {
				console.log(`Invalid transaction from ${transaction.input.address}`);
				return;
			}

			if(!Transaction.verifyTransaction(transaction)) {
				console.log(`Invalid signature from ${transaction.input.address}`);
				return;
			}

			return transaction;
		});
	}

	clear() {
		this.pool = [];
	}
}

module.exports = Pool;
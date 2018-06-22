// Transaction pool
// All transactions are added to this pool

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

}

module.exports = Pool;
const Util = require('../util');
const { MINING_REWARD } = require('../config');

// Transactions contain an input and two (or more) outputs
// Input: Timestamp, starting balance of sender, sender's address, sender's signature
// Output1: balance of sender after sending, sender's address
// Output2: amount sent, recipient's address
// Subsequent outputs are more transactions by the same sender (of type Output2)
class Transaction {
	constructor() {
		this.id = Util.id();
		this.input = null;
		this.outputs = [];
	}

	// Adds new output to existing transaction by the sender
	update(senderWallet, recipient, amount) {
		const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

		if (amount > senderOutput.amount) {
			console.log(`Amount of ${amount} exceeds balance.`);
			return;
		}

		// Update Output1 of the sender
		senderOutput.amount = senderOutput.amount - amount;

		// Push Output2 to the array
		this.outputs.push({amount, address: recipient});
		Transaction.signTransaction(this, senderWallet);

		return this;
	}

	/**
	 * @senderWallet The wallet of the sender
	 * @recipient The recipient's address
	 * @amount Amount that is being sent
	 */
	static newTransaction(senderWallet, recipient, amount) {
		if (amount > senderWallet.balance) {
			console.log(`Amount of ${amount} exceeds balance.`);
			return;
		}

		// Push both outputs into array
		return Transaction.transactionWithOutputs(senderWallet, [
			{ amount: senderWallet.balance - amount, address: senderWallet.publicKey },
			{ amount, address: recipient }
			]);

	}

	// blockchain has to sign the reward transaction
	static rewardTransaction(minerWallet, blockchainWallet) {
		return Transaction.transactionWithOutputs(blockchainWallet, [{
			amount: MINING_REWARD, address: minerWallet.publicKey
		}])
	}


	// Helps create a transaction with outputs
	static transactionWithOutputs(senderWallet, outputs) {
		const transaction = new this();
		transaction.outputs.push(...outputs);
		Transaction.signTransaction(transaction, senderWallet);
		return transaction;
	}

	static signTransaction(transaction, senderWallet) {
		transaction.input = {
			timestamp: Date.now(),
			amount: senderWallet.balance,
			address: senderWallet.publicKey,
			signature: senderWallet.sign(Util.hash(transaction.outputs))
		}
	}

	// Verify using input and both outputs of the transaction
	static verifyTransaction(transaction) {
		return Util.verifySignature(transaction.input.address, transaction.input.signature, 
			Util.hash(transaction.outputs));
	}


}

module.exports = Transaction;
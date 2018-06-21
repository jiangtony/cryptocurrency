const Util = require('../util');

// Transactions contain an input and two outputs
// Input: Timestamp, starting balance of sender, sender's address, sender's signature
// Output1: balance of sender after sending, sender's address
// Output2: amount sent, recipient's address
class Transaction {
	constructor() {
		this.id = Util.id();
		this.input = null;
		this.outputs = [];
	}

	/**
	 *
	 * @recipient The recipient's address
	 * @amount Amount that is being sent
	 */
	static newTransaction(senderWallet, recipient, amount) {
		const transaction = new this();

		if(amount > senderWallet.balance) {
			console.log(`Amount of ${amount} exceeds balance.`);
			return;
		}

		// Push both outputs into array
		transaction.outputs.push(...[
			{ amount: senderWallet.balance - amount, address: senderWallet.publicKey },
			{ amount, address: recipient }
			]);
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
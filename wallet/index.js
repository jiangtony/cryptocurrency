// Wallet class
const Util = require('../util')
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
}

module.exports = Wallet;
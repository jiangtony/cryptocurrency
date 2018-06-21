// Utility class

const EC = require('elliptic').ec;
const uuid = require('uuid/v1');
const SHA256 = require('crypto-js/sha256');

// Elliptic curve used by Bitcoin
const ec = new EC('secp256k1');

class Util {
	static generatePair() {
		return ec.genKeyPair();
	}

	static id() {
		return uuid();
	}

	static hash(data) {
		return SHA256(JSON.stringify(data)).toString();
	}

	static verifySignature(publicKey, signature, hashedData) {
		return ec.keyFromPublic(publicKey, 'hex').verify(hashedData, signature);
	}
}

module.exports = Util;
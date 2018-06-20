const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');

// Block class

class Block{
	constructor(timestamp, prevHash, hash, data, nonce) {
		this.timestamp = timestamp;
		this.prevHash = prevHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
	}

	toString() {
		return `Block -
			Timestamp    : ${this.timestamp}
			Previous Hash: ${this.prevHash}
			Hash         : ${this.hash}
			Data         : ${this.data}
			Nonce        : ${this.nonce}`;
	}

	// Genesis block
	static genesis() {
		return new this('genesis', 'none', 'first', [], 0);
	}

	// Creates a new block
	static mineBlock(lastBlock, data) {
		const prevHash = lastBlock.hash;

		/**
		 * Proof of work
		 * Generate new hashes until a hash is found with a leading number of
		 * zero bits equal to the difficulty
		 */
		let hash, timestamp;
		let nonce = 0;
		do {
			nonce++;
			timestamp = Date.now();
			hash = Block.hash(timestamp, prevHash, data, nonce);
		} while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

		return new this(timestamp, prevHash, hash, data, nonce);
	}

	// Generate SHA-256 hash
	static hash(timestamp, prevHash, data, nonce) {
		return SHA256(`${timestamp}${prevHash}${data}${nonce}`).toString();
	}

	/**
	 * Generates the hash again, which should be identical to hash field
	 * if the block has not been tampered with
	 */
	static checkHash(block) {
		const {timestamp, prevHash, data, nonce} = block;
		return Block.hash(timestamp, prevHash, data, nonce);
	}
}

module.exports = Block;
const SHA256 = require('crypto-js/sha256');

// Block class

class Block{
	constructor(timestamp, prevHash, hash, data) {
		this.timestamp = timestamp;
		this.prevHash = prevHash;
		this.hash = hash;
		this.data = data;
	}

	toString() {
		return `Block -
			Timestamp: ${this.timestamp}
			Previous Hash: ${this.prevHash}
			Hash: ${this.hash}
			Data: ${this.data}`;
	}

	// Genesis block
	static genesis() {
		return new this('genesis', 'none', 'first', []);
	}

	// Creates a new block
	static mineBlock(lastBlock, data) {
		const timestamp = Date.now();
		const prevHash = lastBlock.hash;
		const hash = Block.hash(timestamp, prevHash, data);
		return new this(timestamp, prevHash, hash, data);
	}

	// Generate SHA-256 hash
	static hash(timestamp, prevHash, data) {
		return SHA256(`${timestamp}${prevHash}${data}`).toString();
	}

	/**
	 * Generates the hash again, which should be identical to hash field
	 * if the block has not been tampered with
	 */
	static checkHash(block) {
		const {timestamp, prevHash, data} = block;
		return Block.hash(timestamp, prevHash, data);
	}
}

module.exports = Block;
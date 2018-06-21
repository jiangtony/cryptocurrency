const Util = require('../util');
const { DIFFICULTY, MINE_RATE } = require('../config');

// Block class

class Block{
	constructor(timestamp, prevHash, hash, data, nonce, difficulty) {
		this.timestamp = timestamp;
		this.prevHash = prevHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
		this.difficulty = difficulty || DIFFICULTY;
	}

	toString() {
		return `Block -
			Timestamp    : ${this.timestamp}
			Previous Hash: ${this.prevHash}
			Hash         : ${this.hash}
			Data         : ${this.data}
			Nonce        : ${this.nonce}
			Diffculty    : ${this.difficulty}`;
	}

	// Genesis block
	static genesis() {
		return new this('genesis', 'none', 'first', [], 0, DIFFICULTY);
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

		// Difficulty of lastBlock
		let { difficulty } = lastBlock;
		do {
			nonce++;
			timestamp = Date.now();
			difficulty =  Block.adjustDifficulty(lastBlock, timestamp);
			hash = Block.hash(timestamp, prevHash, data, nonce, difficulty);
		} while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

		return new this(timestamp, prevHash, hash, data, nonce, difficulty);
	}

	// Generate SHA-256 hash
	static hash(timestamp, prevHash, data, nonce, difficulty) {
		return Util.hash(`${timestamp}${prevHash}${data}${nonce}${difficulty}`).toString();
	}

	/**
	 * Generates the hash again, which should be identical to hash field
	 * if the block has not been tampered with
	 */
	static checkHash(block) {
		const {timestamp, prevHash, data, nonce, difficulty} = block;
		return Block.hash(timestamp, prevHash, data, nonce, difficulty);
	}

	/**
	 * Compares the currentTime to the timestamp of the previous block
	 * If the difference is less than the MINE_RATE, increase difficulty
	 */
	static adjustDifficulty(lastBlock, currentTime) {
		let { difficulty } = lastBlock;
		difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty -1;
		return difficulty;
	}
}

module.exports = Block;
// Blockchain class

const Block = require('./block');

class Blockchain{
	// Initialize the class with the genesis block
	constructor() {
		this.chain = [Block.genesis()];
	}

	// Creates a new block, adds it to the end of the chain, and returns the new block
	addBlock(data) {
		const block = Block.mineBlock(this.chain[this.chain.length-1], data);
		this.chain.push(block);
		return block;
	}

	// Validates chain
	isValid(chain) {
		// Check if first block is genesis block
		if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
			return false;

		// Iterate over every block in the chain and validate hash values
		for(let i = 1; i < chain.length; i++) {
			const block = chain[i];
			const prevBlock = chain[i-1];

			// Condition 1: prevHash field has to match the hash of the previous block
			// Condition 2: Block's hash is recomputed and checked against current hash field
			if(block.prevHash !== prevBlock.hash || block.hash !== Block.checkHash(block)) {
				return false;
			}
		}

		return true;
	}
}

module.exports = Blockchain;
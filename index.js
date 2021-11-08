var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);


class Block {
    constructor(transaction, previousHash) {
        this.timestamp = Date.now();
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.generateHash();
    }
    
    generateHash(){
        return bcrypt.hashSync(this.timestamp + JSON.stringify(this.transaction) + this.previousHash, salt);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block("system", "0");
    }

    addBlock(from, to, amount) {
        if (amount <= 0) {
            return "Amount should be positive"
        } else if (this.checkBalance(from) >= amount || from == "system") {
            this.chain.push(new Block({ from, to, amount }, this.chain[this.chain.length - 1].hash))
            return "Transaction Successful"
        } else return "Insufficient Balance"
    }

    recharge(user, amount) {
        this.addBlock("system", user, amount);
    }

    checkBalance(user) {
        var balance = 0;
        for (var i = 1; i < this.chain.length; i++) {
            var transaction = this.chain[i].transaction;
            if (transaction.from == user) {
                balance -= transaction.amount;
            }
            if (transaction.to == user) {
                balance += transaction.amount;
            }
        }
        return balance;
    }

    checkChain(){
        for(var i=1;i<this.chain.length;i++){
            var block = this.chain[i];
            if(block.previousHash!=this.chain[i-1].hash || block.hash!=block.generateHash()){
                return false;
            }
        }
        return true;
    }
}

var bc = new BlockChain();
bc.recharge("hi", 12);
bc.addBlock("hi", "hello", 12);
console.log(bc.chain);
console.log(bc.checkBalance('hi'))
bc.chain[1].transaction.amount=100;
console.log(bc.checkChain())
const readline = require('readline');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

async function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}
module.exports = {
    createAndSendSignedTransaction: async function (prov, valueInEther, privateKey_notBuffered, addressFrom, addressTo) {
        // web3 initialization - must point to the HTTP JSON-RPC endpoint
        const provider = prov || 'http://localhost:8545';
        const web3 = new Web3(new Web3.providers.HttpProvider(provider));
        web3.transactionConfirmationBlocks = 1;

        const privateKey = new Buffer.from(privateKey_notBuffered, 'hex');
        const txnCount = await web3.eth.getTransactionCount(addressFrom, "pending")
        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: addressTo,
            value: web3.utils.numberToHex(web3.utils.toWei(valueInEther.toString(), 'ether'))
        };
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const rawTxHex = '0x' + serializedTx.toString('hex');
        return web3.eth.sendSignedTransaction(rawTxHex);
    },
    createAndSendSignedTransactionData: async function (prov, valueInEther, privateKey_notBuffered, addressFrom, addressTo, data) {
        // web3 initialization - must point to the HTTP JSON-RPC endpoint
        const provider = prov || 'http://localhost:8545';
        const web3 = new Web3(new Web3.providers.HttpProvider(provider));
        web3.transactionConfirmationBlocks = 1;

        const privateKey = new Buffer.from(privateKey_notBuffered, 'hex');
        const txnCount = await web3.eth.getTransactionCount(addressFrom, "pending")
        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: addressTo,
            value: web3.utils.numberToHex(web3.utils.toWei(valueInEther.toString(), 'ether')),
            data: data
        };
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const rawTxHex = '0x' + serializedTx.toString('hex');
        return web3.eth.sendSignedTransaction(rawTxHex);
    },
};

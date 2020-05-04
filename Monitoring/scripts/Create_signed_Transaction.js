const Web3 = require('web3')
var Tx = require('ethereumjs-tx');
var privateKey = new Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','hex')


const args = process.argv.slice(2);

// web3 initialization - must point to the HTTP JSON-RPC endpoint
var provider = args[0] || 'http://localhost:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))
web3.transactionConfirmationBlocks = 1;

const valueInEther = 0.00000000000000001
const addressFrom = '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73'
const addressTo = '0xf17f52151EbEF6C7334FAD080c5704D77216b732'
var provider = 'http://localhost:8545';


web3.eth.getTransactionCount(addressFrom, "pending").then((txnCount) => {
    var rawTx = {
        nonce: web3.utils.numberToHex(txnCount),
        gasPrice: web3.utils.numberToHex(1500),
        gasLimit: web3.utils.numberToHex(4700000),
        to: addressTo,
        value: web3.utils.numberToHex(10)//web3.utils.toWei(valueInEther.toString(), 'ether'))
    };
    var tx = new Tx(rawTx);
    tx.sign(privateKey);

    var serializedTx = tx.serialize();
    var rawTxHex = '0x' + serializedTx.toString('hex');

    console.log("You can for instance send this transaction manually with the following command:");
    console.log("curl -X POST --data '{\"jsonrpc\":\"2.0\",\"method\":\"eth_sendRawTransaction\",\"params\":[\"" + rawTxHex + "\"],\"id\":1}'", provider);
})

//console.log(serializedTx.toString('hex'));
//0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

//web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
//    if (!err)
//        console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
//});
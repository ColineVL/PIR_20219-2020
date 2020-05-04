const readline = require('readline');
const Web3 = require('web3')
var Tx = require('ethereumjs-tx');

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



const args = process.argv.slice(2);

// web3 initialization - must point to the HTTP JSON-RPC endpoint
var provider = args[0] || 'http://localhost:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))
web3.transactionConfirmationBlocks = 1;




(async() => {
    const valueInEther = await askQuestion("value in Ether to send? (press enter for default)") || 5;
    var privateKey = await askQuestion("Private Key of sender? (press enter for default)") || new Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','hex');
    const addressFrom = await askQuestion("Sender Adress? (press enter for default)") ||'0xfe3b557e8fb62b89f4916b721be55ceb828dbd73';
    const addressTo = await askQuestion("Receiver Adress? (press enter for default)") ||'0xf17f52151EbEF6C7334FAD080c5704D77216b732';

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
        const lol = await web3.eth.net.getPeerCount().then(console.log);

        (async() => {
            const ans = await askQuestion("******************************************\n\
    Do you want to send the signed value transaction now ? (Y/N):");
            if("y" == ans || "Y" == ans){
                // Send the signed transaction using web3
                await web3.eth.sendSignedTransaction(rawTxHex)
                       // .on('receipt', receipt => { const b = receipt.blockNumber })
                    .on('receipt', receipt => {console.log('Receipt: ', receipt), b = receipt.blockNumber }) //blockNumber => {console.log('b: ', blockNumber) })
                    .catch(error => { console.log('Error: ', error.message); });
                console.log("******************************************");
                console.log("Value transaction sent, waiting for receipt.");
                console.log("******************************************");
                const ans = await askQuestion("******************************************\n\
    Do you want to see the block of the transaction receipt? (Y/N):");
                if("y" == ans || "Y" == ans){
                   const block = await web3.eth.getBlock(b)
                    console.log("******************************************\n\ block :" , block );
                }
            }else{
                console.log("******************************************");
                console.log("You can for instance send this transaction manually with the following command:");
                console.log("curl -X POST --data '{\"jsonrpc\":\"2.0\",\"method\":\"eth_sendRawTransaction\",\"params\":[\"" + rawTxHex + "\"],\"id\":1}'", provider);
            }
        })();
    })
})();
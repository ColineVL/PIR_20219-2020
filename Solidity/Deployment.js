
const Web3 = require('web3');
var Tx = require('ethereumjs-tx');
let fs = require("fs");


// Web3 Initialisation
var provider = 'http://localhost:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))


/////////////////////////////////////////////////////////////////////////////////////////
var account1= "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
var key1 =new Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','hex');
/////////////////////////////////////////////////////////////////////////////////////////:

// Read the compiled contract code
// Compile with
// solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
let source = fs.readFileSync("/Users/Happpyyyyyyy//PIR/Solidity/contracts.json");
let contracts = JSON.parse(source)["contracts"];

// ABI description as JSON structure
let abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"dataId","type":"uint32"},{"indexed":false,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"contractEndTime","type":"uint64"}],"name":"NewDataReference","type":"event"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint64","name":"_contractEndTime","type":"uint64"}],"name":"createDataReference","outputs":[],"stateMutability":"nonpayable","type":"function"}];//fs.readFileSync("/home/rsx14/IdeaProjects/PIR/Solidity/Depreciation_Contract_sol_Depreciation_Contract.abi");//JSON.parse(contracts.Depreciation_Contract.abi);

// Smart contract EVM bytecode as hex
let code = '0x' +fs.readFileSync("/Users/Happpyyyyyyy/PIR/Solidity/Depreciation_Contract_sol_Depreciation_Contract.bin"); //contracts.SampleContract.bin;
//
// // Create Contract proxy class
// let SampleContract = new web3.eth.Contract(abi);
// const gasPrice = 1000;//web3.eth.gasPrice;
// const gasPriceHex = web3.utils.numberToHex(gasPrice);
// const gasLimitHex = web3.utils.numberToHex(3000000);
//
//
// (async () => {
// const nonceval = await web3.eth.getTransactionCount(account1, "pending"); //'0x' + new Date().getTime();
//
// console.log(nonceval);
//
// var fTx = {
//     nonce: nonceval,
//     gasPrice: gasPriceHex,
//     gasLimit: gasLimitHex,
//     data: code,
//     from: account1
// };
//
// var txx = new Tx(fTx);
// txx.sign(key1);
//
// var sTx =txx.serialize();
//
//
// const receipt = await web3.eth.sendSignedTransaction('0x' + sTx.toString('hex')).on('receipt', function(receipt){
//     // receipt example
//     console.log(receipt);
//     // Log the tx, you can explore status manually with eth.getTransaction()
//     // console.log('contract creation tx: ' + hash);
// });
// })();
////////////////////////////////////////////////////////////////

//
// // Unlock the coinbase account to make transactions out of it
//
// // console.log("Unlocking coinbase account");
// // var password = "";
// // try {
// //     web3.personal.unlockAccount(web3.eth.coinbase, password);
// // } catch(e) {
// //     console.log(e);
// //     return;
// // }
//
//
// console.log("Deploying the contract");
// let contract = SampleContract.deploy({
//     data: code,
// });//new({from: web3.eth.coinbase, gas: 1000000, data: code});
//
// // Transaction has entered to geth memory pool
// // console.log("Your contract is being deployed in transaction at http://testnet.etherscan.io/tx/" + contract.transactionHash);
// contract.send({from: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73'})
// // // http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
// // function sleep(ms) {
// //     return new Promise(resolve => setTimeout(resolve, ms));
// // }
// //
// // // We need to wait until any miner has included the transaction
// // // in a block to get the address of the contract
// // async function waitBlock() {
// //     while (true) {
// //         let receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
// //         if (receipt && receipt.contractAddress) {
// //             console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
// //             console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
// //             break;
// //         }
// //         console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
// //         await sleep(4000);
// //     }
// // }
(async () => {
    const gasPrice = 1000;//web3.eth.gasPrice;
    const gasPriceHex = web3.utils.numberToHex(gasPrice);
    const gasLimitHex = web3.utils.numberToHex(3000000);

    const contract = new web3.eth.Contract(abi,'0xfE0B7EE21e8298fC68b9Bf5f404e7df7B6671EC2');
    // const contractInstance = contract.at('0xfE0B7EE21e8298fC68b9Bf5f404e7df7B6671EC2');
    const transactionObject = {
        from: account1,
        gas: web3.utils.numberToHex(3000000),
        gasPrice: gasPrice
    };
    const result = await contract.methods.createDataReference(5, 10).call(transactionObject);

    console.log(result);
})();
// contract.events.NewDataReference()
//     .on("data", function(event) {
//         let values = event.returnValues;
//         // We can access this event's 3 return values on the `event.returnValues` object:
//         console.log("New data ref", values.dataId, values.provider, values.price, values.contractEndTime);
//     }).on("error", console.error);
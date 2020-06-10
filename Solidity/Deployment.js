const Web3 = require('web3');
var Tx = require('ethereumjs-tx');
let fs = require("fs");

// Web3 Initialisation
var provider = 'http://localhost:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))


//////////////////////////////////////Account info for deployment///////////////////////////////////////////////////
var account1= "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
var key1 =new Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','hex');
/////////////////////////////////////////////////////////////////////////////////////////:

// Read the compiled contract code
// Compile with
// solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
// let source = fs.readFileSync("/home/rsx14/IdeaProjects/PIR/Solidity/contracts.json");
// let contracts = JSON.parse(source)["contracts"];

// ABI description as JSON structure
let abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"dataId","type":"uint32"},{"indexed":false,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"contractEndTime","type":"uint64"}],"name":"NewDataReference","type":"event"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint64","name":"_contractEndTime","type":"uint64"}],"name":"createDataReference","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getDataReference","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"i","type":"uint32"}],"name":"setId","outputs":[],"stateMutability":"nonpayable","type":"function"}]




// Smart contract EVM bytecode as hex
let code = '0x' +fs.readFileSync("/Users/Happpyyyyyyy/deeplearning4j-examples-master/PIR/Solidity//Depreciation_Contract_sol_Depreciation_Contract.bin"); //contracts.SampleContract.bin;
//
// Create Contract proxy class
let SampleContract = new web3.eth.Contract(abi);
const gasPrice = 1000;//web3.eth.gasPrice;
const gasPriceHex = web3.utils.numberToHex(gasPrice);
const gasLimitHex = web3.utils.numberToHex(3000000);


(async () => {
    const nonceval = await web3.eth.getTransactionCount(account1, "pending"); //'0x' + new Date().getTime();

    console.log(nonceval);

    var fTx = {
        nonce: nonceval,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data: code,
        from: account1
    };

    var txx = new Tx(fTx);
    txx.sign(key1);

    var sTx =txx.serialize();


    const receipt = await web3.eth.sendSignedTransaction('0x' + sTx.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    });
})();


const Web3 = require('web3');
var Tx = require('ethereumjs-tx');
let fs = require("fs");


// Web3 Initialisation
var provider = 'http://localhost:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))


//////////////////////////////////Account Info///////////////////////////////////////////////////////
var account1= "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
var key1 =new Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','hex');
/////////////////////////////////////////////////////////////////////////////////////////:

// ABI description as JSON structure
let abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"dataId","type":"uint32"},{"indexed":false,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"contractEndTime","type":"uint64"}],"name":"NewDataReference","type":"event"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint64","name":"_contractEndTime","type":"uint64"}],"name":"createDataReference","outputs":[],"stateMutability":"nonpayable","type":"function"}];//fs.readFileSync("/home/rsx14/IdeaProjects/PIR/Solidity/Depreciation_Contract_sol_Depreciation_Contract.abi");//JSON.parse(contracts.Depreciation_Contract.abi);

// Smart contract EVM bytecode as hex
let code = '0x' +fs.readFileSync("/home/rsx14/IdeaProjects/PIR/Solidity/Depreciation_Contract_sol_Depreciation_Contract.bin"); //contracts.SampleContract.bin;


(async () => {
    const gasPrice = 1000;//web3.eth.gasPrice;
    const gasPriceHex = web3.utils.numberToHex(gasPrice);
    const gasLimitHex = web3.utils.numberToHex(3000000);

    const contract = new web3.eth.Contract(abi,'0xa50a51c09a5c451C52BB714527E1974b686D8e77');
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
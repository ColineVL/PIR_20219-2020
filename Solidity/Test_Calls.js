
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
let abi =[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"dataId","type":"uint32"},{"indexed":false,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"contractEndTime","type":"uint64"}],"name":"NewDataReference","type":"event"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint64","name":"_contractEndTime","type":"uint64"}],"name":"createDataReference","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getDataReference","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"i","type":"uint32"}],"name":"setId","outputs":[],"stateMutability":"nonpayable","type":"function"}]

//
// var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
//     if (!error) {
//         console.log(result);
//
//         return;
//     }
//
//     console.error(error);
// })
//     .on("connected", function(subscriptionId){
//         console.log(subscriptionId);
//     })
//     .on("data", function(blockHeader){
//         console.log(blockHeader);
//     })
//     .on("error", console.error);


const gasPrice = 1000;//web3.eth.gasPrice;
const gasPriceHex = web3.utils.numberToHex(gasPrice);
const gasLimitHex = web3.utils.numberToHex(4000000);

const contract = new web3.eth.Contract(abi,'0x42699A7612A82f1d9C36148af9C77354759b210b');
const transactionObject = {
    from: account1,
    gas: web3.utils.numberToHex(3000000),
    gasPrice: gasPrice
};

const receiveDataRef = contract.methods.getDataReference().encodeABI();
const setIdRef = contract.methods.setId(5).encodeABI();

// const id1 = contract.methods.getDataReference().send(transactionObject);
// // const results = contract.methods.createDataReference(5,10).send(transactionObject);
// const result = contract.methods.setId(5).send(transactionObject);
// const id2 = contract.methods.getDataReference().send(transactionObject);
//
// console.log("id before: " + id1);
// console.log("id after: " + id2);


(async () => {
    const nonceval = await web3.eth.getTransactionCount(account1, "pending"); //'0x' + new Date().getTime();
    var fTx1 = {
        nonce: nonceval,
        to : "0x42699A7612A82f1d9C36148af9C77354759b210b",
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:receiveDataRef ,
        from: account1
    };
    var fTx2 = {
        nonce: nonceval,
        to : "0x42699A7612A82f1d9C36148af9C77354759b210b",
        value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:setIdRef
    };
    var fTx3 = {
        nonce: nonceval,
        to : "0x42699A7612A82f1d9C36148af9C77354759b210b",
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:receiveDataRef ,
        from: account1
    };

    var txx1 = new Tx(fTx1);
    var txx2 = new Tx(fTx2);
    var txx3 = new Tx(fTx3);
    txx1.sign(key1);
    txx2.sign(key1);
    txx3.sign(key1);

    var sTx1 =txx1.serialize();
    var sTx2 =txx2.serialize();
    var sTx3 =txx3.serialize();


    // const receipt1 = await web3.eth.sendSignedTransaction('0x' + sTx1.toString('hex'))
    // console.log(receipt1);
    // const receipt2 = await web3.eth.sendTransaction('0x' + sTx2.toString('hex'))
    const receipt2 = await web3.eth.sendSignedTransaction('0x' + sTx2.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    }).on('error', function(error){
        console.log(error);
    });
    // const receipt3 = await web3.eth.sendSignedTransaction('0x' + sTx3.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // });
    // console.log("*************************************");
    const id1 = await contract.methods.getDataReference().call(transactionObject);
    console.log(id1);
})();



// contract.events.NewDataReference()
//     .on("data", function(event) {
//         let values = event.returnValues;
//         // We can access this event's 3 return values on the `event.returnValues` object:
//         console.log("New data ref", values.dataId, values.provider, values.price, values.contractEndTime);
//     }).on("error", console.error);


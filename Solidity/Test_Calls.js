
const Web3 = require('web3');
var Tx = require('ethereumjs-tx');
let fs = require("fs");


// Web3 Initialisation
var provider = 'http://192.168.33.115:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))
var web3ws = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.33.115:8546'))
//


//////////////////////////////////Account Info///////////////////////////////////////////////////////
var account1= "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
var key1 =new Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','hex');

var contract_address = "0x3484B20600854091C166C062FacAd700123f5f71" ; // '0x3Ace09BBA3b8507681146252d3Dd33cD4E2d4F63'
/////////////////////////////////////////////////////////////////////////////////////////:

// ABI description as JSON structure
let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"testStringIndexed","type":"string"},{"indexed":false,"internalType":"string","name":"testString","type":"string"}],"name":"Event","type":"event"},{"inputs":[{"internalType":"string","name":"_testString","type":"string"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"testString","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]

const gasPrice = 1000;//web3.eth.gasPrice;
const gasPriceHex = web3.utils.numberToHex(gasPrice);
const gasLimitHex = web3.utils.numberToHex(4000000);

const contract = new web3.eth.Contract(abi,contract_address);

const transactionObject = {
    from: account1,
    gas: web3.utils.numberToHex(3000000),
    gasPrice: gasPrice
};

// const setuint1ref = contract.methods.buy_reference(4,270).encodeABI();
const setuint1ref = contract.methods.set("Description bogus x2").encodeABI();
// const getDataRef = contract.methods.getDataReferences(0)5encodeABI();


//
//
(async () => {
    const nonceval = await web3.eth.getTransactionCount(account1, "pending"); //'0x' + new Date().getTime();
    console.log(nonceval)
    var fTx1 = {
        nonce: nonceval,
        to : contract_address,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:setuint1ref ,
        from: account1,
       // value: 100000//web3.utils.toWei('1', 'ether'),
    };


    var txx1 = new Tx(fTx1);
    // var txx2 = new Tx(fTx2);
    // var txx3 = new Tx(fTx3);
    txx1.sign(key1);
    // txx2.sign(key1);
    // txx3.sign(key1);

    var sTx1 =txx1.serialize();
    // var sTx2 =txx2.serialize();
    // var sTx3 =txx3.serialize();


    // const dataOld = await web3.eth.sendSignedTransaction('0x' + sTx1.toString('hex'));
    // const dataOld1 = await web3.eth.sendSignedTransaction('0x' + sTx1.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // }).on('error', function(error){
    //     console.log(error);
    // });
    // console.log("..........." + Object.keys(dataOld1))
    // const dataOld2 = await web3.eth.sendSignedTransaction('0x' + sTx2.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // }).on('error', function(error){
    //     console.log(error);
    // });
    // const dataOld3 = await web3.eth.sendSignedTransaction('0x' + sTx3.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // }).on('error', function(error){
    //     console.log(error);
    // });




    // const dataNew = await web3.eth.sendSignedTransaction('0x' + sTx3.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // });
    // console.log("*************************************");
    // const map = await contract.methods.dataReferences(0).call(transactionObject);
    // // const data2 = await contract.methods.data2().call(transactionObject);
    // // const data = await contract.methods.getData().call(transactionObject);
    // console.log("data refs :" + map.clients);
    // console.log(map)
    // // console.log("data2 :" + data2);
    // console.log("map of 10 :" + map);



    // console.log("data before :" + dataOld);
    // console.log("data before :" +dataNew);



    const contractws = new web3ws.eth.Contract(abi,contract_address);
    const events = await contractws.events.Event({
        filter:{testString:"Descriptiuvknv;on bogus x2"},
        fromBlock: 0
    })
        .on('data', function(event){
            console.log(event.returnValues); // same results as the optional callback above
        })

    // console.log(events.callback())
    // console.log("**********************************");
    // contractws.getPastEvents("NewClient", {
    //     fromBlock: 0,
    //     toBlock: 'latest'
    // }, function(error, events){ console.log(events); })
    //     .then(function(events){
    //         console.log(events) // same results as the optional callback above
    //     });
})();





// console.log('**********************************Events*************************************************')
// //
// const contractws = new web3ws.eth.Contract(abi,'0xa50a51c09a5c451C52BB714527E1974b686D8e77');
// events = contractws.events.NewClient({
//     fromBlock: 0
// }, function(error, event){ console.log("**********" + event); })
//     .on('data', function(event){
//         // console.log(event); // same results as the optional callback above
//     })
//     .on('changed', function(event){
//         // remove event from local database
//     })
//     .on('error', console.error);
//
// console.log(typeof events[0])
// //     // toBlock: 'latest'





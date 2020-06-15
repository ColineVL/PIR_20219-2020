
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
/////////////////////////////////////////////////////////////////////////////////////////:

// ABI description as JSON structure
let abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"data","type":"uint32"},{"indexed":false,"internalType":"address","name":"provider","type":"address"}],"name":"NewData","type":"event"},{"inputs":[{"internalType":"uint256","name":"key","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"Setmaptest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bool1","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bool2","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"data2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getData","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"maptest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"key","type":"uint256"},{"internalType":"bool","name":"_bool1","type":"bool"}],"name":"setBool1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"key","type":"uint256"},{"internalType":"bool","name":"_bool2","type":"bool"}],"name":"setBool2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"key","type":"uint256"},{"internalType":"bool","name":"_boolMap1","type":"bool"}],"name":"setBoolMap1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"key","type":"uint256"},{"internalType":"bool","name":"_boolMap2","type":"bool"}],"name":"setBoolMap2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"i","type":"uint32"}],"name":"setData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"key","type":"uint256"},{"internalType":"uint256","name":"_uint","type":"uint256"}],"name":"setUint1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"key","type":"uint256"},{"internalType":"uint256","name":"_uintMap","type":"uint256"}],"name":"setUintMap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uint1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

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

const setuint1ref = contract.methods.setUint1(1,1).encodeABI();
const setbool1ref = contract.methods.setBool1(1,true).encodeABI();
const setbool2ref = contract.methods.setBool2(1,true).encodeABI();


const setuintref = contract.methods.setUintMap(2,1).encodeABI();
const setboolmap1ref = contract.methods.setBoolMap1(2,true).encodeABI();
const setboolmap2ref = contract.methods.setBoolMap2(2,true).encodeABI();
// const setIdRef = contract.methods.setData(5).encodeABI();
//
// const setMappingRef = contract.methods.Setmaptest(50,5).encodeABI();
// const getMappingRef = contract.methods.maptest().encodeABI();


(async () => {
    const nonceval = await web3.eth.getTransactionCount(account1, "pending"); //'0x' + new Date().getTime();
    console.log(nonceval)
    // var fTx1 = {
    //     nonce: nonceval,
    //     to : '0x6aA8b700cD034Ab4B897B59447f268b33B8cF699',
    //     gasPrice: gasPriceHex,
    //     gasLimit: gasLimitHex,
    //     data:setuint1ref ,
    //     from: account1
    // };
    // var fTx2 = {
    //     nonce: nonceval+1,
    //     to : '0x6aA8b700cD034Ab4B897B59447f268b33B8cF699',
    //     value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
    //     gasPrice: gasPriceHex,
    //     gasLimit: gasLimitHex,
    //     data:setbool1ref,
    //     value: 0
    // };
    // var fTx3 = {
    //     nonce: nonceval,
    //     to : '0x6aA8b700cD034Ab4B897B59447f268b33B8cF699',
    //     gasPrice: gasPriceHex,
    //     gasLimit: gasLimitHex,
    //     data:setbool2ref ,
    //     from: account1
    // };
    var fTx4 = {
        nonce: nonceval,
        to : '0x42699A7612A82f1d9C36148af9C77354759b210b',

        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:setuintref ,
        from: account1
    };
    var fTx5 = {
        nonce: nonceval+1,
        to : '0x42699A7612A82f1d9C36148af9C77354759b210b',
        value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),

        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:setboolmap1ref,
        value: 0
    };
    var fTx6 = {
        nonce: nonceval+2,
        to : '0x42699A7612A82f1d9C36148af9C77354759b210b',

        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:setboolmap2ref ,
        from: account1
    };

    // var txx1 = new Tx(fTx1);
    // var txx2 = new Tx(fTx2);
    // var txx3 = new Tx(fTx3);
    // txx1.sign(key1);
    // txx2.sign(key1);
    // txx3.sign(key1);
    var txx4 = new Tx(fTx4);
    var txx5 = new Tx(fTx5);
    var txx6 = new Tx(fTx6);
    txx4.sign(key1);
    txx5.sign(key1);
    txx6.sign(key1);

    // var sTx1 =txx1.serialize();
    // var sTx2 =txx2.serialize();
    // var sTx3 =txx3.serialize();
    var sTx4 =txx4.serialize();
    var sTx5 =txx5.serialize();
    var sTx6 =txx6.serialize();

    // const dataOld = await web3.eth.sendSignedTransaction('0x' + sTx1.toString('hex'));
    // const dataOld1 = await web3.eth.sendSignedTransaction('0x' + sTx1.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // }).on('error', function(error){
    //     console.log(error);
    // });
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
    const dataOld4 = await web3.eth.sendSignedTransaction('0x' + sTx4.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    }).on('error', function(error){
        console.log(error);
    });
    const dataOld5 = await web3.eth.sendSignedTransaction('0x' + sTx5.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    }).on('error', function(error){
        console.log(error);
    });
    const dataOld6 = await web3.eth.sendSignedTransaction('0x' + sTx6.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    }).on('error', function(error){
        console.log(error);
    });




    // const dataNew = await web3.eth.sendSignedTransaction('0x' + sTx3.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // });
    // console.log("*************************************");
    const map = await contract.methods.maptest(50).call(transactionObject);
    const data2 = await contract.methods.data2().call(transactionObject);
    // console.log("data2 :" + data2);
    // console.log("map of 50 :" + map);

    // console.log("data before :" + dataOld);
    // console.log("data before :" +dataNew);
})();




console.log('**********************************Events*************************************************')
//
// const contractws = new web3ws.eth.Contract(abi,'0x6023FF0A8203ea32E737819B301D1672Dd2ECBE0');
// contractws.events.NewData({
//     fromBlock: 3200
// }, function(error, event){ console.log("**********" + event); })
//     .on('data', function(event){
//         console.log(event); // same results as the optional callback above
//     })
//     .on('changed', function(event){
//         // remove event from local database
//     })
//     .on('error', console.error);
//
// //     // toBlock: 'latest'





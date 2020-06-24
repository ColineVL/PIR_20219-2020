const Web3 = require('web3');
const provider = 'http://192.168.33.115:8545';
const web33 = new Web3(new Web3.providers.HttpProvider(provider))


var Tx = require('ethereumjs-tx');
let fs = require("fs");

const TLE = require('./TLE');

array = TLE.convertStrToBin();

let arr1 = array.slice(0,25)
let arr2 = array.slice(25);

// alert(typeof array);
const fer1 = new Buffer.from(arr1,'hex');
const fer2 = new Buffer.from(arr2,'hex');

let TLE25 = web33.utils.bytesToHex(fer1);
let TLE24 = web33.utils.bytesToHex(fer2);

// Web3 Initialisation
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
let web3 = new Web3(new Web3.providers.HttpProvider(provider))
let web3ws = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.33.115:8546'))
//


//////////////////////////////////Account Info///////////////////////////////////////////////////////
let account1= "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
let key1 =new Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','hex');


let contract_address = '0xC9Bc439c8723c5c6fdbBE14E5fF3a1224f8A0f7C' ;
/////////////////////////////////////////////////////////////////////////////////////////:

// ABI description as JSON structure
let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encodedKeyHash","type":"bytes32"}],"name":"encodedKeyHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedEncodedKey","type":"bytes32"}],"name":"encryptedEncodedKeyEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"keyDecoder","type":"bytes32"}],"name":"keyDecoder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"fund","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"newClient","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"initialPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"insuranceDeposit","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"minimumData","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"deployTime","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"endTime","type":"uint64"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"},{"indexed":false,"internalType":"uint8","name":"depreciationType","type":"uint8"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"newDataReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"string","name":"spaceObject","type":"string"}],"name":"newTLE","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"referenceKey","type":"bytes32"}],"name":"referenceKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"withdrawRefund","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"TLEs","outputs":[{"internalType":"string","name":"spaceObject","type":"string"},{"internalType":"bytes25","name":"TLE1","type":"bytes25"},{"internalType":"bytes25","name":"TLE2","type":"bytes25"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"}],"name":"buyReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_initialPrice","type":"uint256"},{"internalType":"uint64","name":"_minimumData","type":"uint64"},{"internalType":"uint64","name":"_referenceDuration","type":"uint64"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"},{"internalType":"uint8","name":"_depreciationType","type":"uint8"},{"internalType":"string","name":"_description","type":"string"}],"name":"createDataReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClientDisputes","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceKey","type":"uint256"}],"name":"getKeyDecoder","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getNumberOfData","outputs":[{"internalType":"uint128","name":"numberOfData","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getReferenceCurrentPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getTLEs","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"components":[{"internalType":"string","name":"spaceObject","type":"string"},{"internalType":"bytes25","name":"TLE1","type":"bytes25"},{"internalType":"bytes25","name":"TLE2","type":"bytes25"}],"internalType":"struct TLE_Contract.structTLE[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"raiseDispute","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_encodedKeyHash","type":"bytes32"}],"name":"setEncodedHashedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"bytes32","name":"_encryptedEncodedKey","type":"bytes32"}],"name":"setEncryptedEncodedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"bytes32","name":"_keyDecoder","type":"bytes32"}],"name":"setKeyDecoder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_referenceKey","type":"bytes32"}],"name":"setReferenceKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"string","name":"_spaceObject","type":"string"},{"internalType":"bytes25","name":"_TLE1","type":"bytes25"},{"internalType":"bytes24","name":"_TLE2","type":"bytes24"}],"name":"setTLE","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const gasPrice = 1000;//web3.eth.gasPrice;
const gasPriceHex = web3.utils.numberToHex(gasPrice);
const gasLimitHex = web3.utils.numberToHex(4000000);

const contract = new web3.eth.Contract(abi,contract_address);

const transactionObject = {
    from: account1,
    gas: web3.utils.numberToHex(3000000),
    gasPrice: gasPrice,
    msgValue: 0
};

// const setuint1ref = contract.methods.buy_reference(4,270).encodeABI();
let byt = web3.utils.bytesToHex(["101101101110100011"]) // "0x3f420cfe1d63e9d7a8e3b9743eb84971bfd7a6242be8aefd8afd4a87" //web3.utils.bytesToHex(["101101011011011"])

const Constant = contract.methods.createDataReference(1000000000000,4,3600000,byt,0,"Constant").encodeABI();
// const getDataRef = contract.methods.getDataReferences(0)5encodeABI();

let bbb = 0x31e42ae210c0001044210c588e0200022180000845aad40491cc79066c881ee909800d17904a7828a0900f899179edc217;

const TLE1 = contract.methods.setTLE(0, "", TLE25, TLE24).encodeABI();
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
        data:Constant ,
        from: account1,
        value: 100000//web3.utils.toWei('1', 'ether'),
    };

    var fTx2 = {
        nonce: nonceval + 1,
        to : contract_address,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:TLE1 ,
        from: account1,
        // value: 100000//web3.utils.toWei('1', 'ether'),
    };


    var txx1 = new Tx(fTx1);
    var txx2 = new Tx(fTx2);

    txx1.sign(key1);
    txx2.sign(key1);

    var sTx1 =txx1.serialize();
    var sTx2 =txx2.serialize();

    //
    const dataOld1 = await web3.eth.sendSignedTransaction('0x' + sTx1.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    }).catch(function(error){
        console.log(error);
    });

    const dataOld2 = await web3.eth.sendSignedTransaction('0x' + sTx2.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    }).catch(function(error){
        console.log(error);
    });


    //
    // let blockNumber = dataOld1.blockNumber ;
    // console.log(blockNumber)






    // const dataNew = await web3.eth.sendSignedTransaction('0x' + sTx3.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // });
    // console.log("*************************************");
           const map1 = await contract.methods.getReferenceCurrentPrice(0).call({from : account1});
           // const clients = await contract.methods.dataRefer.call(transactionObject);
           console.log("Constant current price:" + map1)

            const map2 = await contract.methods.getTLEs(0).call({from : account1});
            // const clients = await contract.methods.dataRefer.call(transactionObject);
            console.log(map2)

    // // const data = await contract.methods.getData().call(transactionObject);
    // console.log("data refs :" + map.clients);
    // console.log(map)
    // // console.log("data2 :" + data2);
    // console.log("map of 10 :" + map);



    // console.log("data before :" + dataOld);
    // console.log("data before :" +dataNew);


    //
    const contractws = new web3ws.eth.Contract(abi,contract_address);

    // console.log(events.callback())
    console.log("**********************************");
    let res1 =  contractws.getPastEvents("newTLE", {
        fromBlock: 0,
        toBlock: 'latest'
    }, function(error, events){ console.log(events)})
        .then(function(events){
             console.log(events)// same results as the optional callback above
        });

    // console.log(events.callback())
//     console.log("**********************************");
//     contractws.getPastEvents("NewDataReference", {
//         filter: {address: account1},
//         fromBlock: blockNumber-1,
//         toBlock: 'latest'
//     }, function(error, events){ console.log(events); })
//         .then(function(events){
//             console.log(events) // same results as the optional callback above
//         });
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





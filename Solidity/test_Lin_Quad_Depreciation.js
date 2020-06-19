
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


var contract_address = '0x594e68f223a390500467346151C9C7E6f9C1faeA' ; // '0x3Ace09BBA3b8507681146252d3Dd33cD4E2d4F63'
/////////////////////////////////////////////////////////////////////////////////////////:

// ABI description as JSON structure
let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"fund","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"}],"name":"NewClient","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"endTime","type":"uint128"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"},{"indexed":false,"internalType":"uint8","name":"depreciationType","type":"uint8"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"NewDataReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedEncodedKey","type":"bytes32"}],"name":"encryptedEncodedKeyEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedKeyHash","type":"bytes32"}],"name":"encryptedKeyHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"keyDecoder","type":"uint256"}],"name":"keyDecoder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"time","type":"uint256"}],"name":"raiseDisputeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referenceKey","type":"uint256"}],"name":"referenceKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":true,"internalType":"address","name":"loser","type":"address"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"settleDisputeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"withdrawRefund","type":"event"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"}],"name":"buyReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint128","name":"_referenceDuration","type":"uint128"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"},{"internalType":"uint8","name":"_depreciationType","type":"uint8"},{"internalType":"string","name":"_description","type":"string"}],"name":"createDataReference","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dataReferences","outputs":[{"internalType":"uint256","name":"initialPrice","type":"uint256"},{"internalType":"uint256","name":"referenceKey","type":"uint256"},{"internalType":"uint128","name":"deployTime","type":"uint128"},{"internalType":"uint128","name":"endTime","type":"uint128"},{"internalType":"uint8","name":"depreciationType","type":"uint8"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"uint256","name":"withdrawableFunds","type":"uint256"},{"internalType":"uint256","name":"clientDisputes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClientDisputes","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"bool[]","name":"","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getReferenceCurrentPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"raiseDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setDisputePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"bytes32","name":"_encryptedEncodedKey","type":"bytes32"}],"name":"setEncryptedEncodedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_encryptedKeyHash","type":"bytes32"}],"name":"setEncryptedHashedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"uint256","name":"_keyDecoder","type":"uint256"}],"name":"setKeyDecoder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"uint256","name":"_referenceKey","type":"uint256"}],"name":"setReferenceKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address payable","name":"_client","type":"address"}],"name":"settleDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawDisputeFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}];

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
let byt = web3.utils.bytesToHex(["101101101110100011"]) // "0x3f420cfe1d63e9d7a8e3b9743eb84971bfd7a6242be8aefd8afd4a87" //web3.utils.bytesToHex(["101101011011011"])

const Constant = contract.methods.createDataReference(1000000000000,1800,byt,1,"Linear").encodeABI();
// const getDataRef = contract.methods.getDataReferences(0)5encodeABI();


const Linear = contract.methods.createDataReference(1000000000000,1800,byt,2,"QuadBig").encodeABI();
// const getDataRef = contract.methods.getDataReferences(0)5encodeABI();


const Quad = contract.methods.createDataReference(1000000000,1800,byt,2,"QuadSmall").encodeABI();
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
        // value: 100000//web3.utils.toWei('1', 'ether'),
    };

    var fTx2 = {
        nonce: nonceval +1,
        to : contract_address,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:Linear ,
        from: account1,
        // value: 100000//web3.utils.toWei('1', 'ether'),
    };


    var fTx3 = {
        nonce: nonceval + 2,
        to : contract_address,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:Quad ,
        from: account1,
        // value: 100000//web3.utils.toWei('1', 'ether'),
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

    //
    const dataOld1 = await web3.eth.sendSignedTransaction('0x' + sTx1.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    }).catch(function(error){
        console.log("hello");
    });

    const dataOld2 = await web3.eth.sendSignedTransaction('0x' + sTx2.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    }).catch(function(error){
        console.log("hello");
    });

    const dataOld3 = await web3.eth.sendSignedTransaction('0x' + sTx3.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    }).catch(function(error){
        console.log("hello");
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
           console.log("Linear current price:" + map1)
           console.log(typeof map1)

            const map2 = await contract.methods.getReferenceCurrentPrice(1).call({from : account1});
            // const clients = await contract.methods.dataRefer.call(transactionObject);
            console.log("Quad big current price:" + map2)
            console.log(typeof map2)

            const map3 = await contract.methods.getReferenceCurrentPrice(2).call({from : account1});
            // const clients = await contract.methods.dataRefer.call(transactionObject);
            console.log("Quad small current price:" + map3)
            console.log(typeof map3)
    // // const data = await contract.methods.getData().call(transactionObject);
    // console.log("data refs :" + map.clients);
    // console.log(map)
    // // console.log("data2 :" + data2);
    // console.log("map of 10 :" + map);



    // console.log("data before :" + dataOld);
    // console.log("data before :" +dataNew);


    //
    const contractws = new web3ws.eth.Contract(abi,contract_address);
    // const events = await contractws.events.Eventee({
    //    // filter:{testString:"Descriptiuvknv;on bogus x2"},
    //     fromBlock: 0
    // })
    //     .on('data', function(event){
    //         console.log(web3.utils.toAscii(event.returnValues.byt)); // same results as the optional callback above
    //     })

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





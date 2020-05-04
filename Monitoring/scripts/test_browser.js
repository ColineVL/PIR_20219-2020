// const readline = requirejs('readline');
const Web3 = require('web3');
// const Admin =require('web3-eth-admin');


// requirejs(['readline'], function (readline) {});
// requirejs(['web3'], function (Web3) {});
// requirejs(['web3-eth-admin'], function (Admin) {});

// import {Admin} from 'web3-eth-admin';
//
// var web3 = new web3("ws://localhost:8545");
//
let myButton = document.querySelector('button');
let myInfo = document.querySelector('p');
let myHeading = document.querySelector('h1');




// web3 initialization - must point to the HTTP JSON-RPC endpoint
var provider = 'http://localhost:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider, {headers: [{name: 'Access-Control-Allow-Origin', value: 'http://localhost:8545'}]}));
//new Web3(new Web3.providers.HttpProvider(provider))
web3.transactionConfirmationBlocks = 1;


// (async() => {
//    var a = await web3.eth.getChainId();
//    console.log(a);
// })();

//"Web3.givenProvider" will be set if in an Ethereum supported browser.
//
// const options = {
//     defaultAccount: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
//     defaultBlock: 'latest',
//     defaultGas: 1,
//     defaultGasPrice: 0,
//     transactionBlockTimeout: 50,
//     transactionConfirmationBlocks: 24,
//     transactionPollingTimeout: 480,
// }

// const admin = new Admin(provider, null, options);



// const admin = new Admin(provider, null, options);


// async function Test(){
//    await web3.eth.net.getPeerCount();
//    myInfo.textContent = a;
// }
//
// myButton.onclick = function() {
//    //web3.eth.getChainId(console.log);
//    // web3.eth.net.getPeerCount().then(console.log);
//     //Test();
// }

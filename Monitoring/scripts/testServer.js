const readline = require('readline');
const Web3 = require('web3');

// import Web3 from 'web3';
// const Admin = require('web3-eth-admin').Admin;
// // import {Admin} from 'web3-eth-admin';
//


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
//
//
//
// web3 initialization - must point to the HTTP JSON-RPC endpoint
var provider = 'http://localhost:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))
web3.transactionConfirmationBlocks = 1;

(async() => {
    web3.eth.net.getPeerCount().then(console.log);

    web3.eth.getChainId().then(console.log);
    web3.eth.getBlock(1).then(console.log);
    // var acc = await web3.eth.getAccounts()
    // console.log(acc);

})();

//"Web3.givenProvider" will be set if in an Ethereum supported browser.
//
// const options = {
//    defaultAccount: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
//     defaultBlock: 'latest',
//     defaultGas: 1,
//     defaultGasPrice: 0,
//     transactionBlockTimeout: 50,
//     transactionConfirmationBlocks: 24,
//     transactionPollingTimeout: 480,
// }
// const admin = new Admin(provider, null, options);
//
//
//
//
//
//
// // (async() => {
// //     web3.eth.net.getPeerCount().then(console.log);
// //
// //     web3.eth.getChainId().then(console.log);
// //
// //
// //     admin.getPeers().then(console.log);
// //     // var acc = await web3.eth.getAccounts()
// //     // console.log(acc);
// //
// // })();
// function Info() {
//     var Number = "five";//web3.eth.net.getPeerCount();
//     myHeading.textContent = 'Number of peers: ' + Number;
// }
//
// myButton.onclick = function() {
//     Info();
// }
//
//

// function Test(){
//     myInfo.textContent = "Worked";
// }
// myButton.onclick = function() {
//     Test();
// }

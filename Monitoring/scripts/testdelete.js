
var x = location.hostname;
console.log(x);

var provider = 'http://localhost:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider, {headers: [{name: 'Access-Control-Allow-Origin', value: 'http://localhost:8545'}]}));
//new Web3(new Web3.providers.HttpProvider(provider))
web3.transactionConfirmationBlocks = 1;

(async() => {
    var a = await web3.eth.getBlock(1);
    console.log(a);
})();

// const options = {
//     defaultAccount: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
//     defaultBlock: 'latest',
//     defaultGas: 1,
//     defaultGasPrice: 0,
//     transactionBlockTimeout: 50,
//     transactionConfirmationBlocks: 24,
//     transactionPollingTimeout: 480,
// }
//Admin = Web3.Admin ;

// var admin = new Admin(provider,null,options);

//const admin = new web3.eth.Admin(provider, null, options);
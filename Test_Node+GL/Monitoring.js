const readline = require('readline');
const Web3 = require('web3');
const Admin =require('web3-eth-admin').Admin;
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
// Web3 Initialisation
var provider = 'http://localhost:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))
web3.transactionConfirmationBlocks = 1;
// Web3-Admin Initialisation
const options = {
    defaultAccount: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
    defaultBlock: 'latest',
    defaultGas: 1,
    defaultGasPrice: 0,
    transactionBlockTimeout: 50,
    transactionConfirmationBlocks: 24,
    transactionPollingTimeout: 480,
};
const admin = new Admin(provider, null, options);
//______________Functions
async function Blocks_Per_Miner() {
    var total = await web3.eth.getBlockNumber();
    var Peers = {};
    var transactions =  0;
    for(let i=0; i<total; i++){
        var block = await web3.eth.getBlock(i);
        let t = await web3.eth.getBlockTransactionCount(i);
        transactions += t ;
        if (block.miner in Peers){
            Peers[block.miner] = Peers[block.miner] +1;
        }
        else {
            Peers[block.miner] = 1;
        }
    }
    return([Peers,total,transactions]);
}
async function Blocks_Per_Miner_Update(Peers,previous,transactions){
    var actual = await web3.eth.getBlockNumber();
    for(let i=previous; i<actual; i++){
        var block = await web3.eth.getBlock(i);
        let t = await web3.eth.getBlockTransactionCount(i);
        transactions += t ;
        if (block.miner in Peers){
            Peers[block.miner] = Peers[block.miner] +1;
        }
        else {
            Peers[block.miner] = 1;
        }
    }
    return([Peers,actual,transactions]);
}
async function Loop(res){
    let Peers = res[0];
    let total = res[1];
    let transactions = res[2];
    c_res = await Blocks_Per_Miner_Update(Peers,total,transactions);
    console.log("******************")
    console.log("total blocks:  " + c_res[1] );
    console.log("total transactions:    " +c_res[2])
    for (var key in c_res[0]){
        console.log(key +" mined :" + Peers[key] +" blocks" )
        console.log("***")
    }
    setTimeout(function () {
        Loop(c_res);
    }, 3000);
}
//______________Main
(async () => {
    let res = await Blocks_Per_Miner()
    let PeerCount = await web3.eth.net.getPeerCount();
    let peers = await admin.getPeers();
    console.log("Number of Peers:" + PeerCount);
    console.log("Peers:",peers);
    Loop(res);
})();
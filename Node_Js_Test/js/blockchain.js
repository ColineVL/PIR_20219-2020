const Web3 = require('web3');
var provider = 'http://localhost:8545';
var web3 = new Web3(new Web3.providers.HttpProvider(provider))

// TODO ce serait pas à supprimer ça ?
const Admin =require('web3-eth-admin').Admin;
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

var SignedTransaction = require('./SignedTransactionModule');

let nodelist = [];
let nodelistIDS = [];
let blockslist = [];

var myVar = setInterval(refreshNodesList, 2000);
async function refreshNodesList() {
    let PeerCount = await web3.eth.net.getPeerCount();
    let peers = await admin.getPeers();
    nodelist =[];
    nodelistIDS = [];
    for(let i=0; i<PeerCount; i++) {
        nodelist.push(peers[i]);
        nodelistIDS.push(peers[i].id);
    }
};

function getInfoNode(id) {
    const node = nodelist[id];
    return node;
};

async function getBalance(account) {
    const balance = await web3.eth.getBalance(account.address);
    return balance;
};

async function createTransaction(sender, privateKey, receiver, ammount) {
    const r = await SignedTransaction.createAndSendSignedTransaction(provider,ammount,privateKey,sender,receiver);//,0.001,'8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','0xfe3b557e8fb62b89f4916b721be55ceb828dbd73','0xf17f52151EbEF6C7334FAD080c5704D77216b732');
    console.log("receipt:", r)
    console.log(info.a);
};

async function createNewAccount() {
    return await  web3.eth.accounts.create();
};

async function queryBlock(i) {
    var json = await web3.eth.getBlock(i);
    return json;
}

async function updateListBlocks() {
    web3.eth.getBlockNumber().then((n) => {
        console.log(n);
        for(let i=0; i<n; i++) {
            blockslist.push(queryBlock(i));
        }
        Promise.all(blockslist).then((value) =>{
            console.log("Après Promise" + blockslist);
        });
    });
    console.log("DANS BC" + blockslist);
};



/********************************
 * Exports
 ********************************/

function getNodelistIDS() {
    return nodelistIDS;
}

async function getBlockslist() {
    await updateListBlocks();
    return blockslist;
}

module.exports = {
    getNodelistIDS,
    getBlockslist,

    createNewAccount,

}
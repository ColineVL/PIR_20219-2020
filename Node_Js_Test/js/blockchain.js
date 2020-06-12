const Web3 = require('web3');
var provider = 'http://localhost:8545';
var web3 = new Web3(new Web3.providers.HttpProvider(provider))

const Admin = require('web3-eth-admin').Admin;
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

/********************************
 * Variables
 ********************************/
let nodelist = [];
let nodelistIDS = [];
let blockslistNUMBERS = [];
// TODO let the user change this ?
const nbBlocksToPrint = 5;

/********************************
 * Nodes
 ********************************/
setInterval(refreshNodesList, 2000);

async function refreshNodesList() {
    let PeerCount = await web3.eth.net.getPeerCount();
    let peers = await admin.getPeers();
    nodelist = [];
    nodelistIDS = [];
    for (let i = 0; i < PeerCount; i++) {
        nodelist.push(peers[i]);
        nodelistIDS.push(peers[i].id);
    }
};

function getInfoNode(id) {
    return nodelist[id];
};

/********************************
 * Get the balance of an account
 ********************************/
async function getBalance(addressToCheck) {
    const balance = await web3.eth.getBalance(addressToCheck);
    return balance;
};

/********************************
 * Create a transaction
 ********************************/

async function createTransaction(sender, privateKey, receiver, ammount) {
    const r = await SignedTransaction.createAndSendSignedTransaction(provider, ammount, privateKey, sender, receiver);//,0.001,'8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','0xfe3b557e8fb62b89f4916b721be55ceb828dbd73','0xf17f52151EbEF6C7334FAD080c5704D77216b732');
    console.log("receipt:", r)
    console.log(info.a);
};

/********************************
 * Create a new account
 ********************************/

async function createNewAccount() {
    return await web3.eth.accounts.create();
};

/********************************
 * Blocks
 ********************************/

// Update of the list of last blocks numbers
setInterval(refreshBlocksNUMBERSList, 2000);

function callbackBlocksNUMBERSlist() {
    if (nbBlocksToPrint == blockslistNUMBERS.length) {
        blockslistNUMBERS.sort();
        blockslistNUMBERS.reverse();
    }
}

function refreshBlocksNUMBERSList() {
    blockslistNUMBERS = [];
    blockslist = [];
    web3.eth.getBlockNumber().then((n) => {
        for (let i = n - nbBlocksToPrint + 1; i <= n; i++) {
            web3.eth.getBlock(i).then((json) => {
                blockslistNUMBERS.push(json["number"]);
                callbackBlocksNUMBERSlist();
            });
        }
    });
};

async function getBlockInfo(blocknumber) {
    var json = await web3.eth.getBlock(blocknumber);
    return json;
};


/********************************
 * Exports
 ********************************/

function getNodelistIDS() {
    return nodelistIDS;
}

function getBlockslistNUMBERS() {
    return blockslistNUMBERS;
};

module.exports = {
    getNodelistIDS,
    getBlockslistNUMBERS,
    getBlockInfo,
    getBalance,
    createNewAccount,
}
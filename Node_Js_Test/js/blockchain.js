var SignedTransaction = require('./SignedTransactionModule');

const options = {
    defaultAccount: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
    defaultBlock: 'latest',
    defaultGas: 1,
    defaultGasPrice: 0,
    transactionBlockTimeout: 50,
    transactionConfirmationBlocks: 24,
    transactionPollingTimeout: 480,
};

let nodelist = [];

// Attention il va surement me falloir une autre fonction timée pour mettre à jour l'affichage !
var myVar = setInterval(refreshNodeList, 2000);
function refreshNodesList() {
    let PeerCount = await web3.eth.net.getPeerCount();
    let peers = await admin.getPeers();
    nodelist =[];
    for(let i=0; i<PeerCount; i++) {
        nodelist.push(peers[i]);
    }
}

function getInfoNode(id) {
    const node = nodelist[id];
    return node;
}

function getBalance(account) {
    const balance = await web3.eth.getBalance(account.address);
    return balance;
}

function createTransaction(sender, privateKey, receiver, ammount) {
    const r = await SignedTransaction.createAndSendSignedTransaction(provider,ammount,privateKey,sender,receiver);//,0.001,'8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','0xfe3b557e8fb62b89f4916b721be55ceb828dbd73','0xf17f52151EbEF6C7334FAD080c5704D77216b732');
    console.log("receipt:", r)
    console.log(info.a);
}

function createNewAccount() {
    const info = await  web3.eth.accounts.create();
    return info;
}

const Web3 = require('web3');
const provider = 'http://192.168.33.115:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(provider))

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

const transactions = require('./SignedTransactionModule');
const crypto = require('./CryptoModule');
const readwrite = require('./ReadWriteModule');
const database = require('./database.js');
const EventsModule = require('./EventsModule');



const Diffie = database.newDiffieSchema();
const Reference_Seller = database.newReference_SellerSchema();
const Reference_Client = database.newReference_ClientSchema();

let prime = crypto.GetPrime(32);


/********************************
 * Variables
 ********************************/
let nodelistIDS = [];
let blockslistNUMBERS = [];
// TODO let the user change this ?
const nbBlocksToPrint = 5;

/********************************
 * Accounts
 ********************************/

async function getBalance(addressToCheck) {
    let bal = await web3.eth.getBalance(addressToCheck);
    bal = web3.utils.fromWei(bal, 'ether');
    return bal;
}

async function createNewAccount() {
    return web3.eth.accounts.create();
}

async function getAccount(privateKey) {
    try {
        let account = web3.eth.accounts.privateKeyToAccount(privateKey);
        return account;
    }
    catch(err) {
        return {error:"Bad private key."};
    }
}

/********************************
 * Nodes
 ********************************/
setInterval(refreshNodesList, 2000);
async function refreshNodesList() {
    let PeerCount = await web3.eth.net.getPeerCount();
    let peers = await admin.getPeers();
    nodelistIDS = [];
    for (let i = 0; i < PeerCount; i++) {
        nodelistIDS.push(peers[i].id);
    }
}

/********************************
 * Create a transaction
 ********************************/

async function createTransaction(jsonInfo) {
    jsonInfo = JSON.parse(jsonInfo);
    const receipt = await transactions.createAndSendSignedTransaction(provider, jsonInfo["amount"], jsonInfo["privateKey"], jsonInfo["sender"], jsonInfo["receiver"]);
    //,0.001,'8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','0xfe3b557e8fb62b89f4916b721be55ceb828dbd73','0xf17f52151EbEF6C7334FAD080c5704D77216b732');
    return receipt;
}

/********************************
 * Blocks
 ********************************/

// Update of the list of last blocks numbers
setInterval(refreshBlocksNUMBERSList, 2000);

function callbackBlocksNUMBERSlist() {
    if (nbBlocksToPrint === blockslistNUMBERS.length) {
        blockslistNUMBERS.sort();
        blockslistNUMBERS.reverse();
    }
}

function refreshBlocksNUMBERSList() {
    blockslistNUMBERS = [];
    web3.eth.getBlockNumber().then((n) => {
        for (let i = n - nbBlocksToPrint + 1; i <= n; i++) {
            web3.eth.getBlock(i).then((json) => {
                blockslistNUMBERS.push(json["number"]);
                callbackBlocksNUMBERSlist();
            });
        }
    });
}

async function getBlockInfo(blocknumber) {
    return web3.eth.getBlock(blocknumber);
}

/********************************
 * Sell new item
 ********************************/

async function sellItem(jsonInfo) {
   // jsonInfo = JSON.parse(jsonInfo);
    const price = jsonInfo["price"];
    const contractEndTime = jsonInfo["contractEndTime"];
    const description = jsonInfo["descr"];
    const privateKey = jsonInfo["privateKey"];
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    /*DH keys, to be stored and public sent*/
    const keys = crypto.DiffieHellmanGenerate(prime);
    /* Updating object to write and save */
    Diffie.PrivDH = keys[0];
    Diffie.PubDH = keys[1];

    /*Send transaction the get the ref_id for the database*/
    const receipt = await transactions.SellReference(account, Diffie.PubDH, price, contractEndTime, description);
    if (receipt) {
        let blockNumber = receipt.blockNumber;
        let event = await EventsModule.GetYourRef(account.address, blockNumber)
        let id = event[0].returnValues.referenceId;

        Diffie.refId = id;
        await readwrite.Write(__dirname + '/../Database/DH' + id.toString() + '_' + account.address.toString() + '.txt', JSON.stringify(Diffie));
        return("ok");
        // TODO afficher le receipt ?
    } else {
        return("error");
    }
}

async function buyProduct(id, product, privateKey) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const keys = crypto.DiffieHellmanGenerate(prime);
    /* Updating object to write and save */
    Diffie.PrivDH = keys[0];
    Diffie.PubDH = keys[1];
    Diffie.refId =id
    const receipt = await transactions.BuyReference(account,product[0],Diffie.PubDH);
    if (receipt) {
        await readwrite.Write(__dirname + '/../Database/DH' + id.toString() + '_' + account.address.toString() + '.txt', JSON.stringify(Diffie));
        return ("ok");
    } else {
        return ("error");
    }
}

async function manageID(id, privateKey) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    let product = await EventsModule.GetRef(id);
    const clients = await transactions.GetClients(account,id);
    let total_clients = clients.length;

    let ClientsWhoReceivedHashes = await EventsModule.GetEncryptedKeysSent(id);
    let num_clients_step1 = total_clients - ClientsWhoReceivedHashes.length;

    let Clients_WhoRespondedToHash = await EventsModule.GetEncryptedHashKeysResponses(id)
    let num_clients_step2 = total_clients -num_clients_step1 - Clients_WhoRespondedToHash.length;
    return [product, total_clients, num_clients_step1, num_clients_step2];
}

async function sendCryptedK2(id, privateKey) {
    const Account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const all_clients = await transactions.GetClients(Account,id);
    let ClientsWhoReceivedK2 = await EventsModule.GetEncryptedKeysSent(id); // This is a list of events
    let Address_ListClientsWhoReceivedK2 = await EventsModule.EventsToAddresses(ClientsWhoReceivedK2) // So I compute a  need a list of addresses
    let ClientsToDo = await EventsModule.ComputeLeft(all_clients,Address_ListClientsWhoReceivedK2) // Then i find who is left...

    let myDH_obj = await readwrite.ReadAsObjectDH(__dirname +'/../Database/DH' +id.toString() + '_' + Account.address.toString() +'.txt');
    // Now We have to: Generate a K2 and store it for eache client and send the hash of K xor K2

    let done = 0 // To check how many were succesful at the end...
    for (let i = 0; i < ClientsToDo.length  ; i++) {
        let client_address = ClientsToDo[i];

        let Pub_Client = await EventsModule.GetPubDiffieClient(client_address,id);
        let secret = crypto.DiffieHellmanComputeSecret(prime, myDH_obj.PubDH, myDH_obj.PrivDH, Pub_Client)
        let K2 = crypto.RandomBytes(7);

        let toSend = crypto.OTP(K2,crypto.OTP(secret,K2)).slice(0,4);
        let hashed = crypto.Hash(toSend);

        await readwrite.WriteAsRefSeller(__dirname +'/../Database/RefSeller' +id.toString() + '_' + ClientsToDo[i] +'.txt',hashed,K2)

        let receipt = await transactions.SendK2ToClient(Account,id, client_address, toSend);
        if (receipt) {
            done += 1;
        }
    }
    return [ClientsToDo.length, done];
}

/********************************
 * Exports
 ********************************/

async function getNodelistIDS() {
    return nodelistIDS;
}

function getBlockslistNUMBERS() {
    return blockslistNUMBERS;
}

module.exports = {
    getNodelistIDS,
    getBlockslistNUMBERS,
    getBlockInfo,
    getBalance,
    getAccount,
    createNewAccount,
    createTransaction,
    sellItem,
    buyProduct,
    manageID,
    sendCryptedK2,
};
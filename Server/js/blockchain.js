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


//let prime = crypto.GetPrime(32);
(async () => {
    prime = await readwrite.ReadPrimeAndGen(__dirname + '/../Database/PrimeAndGenerator.txt');
})();

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
    try {
        let bal = await web3.eth.getBalance(addressToCheck);
        bal = web3.utils.fromWei(bal, 'ether');
        return bal;
    } catch (err) {
        return err;
    }

}

async function createNewAccount() {
    return web3.eth.accounts.create();
}

async function getAccount(privateKey) {
    try {
        let account = web3.eth.accounts.privateKeyToAccount(privateKey);
        return account;
    } catch (err) {
        throw err;
    }
}

/********************************
 * Nodes
 ********************************/
setInterval(refreshNodesList, 2000);

async function refreshNodesList() {
    try {
        let PeerCount = await web3.eth.net.getPeerCount();
        let peers = await admin.getPeers();
        nodelistIDS = [];
        for (let i = 0; i < PeerCount; i++) {
            nodelistIDS.push(peers[i].id);
        }
    } catch (err) {
        console.error(err);
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
    })
}

async function getBlockInfo(blocknumber) {
    const block = await web3.eth.getBlock(blocknumber);
    return block;
}

/********************************
 * Sell new item
 ********************************/

async function sellItemZiad(price, description, durationDays, durationHours, durationMinutes, account, minData, depreciationType, deposit) {
    let durationInSecs = durationDays * 86400 + durationHours * 3600 + durationMinutes * 60;
    /*DH keys, to be stored and public sent*/
    const keys = crypto.DiffieHellmanGenerate(prime);
    /* Updating object to write and save */
    Diffie.PrivDH = keys[0];
    Diffie.PubDH = keys[1];

    let K = crypto.RandomBytes(7); //Reference key with which data is encrypted. TODO use this on TLE

    let priceInEther = web3.utils.toWei(price,'ether')

    /*Send transaction the get the ref_id for the database*/
    try {
        const receipt = await transactions.SellReference(account, Diffie.PubDH, priceInEther, durationInSecs, description, minData, depreciationType, deposit);
        let blockNumber = receipt.blockNumber;
        let event = await EventsModule.GetYourRef(account.address, blockNumber)
        let id = event[0].returnValues.referenceId;
        Diffie.refId = id;
        receipt.id = id;
        await readwrite.Write(__dirname + '/../Database/DH' + id.toString() + '_' + account.address.toString() + '.txt', JSON.stringify(Diffie));
        await readwrite.WriteAsSellerInfo(__dirname + '/../Database/SellerInfo' + id.toString() + '_' + account.address.toString() + '.txt', K)
        return [receipt, id];
    } catch (err) {
        return err;
    }
}

async function sellItemColine(jsonInfo, account) {
    jsonInfo = JSON.parse(jsonInfo);
    const initialPrice = jsonInfo["initialPrice"];
    const durationDays = jsonInfo["durationDays"];
    const durationHours = jsonInfo["durationHours"];
    const durationMinutes = jsonInfo["durationMinutes"];
    const description = jsonInfo["description"];
    const minData = jsonInfo["minData"];
    const depreciationType = jsonInfo["depreciationType"];
    const deposit = jsonInfo["deposit"];
    // let durationInSecs = ((durationDays * 24 + durationHours) * 60 + durationMinutes) * 60;
    let durationInSecs = durationDays * 86400 + durationHours * 3600 + durationMinutes * 60;

    /*DH keys, to be stored and public sent*/
    const keys = crypto.DiffieHellmanGenerate(prime);
    /* Updating object to write and save */
    Diffie.PrivDH = keys[0];
    Diffie.PubDH = keys[1];

    let K = crypto.RandomBytes(7); //Reference key with which data is encrypted. TODO use this on TLE


    /*Send transaction the get the ref_id for the database*/
    try {
        const receipt = await transactions.SellReference(account, Diffie.PubDH, initialPrice, durationInSecs, description, minData, depreciationType, deposit);
        let blockNumber = receipt.blockNumber;
        let event = await EventsModule.GetYourRef(account.address, blockNumber)
        let id = event[0].returnValues.referenceId;
        Diffie.refId = id;
        await readwrite.Write(__dirname + '/../Database/DH' + id.toString() + '_' + account.address.toString() + '.txt', JSON.stringify(Diffie));
        await readwrite.WriteAsSellerInfo(__dirname + '/../Database/SellerInfo' + id.toString() + '_' + account.address.toString() + '.txt', K)
        receipt.id = id;
        return receipt;
    } catch (err) {
        throw err;
    }
}

/********************************
 * Buy an item
 ********************************/

async function buyProduct(id, account) {
    const keys = crypto.DiffieHellmanGenerate(prime);
    /* Updating object to write and save */
    Diffie.PrivDH = keys[0];
    Diffie.PubDH = keys[1];
    Diffie.refId = id + 1
    try {
        let currentPrice = await transactions.GetCurrentPrice(account, id);
        const receipt = await transactions.BuyReference(account, id, Diffie.PubDH, currentPrice);
        await readwrite.Write(__dirname + '/../Database/DH' + id.toString() + '_' + account.address.toString() + '.txt', JSON.stringify(Diffie));
        return (currentPrice);
    } catch (e) {
        throw e;
    }
}

async function getCurrentPrice(account, id) {
    try {
        let currentPrice = await transactions.GetCurrentPrice(account, id);
        return currentPrice;
    } catch (e) {
        throw e;
    }

}

/********************************
 * Manage an Id
 ********************************/

async function manageID(id, account) {
    try {
        let product = await EventsModule.GetRef(id);
        const clients = await transactions.GetClients(account, id);
        let total_clients = clients.length;
        let ClientsWhoReceivedHashes = await EventsModule.GetEncryptedKeysSent(id);
        let num_clients_step1 = total_clients - ClientsWhoReceivedHashes.length;
        let KeysSent = await EventsModule.GetKeysSent(id);
        let ReceivedHashes = await EventsModule.GetClientsWhoSentHashes(id)
        let num_clients_step2 = ReceivedHashes.length - KeysSent.length

        let KeyEvent = await EventsModule.ReferenceKeySent(id);

        let Key = 0;
        if (KeyEvent.length > 0) {
            let buffer = Buffer.from(web3.utils.hexToBytes(KeyEvent[0].returnValues[1])).slice(0, 7)
            Key = buffer.toString('hex');
        }
        return [product, total_clients, num_clients_step1, num_clients_step2, Key];

    } catch (e) {
        throw e;
    }
}

/*Computes information for managing an Id Buyer side*/
async function manageIDBuyer(id, account) {
    try {
        let product = await EventsModule.GetRef(id);

        let eventEncryptedReceived = await EventsModule.GetEncryptedKeySentSpecific(id, account.address)
        let eventDecoderReceived = await EventsModule.GetKeySentSpecific(id, account.address)
        let eventHashSent = await EventsModule.GetHashFromClient(account.address,id)

        let num_event2 = eventDecoderReceived.length
        let num_event1 = eventEncryptedReceived.length - eventHashSent.length // Because in that case it is already done

        return [product[0], num_event1, num_event2];

    } catch (e) {
        throw e;
    }
}

async function getClients(account, id) {
    try {
        let num = await transactions.GetClients(account, id)
        return num;
    } catch (e) {
        throw e;
    }

}

async function sendEncryptedEncodedKey(id, Account) {
    try {
        const all_clients = await transactions.GetClients(Account, id);
        let ClientsWhoReceivedK2 = await EventsModule.GetEncryptedKeysSent(id); // This is a list of events
        let Address_ListClientsWhoReceivedK2 = await EventsModule.EventsToAddresses(ClientsWhoReceivedK2) // So I compute a  need a list of addresses
        let ClientsToDo = await EventsModule.ComputeLeft(all_clients, Address_ListClientsWhoReceivedK2) // Then i find who is left...

        let myDH_obj = await readwrite.ReadAsObjectDH(__dirname + '/../Database/DH' + id.toString() + '_' + Account.address.toString() + '.txt');

        let K = await readwrite.Read_K(__dirname + '/../Database/SellerInfo' + id.toString() + '_' + Account.address.toString() + '.txt')
        // Now We have to: Generate a K2 and store it for eache client and send the hash of K xor K2

        let done = 0 // To check how many were succesful at the end...
        for (let i = 0; i < ClientsToDo.length; i++) {
            let client_address = ClientsToDo[i];

            let Pub_Client = await EventsModule.GetPubDiffieClient(client_address, id);
            let secret = crypto.DiffieHellmanComputeSecret(prime, myDH_obj.PubDH, myDH_obj.PrivDH, Pub_Client)
            let K2 = crypto.RandomBytes(7);

            let toEncrypt = crypto.OTP(K, K2)

            let toSend = crypto.OTP(secret, toEncrypt)//.slice(0,4);
            let hashed = crypto.Hash(toEncrypt);

            await readwrite.WriteAsRefSeller(__dirname + '/../Database/RefSeller' + id.toString() + '_' + ClientsToDo[i] + '.txt', hashed, K2)

            try {
                let receipt = await transactions.sendEncryptedEncodedKey(Account, id, client_address, toSend);
                done += 1;
            } catch (e) {
                console.log(e);
            }
            // let receipt = await transactions.sendEncryptedEncodedKey(Account, id, client_address, toSend);
            // if (receipt) {
            //     done += 1;
            // }
        }
        return [ClientsToDo.length, done];
    } catch (e) {
        throw e;
    }

}

async function sendEncryptedEncodedKeyMalicious(id, privateKey) {
    const Account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const all_clients = await transactions.GetClients(Account, id);
    let ClientsWhoReceivedK2 = await EventsModule.GetEncryptedKeysSent(id); // This is a list of events
    let Address_ListClientsWhoReceivedK2 = await EventsModule.EventsToAddresses(ClientsWhoReceivedK2) // So I compute a  need a list of addresses
    let ClientsToDo = await EventsModule.ComputeLeft(all_clients, Address_ListClientsWhoReceivedK2) // Then i find who is left...

    let myDH_obj = await readwrite.ReadAsObjectDH(__dirname + '/../Database/DH' + id.toString() + '_' + Account.address.toString() + '.txt');

    // Now We have to: Generate a K2 and store it for eache client and send the hash of K xor K2

    let done = 0 // To check how many were succesful at the end...
    for (let i = 0; i < ClientsToDo.length; i++) {
        let client_address = ClientsToDo[i];

        let Pub_Client = await EventsModule.GetPubDiffieClient(client_address, id);
        let secret = crypto.DiffieHellmanComputeSecret(prime, myDH_obj.PubDH, myDH_obj.PrivDH, Pub_Client)
        let K2 = crypto.RandomBytes(7);

        let K_Malicious = crypto.RandomBytes(7);

        let toEncrypt = crypto.OTP(K_Malicious, K2)

        let toSend = crypto.OTP(secret, toEncrypt)//.slice(0,4);
        let hashed = crypto.Hash(toEncrypt);

        await readwrite.WriteAsRefSeller(__dirname + '/../Database/RefSeller' + id.toString() + '_' + ClientsToDo[i] + '.txt', hashed, K2)

        let receipt = await transactions.sendEncryptedEncodedKey(Account, id, client_address, toSend);
        if (receipt) {
            done += 1;
        }
    }
    return [ClientsToDo.length, done];
}

/*Function to handle sending the appropriate K2 to every client which responded with a correct hash*/
async function sendDecoderKey(id, Account) {
    try {
        let ClientsWhoSentHashes = await EventsModule.GetClientsWhoSentHashes(id); // This is a list of events corresponding to clients who sent me a hash
        let ClientsReceivedK2 = await EventsModule.GetKeysSent(id); // This is a list of events corresponding to the clients I already answered concerning their hashes
        let Address_ListClientsWhoSentHashes = await EventsModule.EventsToAddresses(ClientsWhoSentHashes)  // Transformed into a list of addresses
        let Address_ListClientsWhoReceivedK2 = await EventsModule.EventsToAddresses(ClientsReceivedK2)  // Transformed into a list of addresses
        let ClientsToDo = await EventsModule.ComputeLeft(Address_ListClientsWhoSentHashes, Address_ListClientsWhoReceivedK2) // Then i find who is left...

        // Now We have to: Verify each hash received with the ones we had saved

        let done = 0 // To check how many were succesful at the end...
        for (let i = 0; i < ClientsToDo.length; i++) {
            let myRef_obj = await readwrite.ReadAsObjectRefSeller(__dirname + '/../Database/RefSeller' + id.toString() + '_' + ClientsToDo[i] + '.txt');

            let client_address = ClientsToDo[i];

            let correctHash = myRef_obj.hash;

            let eventReceivedHash = await EventsModule.GetHashFromClient(client_address, id);
            let receivedHash =eventReceivedHash[0].returnValues.encodedKeyHash

            if (correctHash == receivedHash) {
                let receipt = await transactions.sendDecoderKey(Account, id, client_address, myRef_obj.K2);
                if (receipt) {
                    done += 1;
                }
            }
        }
        return [ClientsToDo.length, done];
    } catch (e) {
        throw e;
    }

}

/*Malicious Version*/
async function sendDecoderKeyMalicious(id, privateKey) {
    const Account = web3.eth.accounts.privateKeyToAccount(privateKey);

    let ClientsWhoSentHashes = await EventsModule.GetClientsWhoSentHashes(id); // This is a list of events corresponding to clients who sent me a hash
    let ClientsReceivedK2 = await EventsModule.GetKeysSent(id); // This is a list of events corresponding to the clients I already answered concerning their hashes
    let Address_ListClientsWhoSentHashes = await EventsModule.EventsToAddresses(ClientsWhoSentHashes)  // Transformed into a list of addresses
    let Address_ListClientsWhoReceivedK2 = await EventsModule.EventsToAddresses(ClientsReceivedK2)  // Transformed into a list of addresses
    let ClientsToDo = await EventsModule.ComputeLeft(Address_ListClientsWhoSentHashes, Address_ListClientsWhoReceivedK2) // Then i find who is left...

    // Now We have to: Verify each hash received with the ones we had saved

    let done = 0 // To check how many were succesful at the end...
    for (let i = 0; i < ClientsToDo.length; i++) {
        let myRef_obj = await readwrite.ReadAsObjectRefSeller(__dirname + '/../Database/RefSeller' + id.toString() + '_' + ClientsToDo[i] + '.txt');

        let client_address = ClientsToDo[i];

        let correctHash = myRef_obj.hash;

        let eventReceivedHash = await EventsModule.GetHashFromClient(client_address, id);
        let receivedHash = eventReceivedHash[0].returnValues.encodedKeyHash

        let K_Malicious = crypto.RandomBytes(7);

        if (correctHash == receivedHash) {
            let receipt = await transactions.sendDecoderKey(Account, id, client_address, K_Malicious);
            if (receipt) {
                done += 1;
            }
        }
    }
    return [ClientsToDo.length, done];
}

/*Function for the client to send the hash of K xor K2 to the provider*/
async function sendClientHash(id, privateKey) {
    try {
        const Account = web3.eth.accounts.privateKeyToAccount(privateKey);

        let product = await EventsModule.GetRef(id)

        let myDH_obj = await readwrite.ReadAsObjectDH(__dirname + '/../Database/DH' + id.toString() + '_' + Account.address.toString() + '.txt'); //Loading my DH keys from the database
        let seller_address = await EventsModule.EventsToAddresses(product) //getting the seller's address neeeded to get his public key
        let Pub_Seller = await EventsModule.GetPubDiffieSeller(seller_address[0], id); // now getting the sellers public DH key
        let secret = crypto.DiffieHellmanComputeSecret(prime, myDH_obj.PubDH, myDH_obj.PrivDH, Pub_Seller) // we now have the diffie-Hellman secret key..


        let encrypted_event = await EventsModule.GetEncryptedKeySentSpecific(id, Account.address) // Get the K xor K2 xor K3 the provider sent me
        let encrypted = Buffer.from(web3.utils.hexToBytes(encrypted_event[0].returnValues.encryptedEncodedKey)).slice(0, 7) // The actual value

        let decryptedToBeHashed = crypto.OTP(secret, encrypted).slice(0, 7);
        let HashTobeSent = crypto.Hash(decryptedToBeHashed)


        await readwrite.WriteAsRefBuyer(__dirname + '/../Database/RefBuyer' + id.toString() + '_' + Account.address + '.txt', decryptedToBeHashed)
        let done = 0 // value to verify later that everything went correctly
        let receipt = transactions.SendHashToProvider(Account, id, HashTobeSent)
        // Now we can do the OTP

        if (receipt) {
            done = 1;
        }
        return done;
    } catch (e) {
        throw e;
    }
}

/*Function for the client to send a fake hash of K xor K2 to the provider*/
async function sendClientHashMalicious(id, privateKey) {
    try {
        const Account = web3.eth.accounts.privateKeyToAccount(privateKey);
        let HashTobeSent = crypto.Hash((new Buffer.from("fakeClientHash")))

        let done = 0 // value to verify later that everything went correctly
        let receipt = transactions.SendHashToProvider(Account, id, HashTobeSent)
        // Now we can do the OTP

        if (receipt) {
            done = 1;
        }
        return done;
    } catch (e) {
        throw e;
    }

}

/*Function for the client to receive K2, compute K and save it*/
async function ComputeK(id, privateKey) {
    try {
        const Account = web3.eth.accounts.privateKeyToAccount(privateKey);

        let RefBuyer = await readwrite.ReadAsObjectRefClient(__dirname + '/../Database/RefBuyer' + id.toString() + '_' + Account.address + '.txt')
        let K2_event = await EventsModule.GetClientDecoder(id, Account.address);

        let K2 = Buffer.from(web3.utils.hexToBytes(K2_event[0].returnValues.keyDecoder)).slice(0, 7) // The actual value

        RefBuyer.K2 = K2;
        await readwrite.WriteAsRefBuyer(__dirname + '/../Database/RefBuyer' + id.toString() + '_' + Account.address + '.txt', RefBuyer.KxorK2, RefBuyer.K2)
        let K = crypto.OTP(RefBuyer.KxorK2, RefBuyer.K2)

        return K;
    } catch (e) {
        throw e;
    }

}

/*Function to Check if it is possible to raise a dispute, or to retrieve your money*/
async function DisputeInfoClient(id, privateKey) {
    try {
        const Account = web3.eth.accounts.privateKeyToAccount(privateKey);

        let encoderEvent = await EventsModule.GetKeySentSpecific(id, Account.address)
        let buyEvent = await EventsModule.GetBoughtRefSpecific(id, Account.address)


        return [encoderEvent.length, buyEvent[0].returnValues.fund];
    } catch (e) {
        throw e;
    }

}

/*Function to to raise a dispute, or to retrieve your money*/
async function Dispute(id, privateKey) {
    try {
        const Account = web3.eth.accounts.privateKeyToAccount(privateKey);

        let bool = false;
        let receipt = await transactions.RaiseDispute(Account, id)
        if (receipt) {
            bool = true
        }
        let disputeEvent = await EventsModule.GetDispute(Account.address, id)

        return [bool, disputeEvent[0].returnValues.funds];
    } catch (e) {
        throw e;
    }

}

/*For a provider to release the reference Key*/
async function sendReferenceKey(id, Account) {
    let refKey = await readwrite.Read_K(__dirname + '/../Database/SellerInfo' + id.toString() + '_' + Account.address.toString() + '.txt')

    let receipt = await transactions.sendRefKey(Account, id, refKey)

    return [receipt, refKey];
}

/*For a provider to release the reference Key*/
async function sendReferenceKeyMalicious(id, privateKey) {
    const Account = web3.eth.accounts.privateKeyToAccount(privateKey);
    let refKeyMalicious = crypto.RandomBytes(7);

    let receipt = await transactions.sendRefKey(Account,id,refKeyMalicious)

    return [receipt,refKeyMalicious];
}

/*Function to to raise a dispute, or to retrieve your money*/
async function withdrawFundsProvider(id, privateKey) {
    const Account = web3.eth.accounts.privateKeyToAccount(privateKey);

    let receipt = await transactions.withdrawFundsProvider(Account,id)

    let withdrawEvent = await EventsModule.WithdrawFundsEvent(id);
    if (receipt){
        console.log("okkkkk")
    }


    return withdrawEvent;
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
    sellItemZiad,
    sellItemColine,
    buyProduct,
    manageID,
    manageIDBuyer,
    sendEncryptedEncodedKey,
    sendClientHash,
    sendDecoderKey,
    ComputeK,
    getCurrentPrice,
    getClients,
    DisputeInfoClient,
    Dispute,
    sendReferenceKey,
    sendClientHashMalicious,
    sendEncryptedEncodedKeyMalicious,
    sendDecoderKeyMalicious,
    sendReferenceKeyMalicious,
    withdrawFundsProvider

};
const Web3 = require('web3');
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

/* Providers */
const provider = 'http://192.168.33.115:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(provider));
const web3ws = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.33.115:8546'));
const admin = new Admin(provider, null, options);

/*Loading contract */
let ContractAddress = '0x42699A7612A82f1d9C36148af9C77354759b210b';
let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"fund","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"}],"name":"NewClient","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"redeemFunds","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"minimumData","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"deployTime","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"endTime","type":"uint128"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"},{"indexed":false,"internalType":"uint8","name":"depreciationType","type":"uint8"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"NewDataReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedEncodedKey","type":"bytes32"}],"name":"encryptedEncodedKeyEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedKeyHash","type":"bytes32"}],"name":"encryptedKeyHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"keyDecoder","type":"uint256"}],"name":"keyDecoder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referenceKey","type":"uint256"}],"name":"referenceKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"withdrawRefund","type":"event"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"}],"name":"buyReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint128","name":"_minimumData","type":"uint128"},{"internalType":"uint128","name":"_referenceDuration","type":"uint128"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"},{"internalType":"uint8","name":"_depreciationType","type":"uint8"},{"internalType":"string","name":"_description","type":"string"}],"name":"createDataReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dataReferences","outputs":[{"internalType":"uint256","name":"initialPrice","type":"uint256"},{"internalType":"uint256","name":"redeemFunds","type":"uint256"},{"internalType":"uint256","name":"referenceKey","type":"uint256"},{"internalType":"uint128","name":"minimumData","type":"uint128"},{"internalType":"uint128","name":"numberOfData","type":"uint128"},{"internalType":"uint128","name":"deployTime","type":"uint128"},{"internalType":"uint128","name":"endTime","type":"uint128"},{"internalType":"uint8","name":"depreciationType","type":"uint8"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"uint256","name":"withdrawableFunds","type":"uint256"},{"internalType":"uint128","name":"numberOfDisputes","type":"uint128"},{"internalType":"uint128","name":"completedClients","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClientDisputes","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getNumberOfData","outputs":[{"internalType":"uint128","name":"numberOfData","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getReferenceCurrentPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"raiseDispute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"bytes32","name":"_encryptedEncodedKey","type":"bytes32"}],"name":"setEncryptedEncodedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_encryptedKeyHash","type":"bytes32"}],"name":"setEncryptedHashedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"uint256","name":"_keyDecoder","type":"uint256"}],"name":"setKeyDecoder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"uint256","name":"_referenceKey","type":"uint256"}],"name":"setReferenceKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}];
//TODO: current abi :Provider
const contract = new web3.eth.Contract(abi, ContractAddress); //TODO give correct address when available
const contractws = new web3ws.eth.Contract(abi, ContractAddress);
; //TODO give correct address when available




module.exports = {
    /*Get all references */
    GetAvailableRefs: async function (endTime, priceMax, provider) {
        endTime = endTime || 0; //TODO Talk about endtime
        priceMax = priceMax || 0;
        const options = {
            fromBlock: 0,
            filter: {price: [0, priceMax], contractEndTime: [0, endTime]}
        }
        let res1 = await contractws.getPastEvents("NewDataReference", {
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {
        }) // TODO Eventually do something here
        return res1;
    },

    /*Get a specific reference by it's Id*/
    GetRef: async function (refId) {
        let res1 = await contractws.getPastEvents("NewDataReference", {
            filter: {referenceId: refId},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },

    /*Get the reference you just put up for sale (useful for sellers database)*/
    GetYourRef: async function (address, blockNumber) {
        let res1 = await contractws.getPastEvents("NewDataReference", {
            filter: {address: address},
            fromBlock: blockNumber-1,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },

    /*Get references bought by a specific id*/
    GetBoughtRefs: async function (address) {
        let res1 = await contractws.getPastEvents("newClient", {
            filter: {client: address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },

    /*Get references being sold by a specific id*/
    GetSoldRefs: async function (address) {
        let res1 = await contractws.getPastEvents("NewDataReference", {
            filter: {provider: address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },
    // /*Get all emits testifying that a client sent the encrypted key hashed for a certain product of reference id : id*/
    // GetEncryptedHashKeysResponses: async function (id) {
    //     let res1 = await contractws.getPastEvents("encryptedKeyHash", {
    //         filter: {referenceId: id},
    //         fromBlock: 0,
    //         toBlock: 'latest'
    //     }, function (error, events) {}) // TODO Eventually do something here
    //     return res1;
    // },
    /*Get all emits testifying that a the provider sent the encrypted key K2 for a certain product of reference id : id*/
    GetEncryptedKeysSent: async function (id) {
        let res1 = await contractws.getPastEvents("encryptedEncodedKeyEvent", {
            filter: {referenceId: id},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },

    /*Get emit testifying that a the provider sent the encrypted key K2 for a certain product of reference id : id*/
    GetEncryptedKeySentSpecific: async function (id,myaddress) {
        let res1 = await contractws.getPastEvents("encryptedEncodedKeyEvent", {
            filter: {client: myaddress, referenceId: id},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },

    /*Get emit testifying that a the provider sent me the K2 for a certain product of reference id : id*/
    GetKeySentSpecific: async function (id, myaddress) {
        let res1 = await contractws.getPastEvents("keyDecoder", {
            filter: {client: myaddress, referenceId: id},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },

    /*Get emits testifying that clients ent me hashes for a certain product of reference id : id*/
    GetClientsWhoSentHashes: async function (id) {
        let res1 = await contractws.getPastEvents("encodedKeyHash", {
            filter: { referenceId: id},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },

    /*Get all emits testifying that K2 was sent for a certain product of reference id : id*/
    GetKeysSent: async function (id) {
        let res1 = await contractws.getPastEvents("keyDecoder", {
            filter: {referenceId: id},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },

    /*Useful function that transforms a list of events into a list of addresses concerned by the event*/
    /*note that the event has to be coded such that the attribute of the addresses is "client" !*/
    EventsToAddresses: function (events) {
        let res = [];
        for (let i = 0; i < events.length ; i++) {
            res.push(events[i].returnValues.client)
        }
        return res;
    },
    /*Computes the list of elements in list1 and not list2*/
    ComputeLeft : function (list1,list2) {
        let res = [];
        for (let i = 0; i < list1.length ; i++) {
            if ( !(list2.indexOf(list1[i]) >= 0) ) {
                res.push(list1[i])
            }
        }
        return res;
    },

    /*Get the DH Public Key of a provider for a certain id*/
    GetPubDiffieClient: async function (address_client, id) {
        let res1 = await contractws.getPastEvents("newClient", {
            filter: {referenceId: id, address: address_client},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return new Buffer.from(web3.utils.hexToBytes(res1[0].returnValues.publicKeyDH)).slice(0,4); //TODO Check lengths for slices..
    },

    /*Get the DH Public Key of a seller for a certain id*/
    GetPubDiffieSeller: async function (address_seller, id) {
        let res1 = await contractws.getPastEvents("NewDataReference", {
            filter: {referenceId: id, address: address_seller},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return new Buffer.from(web3.utils.hexToBytes(res1[0].returnValues.publicKeyDH)).slice(0,4); //TODO Check lengths for slices..
    },

    /*Get correct emit from client with the hash he submitted for a particular Id */
    GetHashFromClientClient: async function (client_address,id) {
        let res1 = await contractws.getPastEvents("encodedKeyHash", {
            filter: { referenceId: id, client: client_address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1[0].returnValues.encodedKeyHash;
    },

    /*Get Decoder (K2) from the event emitted by the seller, for me, for a particular Id */
    GetClientDecoder: async function (id,my_address) {
        let res1 = await contractws.getPastEvents("keyDecoder", {
            filter: { referenceId: id, client: my_address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return new Buffer.from(web3.utils.hexToBytes(res1[0].returnValues.keyDecoder)).slice(0,4);
    },

}
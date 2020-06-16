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
let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"publicKey","type":"uint256"}],"name":"NewClient","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"contractEndTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"publicKey","type":"uint256"},{"indexed":true,"internalType":"string","name":"description","type":"string"}],"name":"NewDataReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"bytes32","name":"encryptedKeyHash","type":"bytes32"}],"name":"encryptedKeyHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"keyDecoder","type":"uint256"}],"name":"keyDecoder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"time","type":"uint256"}],"name":"raiseDisputeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referenceKey","type":"uint256"}],"name":"referenceKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":true,"internalType":"address","name":"loser","type":"address"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"settleDisputeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"withdrawRefund","type":"event"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"uint256","name":"_publicKey","type":"uint256"}],"name":"buy_reference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_contractEndTime","type":"uint256"},{"internalType":"uint256","name":"_publicKey","type":"uint256"},{"internalType":"string","name":"_description","type":"string"}],"name":"createDataReference","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dataReferences","outputs":[{"internalType":"uint256","name":"referenceId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"referenceKey","type":"uint256"},{"internalType":"uint256","name":"contractEndTime","type":"uint256"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"bool","name":"withdrawnFunds","type":"bool"},{"internalType":"uint256","name":"clientDisputes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClientDisputes","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"bool[]","name":"","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"raiseDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_encryptedKeyHash","type":"bytes32"}],"name":"setEncryptedHashedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"uint256","name":"_keyDecoder","type":"uint256"}],"name":"setKeyDecoder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"uint256","name":"_referenceKey","type":"uint256"}],"name":"setReferenceKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address payable","name":"_client","type":"address"}],"name":"settleDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawDisputeFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}];
//TODO: current abi :Provider
const contract = new web3.eth.Contract(abi, '0xa50a51c09a5c451C52BB714527E1974b686D8e77'); //TODO give correct address when available
const contractws = new web3ws.eth.Contract(abi, '0xa50a51c09a5c451C52BB714527E1974b686D8e77');
; //TODO give correct address when available




module.exports = {
    // GetAvailableRefs: async function (contractws, endTime, priceMax, provider) {
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
    GetRef: async function (refId) {
        console.log(refId)
        let res1 = await contractws.getPastEvents("NewDataReference", {
            filter: {referenceId: refId.toString()},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },
    GetBoughtRef: async function (account) {
        console.log(refId)
        let res1 = await contractws.getPastEvents("NewClient", {
            filter: {address: account.address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {}) // TODO Eventually do something here
        return res1;
    },
}

// event NewDataReference(uint referenceId, address provider, uint price, uint contractEndTime);
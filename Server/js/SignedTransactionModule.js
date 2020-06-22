const readline = require('readline');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');


function toBinary(input) {
    var result = "";
    for (var i = 0; i < input.length; i++) {
        var bin = input[i].charCodeAt().toString(2);
        result += Array(8 - bin.length + 1).join("0") + bin;
    }
    return result;
}

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


let ContractAddress = '0x42699A7612A82f1d9C36148af9C77354759b210b';
let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"}],"name":"NewClient","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"contractEndTime","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"NewDataReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedEncodedKey","type":"bytes32"}],"name":"encryptedEncodedKeyEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedKeyHash","type":"bytes32"}],"name":"encryptedKeyHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"keyDecoder","type":"uint256"}],"name":"keyDecoder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"time","type":"uint256"}],"name":"raiseDisputeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referenceKey","type":"uint256"}],"name":"referenceKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":true,"internalType":"address","name":"loser","type":"address"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"settleDisputeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"withdrawRefund","type":"event"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"}],"name":"buyReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_contractEndTime","type":"uint256"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"},{"internalType":"string","name":"_description","type":"string"}],"name":"createDataReference","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dataReferences","outputs":[{"internalType":"uint256","name":"referenceId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"referenceKey","type":"uint256"},{"internalType":"uint256","name":"contractEndTime","type":"uint256"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"bool","name":"withdrawnFunds","type":"bool"},{"internalType":"uint256","name":"clientDisputes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClientDisputes","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"bool[]","name":"","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"raiseDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"bytes32","name":"_encryptedEncodedKey","type":"bytes32"}],"name":"setEncryptedEncodedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_encryptedKeyHash","type":"bytes32"}],"name":"setEncryptedHashedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"uint256","name":"_keyDecoder","type":"uint256"}],"name":"setKeyDecoder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"uint256","name":"_referenceKey","type":"uint256"}],"name":"setReferenceKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address payable","name":"_client","type":"address"}],"name":"settleDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawDisputeFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}];
//TODO: current abi :Provider
const contract = new web3.eth.Contract(abi, ContractAddress); //TODO give correct address when available


module.exports = {
    createAndSendSignedTransaction: async function (prov, valueInEther, privateKey_notBuffered, addressFrom, addressTo) {
        // web3 initialization - must point to the HTTP JSON-RPC endpoint
        web3.transactionConfirmationBlocks = 1;

        const privateKey = new Buffer.from(privateKey_notBuffered, 'hex');
        const txnCount = await web3.eth.getTransactionCount(addressFrom, "pending")
        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: '0x' + addressTo,
            value: web3.utils.numberToHex(web3.utils.toWei(valueInEther.toString(), 'ether'))
        };
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const rawTxHex = '0x' + serializedTx.toString('hex');
        return web3.eth.sendSignedTransaction(rawTxHex);
    },
    createAndSendSignedTransactionData: async function (prov, valueInEther, privateKey_notBuffered, addressFrom, addressTo, data) {
        // web3.transactionConfirmationBlocks = 1;

        const privateKey = new Buffer.from(privateKey_notBuffered, 'hex');
        const txnCount = await web3.eth.getTransactionCount(addressFrom, "pending")
        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: addressTo,
            value: web3.utils.numberToHex(web3.utils.toWei(valueInEther.toString(), 'ether')),
            data: data
        };
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const rawTxHex = '0x' + serializedTx.toString('hex');
        return web3.eth.sendSignedTransaction(rawTxHex);
    },
    BuyReference: async function (account, product, pubKey) {
        // web3.transactionConfirmationBlocks = 1;

        let pubKey_bin = web3.utils.bytesToHex(pubKey);
        const privateKey = new Buffer.from(account.privateKey.substring(2), 'hex');
        const txnCount = await web3.eth.getTransactionCount(account.address, "pending")
        const dataref = contract.methods.buyReference(product.returnValues.referenceId,pubKey_bin).encodeABI();

        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: ContractAddress,
            value: parseInt(product.returnValues.price,10),
            data: dataref
        };
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const rawTxHex = '0x' + serializedTx.toString('hex');
        let receipt = web3.eth.sendSignedTransaction(rawTxHex)
            .catch(function(error){console.log(error)});
        return receipt;
    },

    SellReference: async function (account,pubKey,price,endTime,description) {
        let pubKey_bin = web3.utils.bytesToHex(pubKey);
        const privateKey = new Buffer.from(account.privateKey.substring(2), 'hex');
        const txnCount = await web3.eth.getTransactionCount(account.address, "pending")
        const dataref = contract.methods.createDataReference(price, endTime,pubKey_bin, description).encodeABI();

        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: ContractAddress,
            data: dataref
        };
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const rawTxHex = '0x' + serializedTx.toString('hex');
        let receipt = web3.eth.sendSignedTransaction(rawTxHex)
            .catch(function(error){});
        return receipt;
    },

    /*Function to view the clients of a certain reference*/
    GetClients: async function (account,id) {
        let clients = await contract.methods.getClients(id).call({from : account.address})
            .catch(function(error){});
        return clients;
    },
    /*Send K2 xor K to the correct client (via the contract) from the provider*/
    SendEncryptedK2ToClient: async function (account,id, client_address, encryptedEncodedKey) {
        let bin = web3.utils.bytesToHex(encryptedEncodedKey);
        const privateKey = new Buffer.from(account.privateKey.substring(2), 'hex');
        const txnCount = await web3.eth.getTransactionCount(account.address, "pending")
        const dataref = contract.methods.setEncryptedEncodedKey(id, client_address, bin).encodeABI();

        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: ContractAddress,
            data: dataref
        };
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const rawTxHex = '0x' + serializedTx.toString('hex');
        let receipt = web3.eth.sendSignedTransaction(rawTxHex)
            .catch(function(error){console.log(error)});
        return receipt;
    },

    /*Send correct K2 to the correct client (via the contract) from the provider*/
    SendK2ToClient: async function (account,id, client_address, Key) {
        let bin = web3.utils.bytesToHex(Key);
        const privateKey = new Buffer.from(account.privateKey.substring(2), 'hex');
        const txnCount = await web3.eth.getTransactionCount(account.address, "pending")
        const dataref = contract.methods.setKeyDecoder(id, client_address, bin).encodeABI();

        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: ContractAddress,
            data: dataref
        };
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const rawTxHex = '0x' + serializedTx.toString('hex');
        let receipt = web3.eth.sendSignedTransaction(rawTxHex)
            .catch(function(error){console.log(error)});

        console.log(receipt)
        return receipt;
    },

    /*Send the hash to the provider (via the contract)*/
    SendHashToProvider: async function (account,id, Hash) {

        const privateKey = new Buffer.from(account.privateKey.substring(2), 'hex');
        const txnCount = await web3.eth.getTransactionCount(account.address, "pending")
        const dataref = contract.methods.setEncryptedHashedKey(id, Hash).encodeABI();
        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: ContractAddress,
            data: dataref
        };
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const rawTxHex = '0x' + serializedTx.toString('hex');
        let receipt = web3.eth.sendSignedTransaction(rawTxHex)
            .catch(function(error){console.log(error)});
        return receipt;
    },

};

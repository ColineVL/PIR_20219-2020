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
let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encodedKeyHash","type":"bytes32"}],"name":"encodedKeyHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedEncodedKey","type":"bytes32"}],"name":"encryptedEncodedKeyEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"keyDecoder","type":"bytes32"}],"name":"keyDecoder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"fund","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"newClient","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"initialPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"insuranceDeposit","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"minimumData","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"deployTime","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"endTime","type":"uint128"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"},{"indexed":false,"internalType":"uint8","name":"depreciationType","type":"uint8"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"newDataReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"string","name":"TLE","type":"string"}],"name":"newTLE","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"referenceKey","type":"bytes32"}],"name":"referenceKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"withdrawRefund","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"TLEs","outputs":[{"internalType":"string","name":"spaceObject","type":"string"},{"internalType":"string","name":"TLE","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"}],"name":"buyReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_initialPrice","type":"uint256"},{"internalType":"uint128","name":"_minimumData","type":"uint128"},{"internalType":"uint128","name":"_referenceDuration","type":"uint128"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"},{"internalType":"uint8","name":"_depreciationType","type":"uint8"},{"internalType":"string","name":"_description","type":"string"}],"name":"createDataReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dataReferences","outputs":[{"internalType":"uint256","name":"initialPrice","type":"uint256"},{"internalType":"uint256","name":"insuranceDeposit","type":"uint256"},{"internalType":"bytes32","name":"referenceKey","type":"bytes32"},{"internalType":"uint128","name":"minimumData","type":"uint128"},{"internalType":"uint128","name":"numberOfData","type":"uint128"},{"internalType":"uint128","name":"deployTime","type":"uint128"},{"internalType":"uint128","name":"endTime","type":"uint128"},{"internalType":"uint8","name":"depreciationType","type":"uint8"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"uint256","name":"withdrawableFunds","type":"uint256"},{"internalType":"uint128","name":"numberOfDisputes","type":"uint128"},{"internalType":"uint128","name":"completedClients","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClientDisputes","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceKey","type":"uint256"}],"name":"getKeyDecoder","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getNumberOfData","outputs":[{"internalType":"uint128","name":"numberOfData","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getReferenceCurrentPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getTLEs","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"components":[{"internalType":"string","name":"spaceObject","type":"string"},{"internalType":"string","name":"TLE","type":"string"}],"internalType":"struct TLE_Contract.structTLE[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"raiseDispute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_encodedKeyHash","type":"bytes32"}],"name":"setEncodedHashedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"bytes32","name":"_encryptedEncodedKey","type":"bytes32"}],"name":"setEncryptedEncodedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"bytes32","name":"_keyDecoder","type":"bytes32"}],"name":"setKeyDecoder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_referenceKey","type":"bytes32"}],"name":"setReferenceKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"string","name":"_spaceObject","type":"string"},{"internalType":"string","name":"_TLE","type":"string"}],"name":"setTLE","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}]
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
    BuyReference: async function (account, referenceId, pubKey, currentPrice) {
        // web3.transactionConfirmationBlocks = 1;

        let pubKey_bin = web3.utils.bytesToHex(pubKey);
        const privateKey = new Buffer.from(account.privateKey.substring(2), 'hex');
        const txnCount = await web3.eth.getTransactionCount(account.address, "pending")
        const dataref = contract.methods.buyReference(referenceId,pubKey_bin).encodeABI();
        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: ContractAddress,
            value: parseInt(currentPrice,10),
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

    SellReference: async function (account,pubKey,price,duration,description,minData,depreciationType,insuranceDeposit) {
        let pubKey_bin = web3.utils.bytesToHex(pubKey);
        const privateKey = new Buffer.from(account.privateKey.substring(2), 'hex');
        const txnCount = await web3.eth.getTransactionCount(account.address, "pending")
        const dataref = contract.methods.createDataReference(price, minData, duration,pubKey_bin, depreciationType, description).encodeABI();

        const rawTx = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1500),
            gasLimit: web3.utils.numberToHex(4700000),
            to: ContractAddress,
            data: dataref,
            value: parseInt(insuranceDeposit,10),
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
            .catch(function(error){console.log(error);});
        return clients;
    },

    /*Function to get the current price of a certain reference*/
    GetCurrentPrice: async function (account,id) {
        let price = await contract.methods.getReferenceCurrentPrice(id).call({from : account.address})
            .catch(function(error){console.log(error);});
        return price;
    },

    /*Send K2 xor K xor K3 to the correct client (via the contract) from the provider*/
    sendEncryptedEncodedKey: async function (account,id, client_address, encryptedEncodedKey) {
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
    sendDecoderKey: async function (account,id, client_address, Key) {
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
        return receipt;
    },

    /*Send the hash to the provider (via the contract)*/
    SendHashToProvider: async function (account,id, Hash) {

        const privateKey = new Buffer.from(account.privateKey.substring(2), 'hex');
        const txnCount = await web3.eth.getTransactionCount(account.address, "pending")
        const dataref = contract.methods.setEncodedHashedKey(id, Hash).encodeABI();
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

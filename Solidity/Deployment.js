const Web3 = require('web3');
var Tx = require('ethereumjs-tx');
let fs = require("fs");



// Web3 Initialisation
const provider = 'http://192.168.33.115:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))


//////////////////////////////////////Account info for deployment///////////////////////////////////////////////////
var account1= "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
var key1 =new Buffer.from('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','hex');
/////////////////////////////////////////////////////////////////////////////////////////:

// Read the compiled contract code
// Compile with
// solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
// let source = fs.readFileSync("/home/rsx14/IdeaProjects/PIR/Solidity/contracts.json");
// let contracts = JSON.parse(source)["contracts"];

// ABI description as JSON structure

let abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes1[]","name":"","type":"bytes1[]"}],"name":"diffieHellman","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"","type":"bytes32"}],"name":"diffieHellmans","type":"event"},{"inputs":[],"name":"byteView","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hashEquals","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hashView","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hashViewGiven","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes1[]","name":"diffie","type":"bytes1[]"}],"name":"setDiffie","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"diffie1","type":"bytes32"},{"internalType":"bytes32","name":"diffie2","type":"bytes32"},{"internalType":"bytes32","name":"diffie3","type":"bytes32"},{"internalType":"bytes32","name":"diffie4","type":"bytes32"}],"name":"setDiffies","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"setHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_k","type":"bytes32"},{"internalType":"bytes32","name":"_k2","type":"bytes32"}],"name":"setKeys","outputs":[],"stateMutability":"nonpayable","type":"function"}]


//[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]



// Smart contract EVM bytecode as hex

let code = '0x' + "608060405234801561001057600080fd5b50610428806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063be405ff41161005b578063be405ff414610137578063c321051e14610155578063c459d095146101a1578063ce3a97df1461025957610088565b8063013577da1461008d5780630c4c4285146100af5780637727071d146100dd57806380b7220e14610115575b600080fd5b610095610277565b604051808215151515815260200191505060405180910390f35b6100db600480360360208110156100c557600080fd5b810190808035906020019092919050505061028b565b005b610113600480360360408110156100f357600080fd5b810190808035906020019092919080359060200190929190505050610295565b005b61011d6102a7565b604051808215151515815260200191505060405180910390f35b61013f6102e4565b6040518082815260200191505060405180910390f35b61019f6004803603608081101561016b57600080fd5b8101908080359060200190929190803590602001909291908035906020019092919080359060200190929190505050610318565b005b610257600480360360208110156101b757600080fd5b81019080803590602001906401000000008111156101d457600080fd5b8201836020820111156101e657600080fd5b8035906020019184602083028401116401000000008311171561020857600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f82011690508083019250505050505050919291929050505061036d565b005b6102616103e8565b6040518082815260200191505060405180910390f35b6000806000801b6000541490508091505090565b8060028190555050565b81600081905550806001819055505050565b6000806001546000541860405160200180828152602001915050604051602081830303815290604052805190602001206002541490508091505090565b6000600154600054186040516020018082815260200191505060405160208183030381529060405280519060200120905090565b7f807377e4f0a08a48f8aaf7f9d23b7231bb3cdd02f35ed5a70552f217e5d1e604848484846040518085815260200184815260200183815260200182815260200194505050505060405180910390a150505050565b7f4c0e353f2eb66d6e0c4562b16db838ca01d64a960fdeef0f2c275cfb4480a210816040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156103d25780820151818401526020810190506103b7565b505050509050019250505060405180910390a150565b600060025490509056fea2646970667358221220e70ad8203b025fd95ab754a9c606746a2f0594f6d4c080ffcbd4f897520fe9cd64736f6c63430006080033";



//
// Create Contract proxy class
let SampleContract = new web3.eth.Contract(abi);
const gasPrice = 1000;//web3.eth.gasPrice;
const gasPriceHex = web3.utils.numberToHex(gasPrice);
const gasLimitHex = web3.utils.numberToHex(4500000);


(async () => {
    const nonceval = await web3.eth.getTransactionCount(account1, "pending"); //'0x' + new Date().getTime();

    console.log(nonceval);

    var fTx = {
        nonce: nonceval,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data: code,
        from: account1
    };

    var txx = new Tx(fTx);
    txx.sign(key1);

    var sTx =txx.serialize();


    const receipt = await web3.eth.sendSignedTransaction('0x' + sTx.toString('hex')).on('receipt', function(receipt){
        console.log(receipt);
    });
})();

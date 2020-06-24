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
let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encodedKeyHash","type":"bytes32"}],"name":"encodedKeyHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedEncodedKey","type":"bytes32"}],"name":"encryptedEncodedKeyEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"keyDecoder","type":"bytes32"}],"name":"keyDecoder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"fund","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"newClient","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"initialPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"insuranceDeposit","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"minimumData","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"deployTime","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"endTime","type":"uint64"},{"indexed":false,"internalType":"bytes32","name":"publicKeyDH","type":"bytes32"},{"indexed":false,"internalType":"uint8","name":"depreciationType","type":"uint8"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"newDataReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"string","name":"spaceObject","type":"string"}],"name":"newTLE","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"referenceKey","type":"bytes32"}],"name":"referenceKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_referenceId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"withdrawFundsEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"withdrawRefund","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"TLEs","outputs":[{"internalType":"string","name":"spaceObject","type":"string"},{"internalType":"string","name":"TLE","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"}],"name":"buyReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_initialPrice","type":"uint256"},{"internalType":"uint64","name":"_minimumData","type":"uint64"},{"internalType":"uint64","name":"_referenceDuration","type":"uint64"},{"internalType":"bytes32","name":"_publicKeyDH","type":"bytes32"},{"internalType":"uint8","name":"_depreciationType","type":"uint8"},{"internalType":"string","name":"_description","type":"string"}],"name":"createDataReference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClientDisputes","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceKey","type":"uint256"}],"name":"getKeyDecoder","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getNumberOfData","outputs":[{"internalType":"uint128","name":"numberOfData","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getReferenceCurrentPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getTLEs","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"components":[{"internalType":"string","name":"spaceObject","type":"string"},{"internalType":"string","name":"TLE","type":"string"}],"internalType":"struct TLE_Contract.structTLE[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"raiseDispute","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_encodedKeyHash","type":"bytes32"}],"name":"setEncodedHashedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"bytes32","name":"_encryptedEncodedKey","type":"bytes32"}],"name":"setEncryptedEncodedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address","name":"_client","type":"address"},{"internalType":"bytes32","name":"_keyDecoder","type":"bytes32"}],"name":"setKeyDecoder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_referenceKey","type":"bytes32"}],"name":"setReferenceKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"string","name":"_spaceObject","type":"string"},{"internalType":"string","name":"_TLE","type":"string"}],"name":"setTLE","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}]

//[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]



// Smart contract EVM bytecode as hex
let code = '0x' + "608060405234801561001057600080fd5b5061338c806100206000396000f3fe6080604052600436106100f35760003560e01c80638656bbe91161008a578063b14b678711610059578063b14b67871461032f578063ca90fee514610358578063e3752bbe14610396578063ed957100146103d3576100f3565b80638656bbe91461026357806392a0294f1461028c578063a5c1674e146102c9578063ac231a9814610306576100f3565b8063293dca69116100c6578063293dca69146101a45780633e24e56a146101cd57806342dd519c146101e95780637d918a2514610226576100f3565b806307bbb8d4146100f8578063155dd5ee1461011457806320a6bde91461013d57806323bf426214610166575b600080fd5b610112600480360381019061010d9190612b57565b610410565b005b34801561012057600080fd5b5061013b60048036038101906101369190612adf565b61071c565b005b34801561014957600080fd5b50610164600480360381019061015f9190612b57565b6108d5565b005b34801561017257600080fd5b5061018d60048036038101906101889190612c12565b610a56565b60405161019b929190612fb7565b60405180910390f35b3480156101b057600080fd5b506101cb60048036038101906101c69190612b93565b610bc4565b005b6101e760048036038101906101e29190612c4e565b610d70565b005b3480156101f557600080fd5b50610210600480360381019061020b9190612adf565b6110f6565b60405161021d9190612f0d565b60405180910390f35b34801561023257600080fd5b5061024d60048036038101906102489190612adf565b61121a565b60405161025a9190612fee565b60405180910390f35b34801561026f57600080fd5b5061028a60048036038101906102859190612b57565b61125f565b005b34801561029857600080fd5b506102b360048036038101906102ae9190612adf565b61136f565b6040516102c09190612f4a565b60405180910390f35b3480156102d557600080fd5b506102f060048036038101906102eb9190612adf565b61143d565b6040516102fd9190612f2f565b60405180910390f35b34801561031257600080fd5b5061032d60048036038101906103289190612b08565b6118df565b005b34801561033b57600080fd5b5061035660048036038101906103519190612b08565b611b60565b005b34801561036457600080fd5b5061037f600480360381019061037a9190612adf565b611c37565b60405161038d929190612f65565b60405180910390f35b3480156103a257600080fd5b506103bd60048036038101906103b89190612adf565b612178565b6040516103ca9190612f0d565b60405180910390f35b3480156103df57600080fd5b506103fa60048036038101906103f59190612adf565b6123d8565b6040516104079190613009565b60405180910390f35b816000801b6000828154811061042257fe5b90600052602060002090600d0201600401541461043e57600080fd5b6000818154811061044b57fe5b90600052602060002090600d020160050160189054906101000a900467ffffffffffffffff1667ffffffffffffffff16421061048657600080fd5b6000610491826123d8565b9050803410156104a057600080fd5b600082815481106104ad57fe5b90600052602060002090600d0201600001543411156104cb57600080fd5b60001515600085815481106104dc57fe5b90600052602060002090600d020160090160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151461054457600080fd5b6000848154811061055157fe5b90600052602060002090600d0201600701339080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600085815481106105d257fe5b90600052602060002090600d020160090160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550346000858154811061064557fe5b90600052602060002090600d020160080160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555034600085815481106106a557fe5b90600052602060002090600d0201600201600082825401925050819055503373ffffffffffffffffffffffffffffffffffffffff16847f4059ccbea539583e69b0db8efe5c16d1c5ddc863b12df52b3be3fa65029d8a6334864260405161070e93929190613024565b60405180910390a350505050565b806000818154811061072a57fe5b90600052602060002090600d020160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461079357600080fd5b601e600083815481106107a257fe5b90600052602060002090600d020160050160189054906101000a900467ffffffffffffffff160167ffffffffffffffff1642116107de57600080fd5b6000801b600083815481106107ef57fe5b90600052602060002090600d020160040154141561080c57600080fd5b600080838154811061081a57fe5b90600052602060002090600d0201600201549050600080848154811061083c57fe5b90600052602060002090600d0201600201819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610897573d6000803e3d6000fd5b50827f5ab32616397610e8c52d9f2c536a03778db8878dda9c977d99c05bcb5666dd90826040516108c89190613009565b60405180910390a2505050565b8160008082815481106108e457fe5b90600052602060002090600d020160080160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541161093d57600080fd5b6000801b6000848154811061094e57fe5b90600052602060002090600d0201600b0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415610a025781600084815481106109b157fe5b90600052602060002090600d0201600b0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002050505b3373ffffffffffffffffffffffffffffffffffffffff16837fc9a5303ca56727b24e4955597b9bb74dd9bc6462dbad79d63dd393b1b7e5d10684604051610a499190612f4a565b60405180910390a3505050565b60016020528160005260406000208181548110610a6f57fe5b906000526020600020906002020160009150915050806000018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b1c5780601f10610af157610100808354040283529160200191610b1c565b820191906000526020600020905b815481529060010190602001808311610aff57829003601f168201915b505050505090806001018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bba5780601f10610b8f57610100808354040283529160200191610bba565b820191906000526020600020905b815481529060010190602001808311610b9d57829003601f168201915b5050505050905082565b8260008181548110610bd257fe5b90600052602060002090600d020160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c3b57600080fd5b610c436127c6565b838160000181905250828160200181905250600160008681526020019081526020016000208190806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000019080519060200190610cae9291906127e0565b506020820151816001019080519060200190610ccb9291906127e0565b50505060008581548110610cdb57fe5b90600052602060002090600d0201600501600881819054906101000a900467ffffffffffffffff168092919060010191906101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555050847f0d24b8ac995fa8eca2b46e0246413d6123831e152dfb6a0cbd71df864ba2192b85604051610d619190612f95565b60405180910390a25050505050565b610d78612860565b868160000181815250503481602001818152505034816040018181525050858160a0019067ffffffffffffffff16908167ffffffffffffffff16815250508281610120019060ff16908160ff1681525050428160e0019067ffffffffffffffff16908167ffffffffffffffff168152505042850181610100019067ffffffffffffffff16908167ffffffffffffffff16815250504267ffffffffffffffff1681610100015167ffffffffffffffff1611610e3157600080fd5b33816060019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505060008190806001815401808255809150506001900390600052602060002090600d020160009091909190915060008201518160000155602082015181600101556040820151816002015560608201518160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506080820151816004015560a08201518160050160006101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555060c08201518160050160086101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555060e08201518160050160106101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055506101008201518160050160186101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055506101208201518160060160006101000a81548160ff021916908360ff160217905550610140820151816007019080519060200190611000929190612930565b5061016082015181600a0160006101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff16021790555061018082015181600a0160106101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff16021790555050503373ffffffffffffffffffffffffffffffffffffffff166001600080549050037fc1fe646c8e19f25897b021414c652720d8350cd9d63596199ee8dc136fdcd76489348a428761010001518b8b8b6040516110e5989796959493929190613084565b60405180910390a350505050505050565b6060816000818154811061110657fe5b90600052602060002090600d020160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461116f57600080fd5b6000838154811061117c57fe5b90600052602060002090600d020160070180548060200260200160405190810160405280929190818152602001828054801561120d57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116111c3575b5050505050915050919050565b600080828154811061122857fe5b90600052602060002090600d020160050160089054906101000a900467ffffffffffffffff1667ffffffffffffffff169050919050565b816000818154811061126d57fe5b90600052602060002090600d020160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146112d657600080fd5b6000801b600084815481106112e757fe5b90600052602060002090600d02016004015414801561130957506000801b8214155b1561136a57816000848154811061131c57fe5b90600052602060002090600d020160040181905550827f2a1b289fe6fe9bd89c1cfbbed506798801b402cafb0a3d93c29cb9c8aafed920836040516113619190612f4a565b60405180910390a25b505050565b600081600080828154811061138057fe5b90600052602060002090600d020160080160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054116113d957600080fd5b600083815481106113e657fe5b90600052602060002090600d0201600c0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054915050919050565b600081600080828154811061144e57fe5b90600052602060002090600d020160080160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054116114a757600080fd5b60008084815481106114b557fe5b90600052602060002090600d020160080160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050806000858154811061151457fe5b90600052602060002090600d020160020154101561153157600080fd5b6000801b6000858154811061154257fe5b90600052602060002090600d0201600c0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414156115ab576115a184826125f8565b60019250506118d9565b6000801b600085815481106115bc57fe5b90600052602060002090600d0201600401541461187a5760008085815481106115e157fe5b90600052602060002090600d0201600c0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546000868154811061163d57fe5b90600052602060002090600d0201600401541890506000858154811061165f57fe5b90600052602060002090600d0201600b0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054816040516020016116bf9190612f4a565b604051602081830303815290604052805190602001201461176757600085815481106116e757fe5b90600052602060002090600d0201600a0160109054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff166000868154811061173457fe5b90600052602060002090600d0201600101548161174d57fe5b048201915061175c85836125f8565b6001935050506118d9565b6000858154811061177457fe5b90600052602060002090600d020160050160009054906101000a900467ffffffffffffffff1667ffffffffffffffff16600086815481106117b157fe5b90600052602060002090600d020160050160089054906101000a900467ffffffffffffffff1667ffffffffffffffff16101561187457600085815481106117f457fe5b90600052602060002090600d0201600a0160109054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff166000868154811061184157fe5b90600052602060002090600d0201600101548161185a57fe5b048201915061186985836125f8565b6001935050506118d9565b506118d3565b6000848154811061188757fe5b90600052602060002090600d020160050160189054906101000a900467ffffffffffffffff1667ffffffffffffffff164211156118d2576118c884826125f8565b60019250506118d9565b5b60009250505b50919050565b82600081815481106118ed57fe5b90600052602060002090600d020160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461195657600080fd5b600080858154811061196457fe5b90600052602060002090600d020160080160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541115611b5a576000801b600085815481106119ca57fe5b90600052602060002090600d0201600c0160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054148015611a2957506000801b8214155b15611b59578160008581548110611a3c57fe5b90600052602060002090600d0201600c0160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060008481548110611a9b57fe5b90600052602060002090600d0201600a01601081819054906101000a90046fffffffffffffffffffffffffffffffff168092919060010191906101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff160217905550508273ffffffffffffffffffffffffffffffffffffffff16847f557b07a87337236272a12c29e39bd292a192d7c1811cc6994635d23284e935df84604051611b509190612f4a565b60405180910390a35b5b50505050565b8260008181548110611b6e57fe5b90600052602060002090600d020160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611bd757600080fd5b6000801b8214611c31578273ffffffffffffffffffffffffffffffffffffffff16847fd57e7ea23bb50dbe8316bec30809240f566976ab1b1e4e37e76c7bb3e0b645f084604051611c289190612f4a565b60405180910390a35b50505050565b6000606060008381548110611c4857fe5b90600052602060002090600d020160050160189054906101000a900467ffffffffffffffff1667ffffffffffffffff1642108015611ca657506000801b60008481548110611c9257fe5b90600052602060002090600d020160040154145b15611f9f576000801b60008481548110611cbc57fe5b90600052602060002090600d0201600c0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054141580611d81575060008381548110611d2057fe5b90600052602060002090600d020160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b611d8a57600080fd5b60008381548110611d9757fe5b90600052602060002090600d0201600c0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546001600085815260200190815260200160002080805480602002602001604051908101604052809291908181526020016000905b82821015611f905783829060005260206000209060020201604051806040016040529081600082018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611ed65780601f10611eab57610100808354040283529160200191611ed6565b820191906000526020600020905b815481529060010190602001808311611eb957829003601f168201915b50505050508152602001600182018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611f785780601f10611f4d57610100808354040283529160200191611f78565b820191906000526020600020905b815481529060010190602001808311611f5b57829003601f168201915b50505050508152505081526020019060010190611e1a565b50505050905091509150612173565b60008381548110611fac57fe5b90600052602060002090600d0201600401546001600085815260200190815260200160002080805480602002602001604051908101604052809291908181526020016000905b828210156121685783829060005260206000209060020201604051806040016040529081600082018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156120ae5780601f10612083576101008083540402835291602001916120ae565b820191906000526020600020905b81548152906001019060200180831161209157829003601f168201915b50505050508152602001600182018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156121505780601f1061212557610100808354040283529160200191612150565b820191906000526020600020905b81548152906001019060200180831161213357829003601f168201915b50505050508152505081526020019060010190611ff2565b505050509050915091505b915091565b6060816000818154811061218857fe5b90600052602060002090600d020160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146121f157600080fd5b60008084815481106121ff57fe5b90600052602060002090600d0201600a0160009054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff16905060608167ffffffffffffffff8111801561225a57600080fd5b506040519080825280602002602001820160405280156122895781602001602082028036833780820191505090505b509050600080600090505b600087815481106122a157fe5b90600052602060002090600d0201600701805490508110156123cb57600087815481106122ca57fe5b90600052602060002090600d020160070181815481106122e657fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169150600080888154811061232157fe5b90600052602060002090600d020160080160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414156123be578183828151811061238357fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505b8080600101915050612294565b5081945050505050919050565b600080600083815481106123e857fe5b90600052602060002090600d0201600001549050600080848154811061240a57fe5b90600052602060002090600d020160060160009054906101000a900460ff16905060018160ff16141561250457600080858154811061244557fe5b90600052602060002090600d020160050160109054906101000a900467ffffffffffffffff166000868154811061247857fe5b90600052602060002090600d020160050160189054906101000a900467ffffffffffffffff160367ffffffffffffffff16905060008086815481106124b957fe5b90600052602060002090600d020160050160109054906101000a900467ffffffffffffffff1667ffffffffffffffff164203905081818502816124f857fe5b048403935050506125ee565b60028160ff1614156125ed57600080858154811061251e57fe5b90600052602060002090600d020160050160109054906101000a900467ffffffffffffffff166000868154811061255157fe5b90600052602060002090600d020160050160189054906101000a900467ffffffffffffffff160367ffffffffffffffff169050600080868154811061259257fe5b90600052602060002090600d020160050160109054906101000a900467ffffffffffffffff1667ffffffffffffffff16420390508382828660020202816125d557fe5b048384028384880202816125e557fe5b040301935050505b5b8192505050919050565b806000838154811061260657fe5b90600052602060002090600d020160020154101561262357600080fd5b6000828154811061263057fe5b90600052602060002090600d0201600a01600081819054906101000a90046fffffffffffffffffffffffffffffffff168092919060010191906101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff1602179055505060008083815481106126ac57fe5b90600052602060002090600d020160080160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806000838154811061270c57fe5b90600052602060002090600d0201600201600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015612770573d6000803e3d6000fd5b503373ffffffffffffffffffffffffffffffffffffffff16827f54cd3e4964cbbb07875e24bd38c626e4572701f70d0992629dfbad3a0a6597ec83426040516127ba92919061305b565b60405180910390a35050565b604051806040016040528060608152602001606081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061282157805160ff191683800117855561284f565b8280016001018555821561284f579182015b8281111561284e578251825591602001919060010190612833565b5b50905061285c91906129ba565b5090565b604051806101a00160405280600081526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff16815260200160008019168152602001600067ffffffffffffffff168152602001600067ffffffffffffffff168152602001600067ffffffffffffffff168152602001600067ffffffffffffffff168152602001600060ff1681526020016060815260200160006fffffffffffffffffffffffffffffffff16815260200160006fffffffffffffffffffffffffffffffff1681525090565b8280548282559060005260206000209081019282156129a9579160200282015b828111156129a85782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555091602001919060010190612950565b5b5090506129b691906129df565b5090565b6129dc91905b808211156129d85760008160009055506001016129c0565b5090565b90565b612a1f91905b80821115612a1b57600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506001016129e5565b5090565b90565b600081359050612a31816132e3565b92915050565b600081359050612a46816132fa565b92915050565b600082601f830112612a5d57600080fd5b8135612a70612a6b82613136565b613109565b91508082526020830160208301858383011115612a8c57600080fd5b612a97838284613290565b50505092915050565b600081359050612aaf81613311565b92915050565b600081359050612ac481613328565b92915050565b600081359050612ad98161333f565b92915050565b600060208284031215612af157600080fd5b6000612aff84828501612aa0565b91505092915050565b600080600060608486031215612b1d57600080fd5b6000612b2b86828701612aa0565b9350506020612b3c86828701612a22565b9250506040612b4d86828701612a37565b9150509250925092565b60008060408385031215612b6a57600080fd5b6000612b7885828601612aa0565b9250506020612b8985828601612a37565b9150509250929050565b600080600060608486031215612ba857600080fd5b6000612bb686828701612aa0565b935050602084013567ffffffffffffffff811115612bd357600080fd5b612bdf86828701612a4c565b925050604084013567ffffffffffffffff811115612bfc57600080fd5b612c0886828701612a4c565b9150509250925092565b60008060408385031215612c2557600080fd5b6000612c3385828601612aa0565b9250506020612c4485828601612aa0565b9150509250929050565b60008060008060008060c08789031215612c6757600080fd5b6000612c7589828a01612aa0565b9650506020612c8689828a01612ab5565b9550506040612c9789828a01612ab5565b9450506060612ca889828a01612a37565b9350506080612cb989828a01612aca565b92505060a087013567ffffffffffffffff811115612cd657600080fd5b612ce289828a01612a4c565b9150509295509295509295565b6000612cfb8383612d1b565b60208301905092915050565b6000612d138383612e8d565b905092915050565b612d2481613201565b82525050565b6000612d3582613182565b612d3f81856131bd565b9350612d4a83613162565b8060005b83811015612d7b578151612d628882612cef565b9750612d6d836131a3565b925050600181019050612d4e565b5085935050505092915050565b6000612d938261318d565b612d9d81856131ce565b935083602082028501612daf85613172565b8060005b85811015612deb5784840389528151612dcc8582612d07565b9450612dd7836131b0565b925060208a01995050600181019050612db3565b50829750879550505050505092915050565b612e0681613213565b82525050565b612e158161321f565b82525050565b6000612e2682613198565b612e3081856131df565b9350612e4081856020860161329f565b612e49816132d2565b840191505092915050565b6000612e5f82613198565b612e6981856131f0565b9350612e7981856020860161329f565b612e82816132d2565b840191505092915050565b60006040830160008301518482036000860152612eaa8282612e1b565b91505060208301518482036020860152612ec48282612e1b565b9150508091505092915050565b612eda81613229565b82525050565b612ee981613265565b82525050565b612ef88161326f565b82525050565b612f0781613283565b82525050565b60006020820190508181036000830152612f278184612d2a565b905092915050565b6000602082019050612f446000830184612dfd565b92915050565b6000602082019050612f5f6000830184612e0c565b92915050565b6000604082019050612f7a6000830185612e0c565b8181036020830152612f8c8184612d88565b90509392505050565b60006020820190508181036000830152612faf8184612e54565b905092915050565b60006040820190508181036000830152612fd18185612e54565b90508181036020830152612fe58184612e54565b90509392505050565b60006020820190506130036000830184612ed1565b92915050565b600060208201905061301e6000830184612ee0565b92915050565b60006060820190506130396000830186612ee0565b6130466020830185612e0c565b6130536040830184612ee0565b949350505050565b60006040820190506130706000830185612ee0565b61307d6020830184612ee0565b9392505050565b60006101008201905061309a600083018b612ee0565b6130a7602083018a612ee0565b6130b46040830189612eef565b6130c16060830188612eef565b6130ce6080830187612eef565b6130db60a0830186612e0c565b6130e860c0830185612efe565b81810360e08301526130fa8184612e54565b90509998505050505050505050565b6000604051905081810181811067ffffffffffffffff8211171561312c57600080fd5b8060405250919050565b600067ffffffffffffffff82111561314d57600080fd5b601f19601f8301169050602081019050919050565b6000819050602082019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b600061320c82613245565b9050919050565b60008115159050919050565b6000819050919050565b60006fffffffffffffffffffffffffffffffff82169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600067ffffffffffffffff82169050919050565b600060ff82169050919050565b82818337600083830152505050565b60005b838110156132bd5780820151818401526020810190506132a2565b838111156132cc576000848401525b50505050565b6000601f19601f8301169050919050565b6132ec81613201565b81146132f757600080fd5b50565b6133038161321f565b811461330e57600080fd5b50565b61331a81613265565b811461332557600080fd5b50565b6133318161326f565b811461333c57600080fd5b50565b61334881613283565b811461335357600080fd5b5056fea264697066735822122046e983645090b65dcf709256f28c68555724914006589f5a0ad4856239d0c45964736f6c63430006080033";


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

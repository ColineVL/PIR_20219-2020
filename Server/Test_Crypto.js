const crypto = require('crypto');
const assert = require('assert');
const Web3 = require('web3');
const provider = 'http://192.168.33.115:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(provider));


function toBinary(input){
    var result = "";
    for (var i = 0; i < input.length; i++) {
        var bin = input[i].charCodeAt().toString(2);
        result += Array(8 - bin.length + 1).join("0") + bin;
    }
    return result;
}

// Generate Alice's keys...
const alice = crypto.createDiffieHellman(256);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// console.log(alice);
// console.log(aliceKey);
console.log(toBinary(bobKey.toString('hex')).length)
console.log(toBinary(bobKey.toString('hex')))
console.log(parseInt(toBinary(bobKey.toString('hex')),2));
// console.log(bobKey.length)
// console.log(bobSecret.toString('hex').length)
// console.log(toBinary(bobSecret.toString('hex')).length);
//
// ///////////////////////////////////////////////////////

function toAscii(input) {
    var result = "";
    var arr = input.match(/.{1,8}/g);
    for (var i = 0; i < arr.length; i++) {
        result += String.fromCharCode(parseInt(arr[i], 2).toString(10));
    }
    return result;
}
function OTP(key, message) {
    var res = [];
    for (let i = 0; i < message.length ; i++) {
        res .push(key[i] ^ message[i]);
    }
    return new Buffer.from(res,'hex');
}
// let message = "This is a simple test. 2.5.2" ;
// let m_bin = toBinary(message);
// console.log(message);
// console.log(m_bin.length);
//
// console.log(bobSecret.toString().length)
// let OTPKey = toBinary(bobSecret.toString('hex'));
//
//
// let crypted_m = OTP(OTPKey, m_bin);
//
// // console.log("key :" + OTPKey);
// console.log("crypted :" + toAscii(crypted_m))
//
// let decrypted_m = OTP(OTPKey, crypted_m);
//
// console.log("decrypted :" + toAscii(decrypted_m))

let priv = alice.getPrivateKey();
let pub =  alice.getPublicKey();
console.log("................");
console.log(pub);
console.log(aliceKey);
console.log(priv);

let prime= toBinary(alice.getPrime().toString("hex"));
const third  = crypto.createDiffieHellman(alice.getPrime());
third.setPrivateKey(priv)
third.setPublicKey(pub)
console.log("arane")
console.log(third.getPublicKey().toString("hex"))
console.log(alice.getPublicKey())
console.log(alice.getPrivateKey())
console.log(toBinary(third.getPrivateKey().toString("hex")))

let thirdsecret = third.computeSecret(bobKey)


console.log("................");
console.log(thirdsecret);
console.log(aliceSecret);
console.log(bobSecret);

let str ="lgvjhv";

let res = toBinary(str);
console.log(res);
console.log("..............")
let key = alice.getPrime()
console.log(toBinary(key.toString("hex")));

console.log("####################################")
// parseInt(number, 2).toString(16)
console.log(alice.getPrime())
prime1 = alice.getPrime().toString("hex")
console.log(new Buffer.from(prime1,'hex'));//new Buffer.from(toAscii(prime).toString(16),'hex'))

console.log(alice.getGenerator())
console.log("/////////////////////////////////////////////");
// console.log(key.toString("hex"));
// console.log(key.toString("Ascii"));
// console.log(key.toString("UTF-8"));
// console.log(parseInt(key,'2'));
// console.log(key)
// console.log("======================================================")
// console.log(alice.getPrime());
// let buf1 = web3.utils.bytesToHex(alice.getPublicKey())
// console.log(buf1)
// console.log(new Buffer.from(buf1))
//
// let v = "1000";
// console.log(typeof parseInt(v,10))
//
// console.log(parseInt(v,10))

let byte =[56, 58]
console.log(byte)

let buf = new Buffer.from(byte,'hex')
let send = web3.utils.bytesToHex(buf)
console.log(send)

let rev = web3.utils.hexToBytes(send)
console.log(rev)

function StrToBytes(str) {
    let res = []
    return res
}
let l = ['aa', 'basd', 'caa','aab', 'mljgdhbfhffkytvurdjhgcjfg6', 'aaa', "adert"];
if (l.indexOf("mljgdhbfhffkytvurdjhgcjfg6") >= 0) {
    console.log("yassss")
}

let loi = crypto.randomBytes(3);
let loi2 = crypto.randomBytes(10);
console.log(loi)
console.log(loi2)
console.log(aliceSecret)
console.log(OTP(loi,loi2))
console.log(OTP(aliceSecret,OTP(loi,loi2)))

console.log("***************************************************")


let bufffff = crypto.randomBytes(5)
let array = [];
// for (let i = 0; i < bufffff.length ; i++) {
//     array.push()
// }
console.log(bufffff)
console.log(bufffff[0])
let number = web3.utils.hexToNumber("0xdc")
let bin = bufffff[0].toString(2)
console.log(typeof bin)
console.log(bin)



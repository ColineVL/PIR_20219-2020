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


let bufffff = new Buffer.from([52, 8, 5, 158, 16, 78, 56, 78, 106, 81, 77, 5, 6, 53, 96, 128, 192, 58, 6, 98, 1,75, 36, 82, 26, 18, 6, 54, 96, 148, 175, 158])//crypto.randomBytes(32)
let bufffff1 = new Buffer.from([51, 8, 5, 158, 16, 78, 56, 78, 106, 81, 77, 5, 6, 53, 96, 128, 192, 58, 6, 98, 1,75, 36, 82, 26, 18, 6, 54, 96, 148, 175, 158])//crypto.randomBytes(32)
let bufffff2 = new Buffer.from([51, 8, 6, 158, 16, 78, 56, 78, 106, 81, 77, 5, 6, 53, 96, 128, 192, 58, 6, 98, 1,75, 36, 82, 26, 18, 6, 54, 96, 148, 175, 158])//crypto.randomBytes(32)



function pseudoRandomGenerator(seedK, keyLength){

    let seedKey = seedK;

    function RNG(seed) {
        // LCG using GCC's constants
        this.m = seedKey;//0x800000; // keySeed // 2**31;
        this.a = 1103315245;
        this.c = 12446;

        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }
    RNG.prototype.nextInt = function() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }
    RNG.prototype.nextFloat = function() {
        // returns in range [0,1]
        return this.nextInt() / (this.m - 1);
    }
    RNG.prototype.nextRange = function(start, end) {
        // returns in range [start, end): including start, excluding end
        // can't modulu nextInt because of weak randomness in lower bits
        let rangeSize = end - start;
        let randomUnder1 = this.nextInt() / this.m;
        return start + Math.floor(randomUnder1 * rangeSize);
    }
    RNG.prototype.choice = function(array) {
        return array[this.nextRange(0, array.length)];
    }

    let rng = new RNG(30);
    // for (let i = 0; i < 10; i++)
    //     console.log(rng.nextRange(10, 50));

    let digits = new Array(256);
    for(let i = 0; i < digits.length; i++){
        digits[i]=i;
    }

    let array = new Uint8Array(keyLength);

    for (let i = 0; i < keyLength; i++)
        array[i]=rng.choice(digits);

    return new Buffer.from(array);
}

function pseudoRandomSlicer(buffer){
    let buff1 = buffer.slice(0,8);
    let buff2 = buffer.slice(8,16);
    let buff3 = buffer.slice(16,24);
    let buff4 = buffer.slice(24,32);

    let Key1 = new Buffer.from(pseudoRandomGenerator(web3.utils.bytesToHex(buff1),13));
    let Key2 = new Buffer.from(pseudoRandomGenerator(web3.utils.bytesToHex(buff2),13));
    let Key3 = new Buffer.from(pseudoRandomGenerator(web3.utils.bytesToHex(buff3),13));
    let Key4 = new Buffer.from(pseudoRandomGenerator(web3.utils.bytesToHex(buff4),13));

    return Buffer.concat([Key1,Key2,Key3,Key4]).slice(3,52)
}

console.log("seed :")
console.log(bufffff)
console.log(bufffff.length)
let keedpseudo = pseudoRandomGenerator(web3.utils.bytesToHex(bufffff),59).slice(10)
console.log("Key :")
console.log(keedpseudo)
let keedpseudo1 = pseudoRandomGenerator(web3.utils.bytesToHex(bufffff1),59).slice(10)
console.log("Key :")
console.log(keedpseudo1)
let keedpseudo2 = pseudoRandomGenerator(web3.utils.bytesToHex(bufffff2),59).slice(10)
console.log("Key :")
console.log(keedpseudo2)
console.log(keedpseudo.length)
console.log("........................................................")
let TLE = "0x31e42ae210c0001047222c046868000bf34000080a8ff302cc"
console.log(TLE)
console.log(typeof TLE)

console.log(new Buffer.from(TLE,'hex'))


let myTLE = "ISS (ZARYA)             \n" +
    "1 25544U 98067A   15072.49481260  .00015160  00000-0  22746-3 0  9996\n" +
    "2 25544  51.6455 202.0211 0009011  96.7253 350.6362 15.55088493933142";

// var satOpts = {
//     map: map,
//     tle: TLE,
//     pathLength: 2,
// };
// var myMap = new google.maps.Map(...);
// var myTLE = new orbits.TLE(tle_text);
var mySat = new orbits.Satellite({ map: myMap, tle: myTLE});




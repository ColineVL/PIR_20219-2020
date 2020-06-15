const crypto = require('crypto');
const assert = require('assert');

// Generate Alice's keys...
const alice = crypto.createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

console.log(bobKey.length)
console.log(bobSecret.toString('hex').length)
console.log(toBinary(bobSecret.toString('hex')).length);

///////////////////////////////////////////////////////
function toBinary(input) {
    var result = "";
    for (var i = 0; i < input.length; i++) {
        var bin = input[i].charCodeAt().toString(2);
        result += Array(8 - bin.length + 1).join("0") + bin;
    }
    return result;
}

function toAscii(input) {
    var result = "";
    var arr = input.match(/.{1,8}/g);
    for (var i = 0; i < arr.length; i++) {
        result += String.fromCharCode(parseInt(arr[i], 2).toString(10));
    }
    return result;
}
function OTP(key, message) {
    var res = "";
    for (let i = 0; i < message.length ; i++) {
        res += key[i] ^ message[i];
    }
    return res;
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


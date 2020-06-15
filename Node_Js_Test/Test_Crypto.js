const crypto = require('crypto');
const assert = require('assert');

// Generate Alice's keys...
const alice = crypto.createDiffieHellman(1024);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

console.log(bobSecret.toString());
// // OK
// // console.log(assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex')));
//
//
// /////////////////////////////////////:
// // Defining key
// const key = crypto.randomBytes(32);
//
// // Defining iv
// const iv = crypto.randomBytes(16);
// const iv2 = crypto.randomBytes(16);
//
// // An encrypt function
// function encrypt(text) {
//     // Creating Cipheriv with its parameter
//     let cipher = crypto.createCipheriv(
//         'aes-256-cbc', Buffer.from(key), iv);
//     // Updating text
//     let encrypted = cipher.update(text);
//     // Using concatenation
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     // Returning iv and encrypted data
//     return { iv: iv.toString('hex'),
//         encryptedData: encrypted.toString('hex') };
// }
// // A decrypt function
// function decrypt(text) {
//
//     let iv = Buffer.from(text.iv, 'hex');
//     let encryptedText =
//         Buffer.from(text.encryptedData, 'hex');
//
//     // Creating Decipher
//     let decipher = crypto.createDecipheriv(
//         'aes-256-cbc', Buffer.from(key), iv);
//
//     // Updating encrypted text
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//
//     // returns data after decryption
//     return decrypted.toString();
// }
//
// // Displays output
// var output = encrypt("GeeksforGeeks");
// console.log(output);
// var de = decrypt(output);
// console.log(de);

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

function slice(input) {

}
let message = "This is a simple test. 2.5.2" ;
let m_bin = toBinary(message);
console.log(message);
console.log(m_bin.length);

let OTPKey = toBinary(bobSecret.toString());

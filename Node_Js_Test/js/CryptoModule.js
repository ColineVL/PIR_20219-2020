const crypto = require('crypto');

function toBinary(input) {
    var result = "";
    for (var i = 0; i < input.length; i++) {
        var bin = input[i].charCodeAt().toString(2);
        result += Array(8 - bin.length + 1).join("0") + bin;
    }
    return result;
}

module.exports = {
    toBinary: function(input) {
        var result = "";
        for (var i = 0; i < input.length; i++) {
            var bin = input[i].charCodeAt().toString(2);
            result += Array(8 - bin.length + 1).join("0") + bin;
        }
        return result;
    },

    toAscii: function(input) {
        var result = "";
        var arr = input.match(/.{1,8}/g);
        for (var i = 0; i < arr.length; i++) {
            result += String.fromCharCode(parseInt(arr[i], 2).toString(10));
        }
        return result;
    },
    OTP: function(key, message) {
        var res = "";
        for (let i = 0; i < message.length ; i++) {
            res += key[i] ^ message[i];
        }
        return res;
    },
    DiffieHellmanGenerate : function(int) {
        const DH = crypto.createDiffieHellman(int);
        return DH;
    },
    DiffieHellmanGetPublicKey : function(DH) {
        const key = DH.generateKeys();
        const k_int = parseInt(toBinary(key.toString('hex')),2);
        return k_int;
    },
    DiffieHellmanComputeSecret : function(DH,key) {
        const secret = DH.generateKeys(key);
        return secret;
    },

    GetAvailableRefs: function (contractws, endTime, priceMax, provider) {
        const result = [];
        endTime = endTime || 0; //TODO Talk about endtime

        return result;
    },

}

// event NewDataReference(uint referenceId, address provider, uint price, uint contractEndTime);
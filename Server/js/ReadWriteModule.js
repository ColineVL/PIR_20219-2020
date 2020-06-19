const fs = require('fs');


var DiffieSchema = { // Schema for storing Diffie-H keys
    PubDH:   "", // Public key of Diffie-h
    PrivDH: "", // Private key of Diffie-h
    Pub_Other: "", // Public key of other individual
};

module.exports = {
    // GetAvailableRefs: async function (contractws, endTime, priceMax, provider) {
    Read: async function (path) {
        let res = await fs.readFileSync(path,function(err,data) {})
        return res;
    },
    Write: async function(name, data){
        await fs.writeFile( name,data, function(err) {
            if (err) {
                return console.log(err);
            }
        })
        return 0;
    },
    ReadAsObjectDH : async function (path) {
        let res = await fs.readFileSync(path,function(err,data) {})
        let res_obj = JSON.parse(res);
        const Diffie = Object.create(DiffieSchema);

        Diffie.PrivDH = new Buffer.from(res_obj.PrivDH.data,'hex');
        Diffie.PubDH = new Buffer.from(res_obj.PubDH.data,'hex');

        return Diffie;
    },
}
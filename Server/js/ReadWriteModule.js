const fs = require('fs');


var DiffieSchema = { // Schema for storing Diffie-H keys
    PubDH:   "", // Public key of Diffie-h
    PrivDH: "", // Private key of Diffie-h
    Pub_Other: "", // Public key of other individual
};
var Reference_SellerSchema = { // Schema for storing reference information for a Seller (keys and messages.)
    K2: "", // Appropriate K2 for a client
    hash:  "",     // hash expected
};
var Seller_InfoSchema = { // Schema for storing reference information for a Seller (keys and messages.)
    K: "", // Primary key used to encrypt the info
};
var Reference_ClientSchema = { // Schema for storing reference information for a Client (keys and messages.)
    KxorK2 :   "", // KxorK2 provided by the seller
    K2: "", // K2 provided later by the seller
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
    WriteAsRefSeller : async function (path, hash, K2) {
        const RefSeller = Object.create(Reference_SellerSchema);
        RefSeller.hash =hash;
        RefSeller.K2 = K2;
        await fs.writeFile(path, JSON.stringify(RefSeller), function(err) {
            if (err) {console.log(err)} // TODO maybe do something here for error
        })
        return 0;
    },
    WriteAsSellerInfo : async function (path, K) {
        const RefSeller = Object.create(Seller_InfoSchema);
        RefSeller.K = K;
        await fs.writeFile(path, JSON.stringify(RefSeller), function(err) {
            if (err) {console.log(err)} // TODO maybe do something here for error
        })
        return 0;
    },
    WriteAsRefBuyer : async function (path, KxorK2) {
        const RefBuyer = Object.create(Reference_ClientSchema );
        RefBuyer.KxorK2 = KxorK2;
        await fs.writeFile(path, JSON.stringify(RefBuyer), function(err) {
            if (err) {console.log(err)} // TODO maybe do something here for error
        })
        return 0;
    },
    ReadAsObjectRefSeller : async function (path) {
        let res = await fs.readFileSync(path,function(err,data) {})
        let res_obj = JSON.parse(res);
        const Ref = Object.create(Reference_SellerSchema);

        Ref.hash = res_obj.hash;
        Ref.K2 = new Buffer.from(res_obj.K2.data,'hex');
        return Ref;
    },
}
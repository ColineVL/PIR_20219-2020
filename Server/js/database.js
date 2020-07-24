/********************************
 * Defining Database N.B : will destruct if server is closed...
 ********************************/
let DiffieSchema = { // Schema for storing Diffie-H keys
    refId: "", // Id of the reference for which this applies
    PubDH: "", // Public key of Diffie-h
    PrivDH: "", // Private key of Diffie-h
    Pub_Other: "", // Public key of other individual
};

module.exports = {
    newDiffieSchema: function () {
        return Object.create(DiffieSchema);
    },
};

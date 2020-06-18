const fs = require('fs');


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
    }
}
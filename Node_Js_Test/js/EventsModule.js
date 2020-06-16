

module.exports = {
    GetAvailableRefs: async function (contractws, endTime, priceMax, provider) {
        let res = [];
        endTime = endTime || 0; //TODO Talk about endtime
        priceMax =priceMax || 0;
        const options = {
            fromBlock: 0,
            filter: {price: [0,priceMax], contractEndTime: [0,endTime]}
        }
        let res1 = await contractws.getPastEvents("NewDataReference", {
            fromBlock: 0,
            toBlock: 'latest'
        }, function(error, events){ }) // TODO Eventually do something here
        console.log(res1)
        return res1;
    },

}

// event NewDataReference(uint referenceId, address provider, uint price, uint contractEndTime);
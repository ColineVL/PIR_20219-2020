

module.exports = {
    GetAvailableRefs: async function (contractws, endTime, priceMax, provider) {
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
        return res1;
    },
    GetRef: async function (contractws, refId) {
        console.log(refId)
        let res1 = await contractws.getPastEvents("NewDataReference", {
            filter : {referenceId: refId},
            fromBlock: 0,
            toBlock: 'latest'
        }, function(error, events){ }) // TODO Eventually do something here
        return res1;
    },

}

// event NewDataReference(uint referenceId, address provider, uint price, uint contractEndTime);
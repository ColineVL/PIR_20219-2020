module.exports = {
    GetAvailableRefs: async function (contractws, endTime, priceMax, provider) {
        const result = [];
        endTime = endTime || 0; //TODO Talk about endtime
        priceMax =priceMax || 0;
        const options = {
            fromBlock: 0,
            filter: {price: [0,priceMax], contractEndTime: [0,endTime]}
        }
        contractws.events.NewDataReference({options})
        .on('data', function(event){
            result.push(event);
        })
        .on('changed', function(event){
            // remove event from local database
        })
        .on('error', console.error);
        return result;
    },

}

// event NewDataReference(uint referenceId, address provider, uint price, uint contractEndTime);
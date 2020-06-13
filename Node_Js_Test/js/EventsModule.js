module.exports = {
    GetAvailableRefs: async function (contractws, endTime, priceMax, provider) {
        const result = [];
        endTime = endTime || 0; //TODO Talk about endtime
        priceMax =priceMax || 0;
        provider = provider || "*";
        const options = {
            fromBlock: 0,
            filter: {price: [0,priceMax], provider: provider, contractEndTime: [0,ontractEndTime]}
        }
        contractws.events.NewDataReference({options}, function(error, event){ console.log("**********" + event); })
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
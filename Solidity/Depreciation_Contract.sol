pragma solidity ^0.4.0;


contract Depreciation_Contract {
// CHECK ALL TYPES and PUBLIC STUFF
    uint32 dataId = 0;

    struct DataReference{ // Contains reference ANd price
        uint32 dataId;
        uint32 price;
        uint64 dataKey; //Take care of hackers
        uint64 contractDeploymentTime;
        uint64 contractDuration;
        address[] clients;
        address provider;
    }

    DataReference[] dataReferences;

    //Code Views
    //Code setters

    //bl constructor ta3 reference, ejbare na3te price,  wl duration w time

    //function createDataReference
    //function setKey \\Only owner
    //function verifyKey
    //function settlePayment
    //function buyReference // payable
}

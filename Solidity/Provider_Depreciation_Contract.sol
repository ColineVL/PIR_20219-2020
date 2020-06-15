// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

import "./Client_Depreciation_Contract.sol";

contract Provider_Depreciation_Contract is Client_Depreciation_Contract {

    event NewDataReference(uint referenceId, address provider, uint price, uint contractEndTime, uint publicKey);

    //function createDataReference
    function createDataReference (uint _price, uint _contractEndTime, uint _publicKey) public {
        // Creating new data reference

        DataReference memory newReference;

        newReference.referenceId = referenceIdCounter;

        // convert price to ether
        newReference.price = 0 ether;

        // setting price in ether. Provider won't be able to change it later.
        newReference.price = _price;

        newReference.contractEndTime=_contractEndTime;

        newReference.provider = msg.sender;

        // Adding reference to the blockchain's storage
        dataReferences.push(newReference);

        emit NewDataReference(referenceIdCounter, msg.sender, _price, _contractEndTime, _publicKey);

        // !!!!!!!!!!!!! Maybe we will not use data ID counter also use SafeMath to add the counter
        referenceIdCounter = referenceIdCounter.add(1);

    }

    // Give access to the provider only
    modifier onlyProvider(uint _referenceId) {
        require(msg.sender == dataReferences[_referenceId].provider);
        _;
    }

    function withdrawFunds(uint _referenceId) onlyProvider(_referenceId) external{
        // Checks if provider hasn't already withdrawn money
        require(dataReferences[_referenceId].withdrawnFunds == false);

        // Checks if the provider has waited for the time limit for clients to set a dispute
        require(now > dataReferences[_referenceId].contractEndTime + 5 days);

        // Checks that provider gave key
        require(dataReferences[_referenceId].referenceKey != 0);

        // Number of undisputed clients
        uint _undisputedClients = (dataReferences[_referenceId].clients.length).sub(dataReferences[_referenceId].clientsDispute);
        // Calculating the total funds that can be withdrawn
        uint funds = dataReferences[_referenceId].price.mul(_undisputedClients);
        // Sending funds
        dataReferences[_referenceId].withdrawnFunds = true;
        (msg.sender).transfer(funds);
    }

}

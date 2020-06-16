// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

import "./Client_Depreciation_Contract.sol";

contract Provider_Depreciation_Contract is Client_Depreciation_Contract {

    event NewDataReference(uint referenceId, address provider, uint price, uint contractEndTime, uint publicKey);

    //function createDataReference
    function createDataReference(uint _price, uint _contractEndTime, uint _publicKey) public {
        // Creating new data reference

        DataReference memory newReference;

        newReference.referenceId = referenceIdCounter;

        // convert price to ether
        newReference.price = 0 ether;

        // setting price in ether. Provider won't be able to change it later.
        newReference.price = _price;

        newReference.contractEndTime = _contractEndTime;

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

    function withdrawFunds(uint _referenceId) onlyProvider(_referenceId) external {
        // Checks if provider hasn't already withdrawn money
        require(dataReferences[_referenceId].withdrawnFunds == false);

        // Checks if the provider has waited for the time limit for clients to set a dispute
        require(now > dataReferences[_referenceId].contractEndTime + 5 days);

        // Checks that provider gave a key
        require(dataReferences[_referenceId].referenceKey != 0);

        // Number of undisputed clients
        uint _undisputedClients = (dataReferences[_referenceId].clients.length).sub(dataReferences[_referenceId].clientDisputes);
        // Calculating the total funds that can be withdrawn
        uint funds = dataReferences[_referenceId].price.mul(_undisputedClients);
        // Sending funds
        dataReferences[_referenceId].withdrawnFunds = true;
        (msg.sender).transfer(funds);
    }

    function getClients(uint _referenceId) onlyProvider(_referenceId) external view returns (address[] memory){
        return dataReferences[_referenceId].clients;
    }

    /*
    ---------------------------------------------
    Provider dispute functions
    ---------------------------------------------
    */

    function getClientDisputes(uint _referenceId) onlyProvider(_referenceId) view external
    returns (address[] memory, bool[] memory) {

        uint numberOfDisputes = dataReferences[_referenceId].clientDisputes;

        // Initializing the tables
        address[] memory clientDisputes = new address[](numberOfDisputes);
        bool[] memory resolvedStatus = new bool[](numberOfDisputes);

        // Just to be used for for loop
        address client;

        for (uint i = 0; i < dataReferences[_referenceId].clients.length; i++) {

            client = dataReferences[_referenceId].clients[i];

            // If condition that checks that the client Id has a dispute
            if (dataReferences[_referenceId].raisedDispute[client]) {
                clientDisputes[i] = client;
                resolvedStatus[i] = dataReferences[_referenceId].resolvedDispute[client];
            }
        }
        return (clientDisputes, resolvedStatus);
    }


    event settledDispute(uint referenceId, address winner, address loser, uint funds);

    function settleDispute(uint _referenceId, address payable client) onlyProvider(_referenceId) payable external {
        require(msg.value == disputePrice);
        // Checks that the client raised a dispute so that the provider won't pay for no reason
        require(dataReferences[_referenceId].raisedDispute[client] == true);
        // Checks that provider didn't already set the dispute so he does not withdraw same funds many times
        require(dataReferences[_referenceId].resolvedDispute[client] == false);
        dataReferences[_referenceId].resolvedDispute[client] = true;

        // Total funds to be transferred to the rightful owner
        uint funds = dataReferences[_referenceId].price + (disputePrice * 2);

        // Computes the hashes of the encrypted key given by the provider
        bytes32 checkEncryptedKeyHash = keccak256(abi.encodePacked(
                dataReferences[_referenceId].referenceKey ^ dataReferences[_referenceId].keyDecoder[client]));

        if(checkEncryptedKeyHash == dataReferences[_referenceId].encryptedKeyHash[client]){
            // Sends funds to the provider
            (msg.sender).transfer(funds);
            emit settledDispute(_referenceId, msg.sender, client, funds);
        }
        else{
            // Sends funds to the client
            client.transfer(funds);
            emit settledDispute(_referenceId, client, msg.sender, funds);
        }

    }

}
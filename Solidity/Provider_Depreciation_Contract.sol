// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

import "./Client_Depreciation_Contract.sol";

contract Provider_Depreciation_Contract is Client_Depreciation_Contract {

    event NewDataReference(
        uint indexed referenceId,
        address indexed provider,
        uint price,
        uint contractEndTime,
        bytes32 publicKeyDH,
        string description);

    //function createDataReference
    function createDataReference(uint _price,
        uint _contractEndTime,
        bytes32 _publicKeyDH,
        string memory _description) public {
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

        emit NewDataReference(referenceIdCounter, msg.sender, _price, _contractEndTime, _publicKeyDH, _description);

        // !!!!!!!!!!!!! Maybe we will not use data ID counter also use SafeMath to add the counter
        referenceIdCounter = referenceIdCounter.add(1);

    }

    // Give access to the provider only
    modifier onlyProvider(uint _referenceId) {
        require(msg.sender == dataReferences[_referenceId].provider);
        _;
    }

    event encryptedEncodedKeyEvent(
        uint indexed referenceId,
        address indexed client,
        bytes32 encryptedEncodedKey
    );

    // Needed to send privately encoded Key (K^K2^K3)
    function setEncryptedEncodedKey(
        uint _referenceId,
        address _client,
        bytes32 _encryptedEncodedKey) onlyProvider(_referenceId) external {

        emit encryptedEncodedKeyEvent(_referenceId, _client, _encryptedEncodedKey);
    }

    function withdrawFunds(uint _referenceId) onlyProvider(_referenceId) external {
        // Checks if provider hasn't already withdrawn money
        require(dataReferences[_referenceId].withdrawnFunds == false);

        // Checks if the provider has waited for the time limit for clients to set a dispute
        require(now > dataReferences[_referenceId].contractEndTime + 5 days);

        // Checks that provider gave a key
        require(dataReferences[_referenceId].referenceKey != 0);

        // Number of undisputed clients
        uint _undisputedClients = (dataReferences[_referenceId].clients.length)
        .sub(dataReferences[_referenceId].clientDisputes);
        // Calculating the total funds that can be withdrawn
        uint funds = dataReferences[_referenceId].price.mul(_undisputedClients);
        // Sending funds
        dataReferences[_referenceId].withdrawnFunds = true;
        (msg.sender).transfer(funds);
    }

    event referenceKey(uint indexed referenceId, uint referenceKey);

    function setReferenceKey(uint _referenceId, uint _referenceKey) onlyProvider(_referenceId) external {
        // The key once set cannot be modified to avoid scams
        if (dataReferences[_referenceId].referenceKey != 0) {
            dataReferences[_referenceId].referenceKey = _referenceKey;
            emit referenceKey(_referenceId, _referenceKey);
        }
    }

    event keyDecoder(uint indexed referenceId, address indexed client, uint keyDecoder);

    function setKeyDecoder(uint _referenceId, address _client, uint _keyDecoder) onlyProvider(_referenceId) external {
        // The key once set cannot be modified to avoid scams
        if (dataReferences[_referenceId].keyDecoder[_client] != 0) {
            dataReferences[_referenceId].keyDecoder[_client] = _keyDecoder;
            emit keyDecoder(_referenceId, _client, _keyDecoder);
        }
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


    event settleDisputeEvent(
        uint indexed referenceId,
        address indexed winner,
        address indexed loser,
        uint funds);

    function settleDispute(uint _referenceId, address payable _client) onlyProvider(_referenceId) payable external {
        require(msg.value == disputePrice);
        // Checks that the client raised a dispute so that the provider won't pay for no reason
        require(dataReferences[_referenceId].raisedDispute[_client] == true);
        // Checks that provider didn't already set the dispute so he does not withdraw same funds many times
        require(dataReferences[_referenceId].resolvedDispute[_client] == false);
        dataReferences[_referenceId].resolvedDispute[_client] = true;

        // Total funds to be transferred to the rightful owner
        uint funds = dataReferences[_referenceId].price + (disputePrice * 2);

        // Computes the hashes of the encrypted key given by the provider
        bytes32 checkEncryptedKeyHash = keccak256(abi.encodePacked(
                dataReferences[_referenceId].referenceKey ^ dataReferences[_referenceId].keyDecoder[_client]));

        if (checkEncryptedKeyHash == dataReferences[_referenceId].encryptedKeyHash[_client]) {
            // Sends funds to the provider
            (msg.sender).transfer(funds);
            emit settleDisputeEvent(_referenceId, msg.sender, _client, funds);
        }
        else {
            // Sends funds to the client
            _client.transfer(funds);
            emit settleDisputeEvent(_referenceId, _client, msg.sender, funds);
        }

    }

}

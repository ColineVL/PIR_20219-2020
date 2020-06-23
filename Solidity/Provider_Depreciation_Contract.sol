// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

import "./Client_Depreciation_Contract.sol";

contract Provider_Depreciation_Contract is Client_Depreciation_Contract {

    event newDataReference(
        uint indexed referenceId,
        address indexed provider,
        uint initialPrice,
        uint insuranceDeposit,
        uint128 minimumData,
        uint128 deployTime,
        uint128 endTime,
        bytes32 publicKeyDH,
        uint8 depreciationType,
        string description);

    //function createDataReference
    function createDataReference(uint _initialPrice,
        uint128 _minimumData,
        uint128 _referenceDuration,
        bytes32 _publicKeyDH,
        uint8 _depreciationType,
        string memory _description) payable public {


        /*
            Creating data reference object and inserting data
        */

        DataReference memory newReference;

        // Sets price and depreciation. Provider won't be able to change it later.
        newReference.initialPrice = _initialPrice;
        newReference.insuranceDeposit = msg.value;
        newReference.withdrawableFunds = msg.value;
        newReference.minimumData = _minimumData;
        newReference.depreciationType = _depreciationType;
        newReference.deployTime = uint128(now);
        newReference.endTime = _referenceDuration + uint128(now);
        // To avoid overflow and any malicious attempts to withdraw money when not supposed
        require(newReference.endTime > uint128(now));

        newReference.provider = msg.sender;

        // Adding reference to the blockchain's storage
        dataReferences.push(newReference);

        emit newDataReference(
            dataReferences.length - 1,
            msg.sender,
            _initialPrice,
            msg.value,
            _minimumData,
            uint128(now),
            newReference.endTime,
            _publicKeyDH,
            _depreciationType,
            _description);
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

        // Checks if the provider has waited for the time limit for clients to set a dispute
        require(now > dataReferences[_referenceId].endTime + 5 days);

        // Checks that provider gave a key
        require(dataReferences[_referenceId].referenceKey != 0);

        // Calculating the total funds that can be withdrawn
        uint funds = dataReferences[_referenceId].withdrawableFunds;
        dataReferences[_referenceId].withdrawableFunds = 0;

        (msg.sender).transfer(funds);
    }

    event referenceKey(uint indexed referenceId, bytes32 referenceKey);

    function setReferenceKey(uint _referenceId, bytes32 _referenceKey) onlyProvider(_referenceId) external {

        // The key once set cannot be modified to avoid scams
        if (dataReferences[_referenceId].referenceKey == 0) {
            dataReferences[_referenceId].referenceKey = _referenceKey;
            emit referenceKey(_referenceId, _referenceKey);
        }
    }

    event keyDecoder(uint indexed referenceId, address indexed client, bytes32 keyDecoder);

    function setKeyDecoder(uint _referenceId, address _client, bytes32 _keyDecoder) onlyProvider(_referenceId) external {

        // Condition necessary so that the provider does not provide a key decoder if the client removed his funds
        if (dataReferences[_referenceId].clientFunds[_client] > 0) {

            // The key once set cannot be modified to avoid scams
            if (dataReferences[_referenceId].keyDecoder[_client] == 0) {
                dataReferences[_referenceId].keyDecoder[_client] = _keyDecoder;
                dataReferences[_referenceId].completedClients ++;
                emit keyDecoder(_referenceId, _client, _keyDecoder);
            }
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
    returns (address[] memory) {

        uint numberOfDisputes = dataReferences[_referenceId].numberOfDisputes;

        // Initializing the tables
        address[] memory clientDisputes = new address[](numberOfDisputes);

        // Just to be used for for loop
        address client;

        for (uint i = 0; i < dataReferences[_referenceId].clients.length; i++) {

            client = dataReferences[_referenceId].clients[i];

            // If condition that checks that the client Id has claimed his funds (raised a dispute)
            if (dataReferences[_referenceId].clientFunds[client] == 0) {
                clientDisputes[i] = client;
            }
        }
        return (clientDisputes);
    }


}

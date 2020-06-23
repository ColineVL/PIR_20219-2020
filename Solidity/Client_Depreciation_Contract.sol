// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

import "./Depreciation_Contract.sol";

contract Client_Depreciation_Contract is Depreciation_Contract {


    // Checks if the msg.sender bought the referenceId
    modifier isClient(uint _referenceId) {
        require(dataReferences[_referenceId].isClient[msg.sender] == true);
        _;
    }

    modifier isPayed(uint _referenceId) {
        // Checks that the provider did not publish the reference key already
        require(dataReferences[_referenceId].referenceKey == 0);
        // Checks that the contract time did not end
        require(now < dataReferences[_referenceId].endTime);

        uint _price = getReferenceCurrentPrice(_referenceId);
        // The ether sent must be bigger to the current price but not higher than the initial one to avoid paying more
        require(msg.value >= _price);
        require(msg.value <= dataReferences[_referenceId].initialPrice);
        _;
    }


    /*
    ---------------------------------------------
    Client buy mechanism functions
    ---------------------------------------------
    */

    event NewClient(
        uint indexed referenceId,
        address indexed client,
        uint fund,
        bytes32 publicKeyDH);

    function buyReference(uint _referenceId, bytes32 _publicKeyDH) isPayed(_referenceId) payable external {
        // Checks if referenceId is valid
        // !!!!!!!!!!!! Check if < or <= Maybe remove line if it will automatically give index out of bound
        require(_referenceId <= dataReferences.length);

        // Checks that client did not already buy the reference
        require(dataReferences[_referenceId].isClient[msg.sender] == false);

        // Adds clients to reference list
        dataReferences[_referenceId].clients.push(msg.sender);
        dataReferences[_referenceId].isClient[msg.sender] = true;

        dataReferences[_referenceId].clientFunds[msg.sender] = msg.value;
        dataReferences[_referenceId].withdrawableFunds += msg.value;

        emit NewClient(_referenceId, msg.sender, msg.value, _publicKeyDH);
    }

    event encryptedKeyHash(
        uint indexed referenceId,
        address indexed client,
        bytes32 encryptedKeyHash);


    function setEncryptedHashedKey(uint _referenceId, bytes32 _encryptedKeyHash) external isClient(_referenceId) {

        /*
        Condition to allow the client to provide once the hash of the encrypted key
        Necessary to avoid confusion for the provider or changing the value after the provider has posted the decoder
        */

        if (dataReferences[_referenceId].encryptedKeyHash[msg.sender] == 0) {
            dataReferences[_referenceId].encryptedKeyHash[msg.sender] == _encryptedKeyHash;
        }

        emit encryptedKeyHash(_referenceId, msg.sender, _encryptedKeyHash);

    }

    function getKeyDecoder(uint _referenceKey) isClient(_referenceKey) view external returns (bytes32){
        return dataReferences[_referenceKey].keyDecoder[msg.sender];
    }

    /*
    ---------------------------------------------
    Client dispute functions
    ---------------------------------------------
    */

    event withdrawRefund(
        uint indexed referenceId,
        address indexed client,
        uint funds,
        uint time);

    // !!!!!!!!!!!!!!!!!!!!!!!!!!! Needs comments
    function withdrawDisputeFunds(uint _referenceId, uint funds) internal {
        // Cannot withdraw more than the available funds
        require(dataReferences[_referenceId].withdrawableFunds >= funds);
        // Needed for the view getClientDisputes function
        dataReferences[_referenceId].numberOfDisputes ++;
        // Needed to prevent multiple raising disputes for one client
        dataReferences[_referenceId].clientFunds[msg.sender] = 0;
        // Provider cannot withdraw the disputed funds anymore
        dataReferences[_referenceId].withdrawableFunds -= funds;
        // Funds sent back to the client
        (msg.sender).transfer(funds);

        emit withdrawRefund(_referenceId, msg.sender, funds, now);
    }


    function raiseDispute(uint _referenceId) external isClient(_referenceId) {

        uint funds = dataReferences[_referenceId].clientFunds[msg.sender];

        /*
            Checks if client hasn't already withdrew his funds.
            This is needed so he does not withdraw redeemFunds multiple times
        */

        require(funds > 0);

        // Checks if provider hasn't already withdrew funds
        require(dataReferences[_referenceId].withdrawableFunds >= funds);

        // !!!!!!!!!!!!!!!!!!!!!!!!!! Add comments
        if (dataReferences[_referenceId].keyDecoder[msg.sender] == 0) {
            withdrawDisputeFunds(_referenceId, funds);
        }

        else if (dataReferences[_referenceId].referenceKey != 0) {

            bytes32 _xor = dataReferences[_referenceId].referenceKey ^ dataReferences[_referenceId].keyDecoder[msg.sender];

            // Condition comparing the hashes of encoded keys to determine if the right key was given
            if (keccak256(abi.encode(_xor)) != dataReferences[_referenceId].encryptedKeyHash[msg.sender]) {
                funds = funds.add((dataReferences[_referenceId].redeemFunds/dataReferences[_referenceId].completedClients));
                withdrawDisputeFunds(_referenceId, funds);
            }

            // Condition for number of data
            else if (dataReferences[_referenceId].numberOfData < dataReferences[_referenceId].minimumData){
                funds = funds.add((dataReferences[_referenceId].redeemFunds/dataReferences[_referenceId].completedClients));
                withdrawDisputeFunds(_referenceId, funds);
            }

        }

        // Equivalent to: now > contract end time AND client received keyDecoder (hash is correct) AND referenceKey was never published
        else if (now > dataReferences[_referenceId].endTime) {
            withdrawDisputeFunds(_referenceId, funds);
        }
    }


}

// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

import "./Depreciation_Contract.sol";

contract Client_Depreciation_Contract is Depreciation_Contract {


    // Checks if the msg.sender bought the referenceId
    modifier isClient(uint _referenceId) {
        require(dataReferences[_referenceId].isClient[msg.sender] == true);
        _;
    }

    /*
    ---------------------------------------------
    Client buy mechanism functions
    ---------------------------------------------
    */

    event NewClient(uint referenceId, address client);

    function buy_reference(uint _referenceId) payable external {
        // Checks if referenceId is valid
        // !!!!!!!!!!!! Check if < or <= Maybe remove line if it will automatically give index out of bound
        require(_referenceId <= dataReferences.length);

        // Checks if the client's ether corresponds to the set price
        require(msg.value == dataReferences[_referenceId].price);

        // Checks that client did not already buy reference
        require(dataReferences[_referenceId].isClient[msg.sender] == false);

        // Adds clients to reference list
        dataReferences[_referenceId].clients.push(msg.sender);
        dataReferences[_referenceId].isClient[msg.sender] = true;

        emit NewClient(_referenceId, msg.sender);
    }

    event encryptedKeyHash(uint referenceId, address client, bytes32 encryptedKeyHash);

    function setEncryptedHashedKey(uint _referenceId, bytes32 _encryptedKeyHash) external isClient {

        /*
        Condition to allow the client to provide once the hash of the encrypted key
        Necessary to avoid confusion for the provider or changing the value after the provider has posted the decoder
        */

        if (dataReferences[msg.sender].encryptedKeyHash == 0) {
            dataReferences[msg.sender].encryptedKeyHash == _encryptedKeyHash;
        }

        emit encryptedKeyHash(_referenceId, msg.sender, _encryptedKeyHash);

    }

    /*
    ---------------------------------------------
    Client dispute functions
    ---------------------------------------------
    */


    event raiseDispute(uint referenceId, address client, uint time);

    function raiseDispute(uint _referenceId) payable external isClient {

        // Checks if the dispute fee is payed
        require(msg.value == disputePrice);

        // Checks if dispute was not already raised to avoid paying twice
        // If time = 0 it means time was never set, thus dispute never set
        require(dataReferences[_referenceId].timeOfDispute[msg.sender] == 0);
        dataReferences[_referenceId].timeOfDispute[msg.sender] = now;

        // Sets true to avoid raising same dispute may times and paying more than once
        dataReferences[_referenceId].raisedDispute[msg.sender] = true;

        emit raiseDispute(_referenceId, msg.sender, now);
    }


    event withdrawRefund (uint referenceId, address client, uint funds);

    function withdrawDisputeFunds(uint _referenceId) external {

        // Checks if the client already paid the fees. Also handles if he is indeed a client
        require(dataReferences[_referenceId].raisedDispute[msg.sender] == true);

        // Checks if the time delay for the provider to respond is respected
        require(now > dataReferences[_referenceId].timeOfDispute + 3 days);

        // Checks if the client or provider hasn't withdrew funds
        require(dataReferences[_referenceId].resolvedDispute[msg.sender] == false);

        // Sets resolvedDispute to true to avoid withdrawing funds multiple times
        dataReferences[_referenceId].resolvedDispute[msg.sender] = true;

        // Refunding to client
        uint funds = dataReferences[_referenceId].price + this.disputePrice;
        (msg.sender).transfer(funds);

        emit withdrawRefund(_referenceId, msg.sender, funds);
    }

}

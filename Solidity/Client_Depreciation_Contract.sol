// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

import "./Depreciation_Contract.sol";

contract Client_Depreciation_Contract is Depreciation_Contract {


    event NewClient(uint referenceId, address client);

    function buy_reference(uint _referenceId) payable external {
        // Checking if referenceId is valid
        // !!!!!!!!!!!! Check if < or <= Maybe remove line if it will automatically give index out of bound
        require(_referenceId <= dataReferences.length);

        // Check if the client's ether corresponds to the set price
        require(msg.value == dataReferences[_referenceId].price);

        // Checking that client did not already buy reference
        require(dataReferences[_referenceId].isClient[msg.sender] == false);

        // Adding clients to reference list
        dataReferences[_referenceId].clients.push(msg.sender);
        dataReferences[_referenceId].isClient[msg.sender] = true;

        emit NewClient(_referenceId, msg.sender);
    }


    function setDispute(uint _referenceId) payable external returns (string memory) {
        // Checking if client already bought reference
        require(dataReferences[_referenceId].isClient[msg.sender]);

        // Checking if fee is payed
        require(msg.value == disputePrice);

        // Checking if dispute was not already raised.
        // !!!!!!!!!!!!! If time = 0 it means time was never set
        if (dataReferences[_referenceId].timeOfDispute[msg.sender] == 0)
        {
            dataReferences[_referenceId].timeOfDispute[msg.sender] = now;
            return "If the provider does not respond within 3 days you can reclaim your funds directly";
        }
        else{
            return "You already set your dispute";
        }

    }

    function setDisputeInstantly(uint _referenceId) payable external {

    }


    //    This function must be onlyClient (but needs for loop) and payable (pay fees for contesting)
    //
    //    function contestReference(uint _referenceId){
    //
    //    }


}

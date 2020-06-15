// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

// To avoid overflow
import "./node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "./node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Depreciation_Contract is Ownable{

    using SafeMath for uint256;

    // CHECK ALL TYPES and PUBLIC STUFF

    // To avoid overflow
    //    using SafeMath for uint256;
    // Import it later
    //    using SafeMath32 for uint32;

    uint referenceIdCounter = 0;

    struct DataReference{ // Contains reference ANd price
        uint referenceId;
        uint price;
        uint referenceKey; //Take care of hackers, must be long enough ... to be determined
        /*
        contractDuration is too long, it must be shortened with:
           - Changing data type with a risk not to optimize storage
           - Put require statement in createDataReference
        */

        /*
        Should not be allowed to be changed by anyone, even the owner to avoid scams and ...
        ... withholding funds for a longer time than anticipated
        */
        uint contractEndTime;

        address provider;
        // Necessary to check if the provider withdrew undisputed funds so he does not withdraw other's funds
        bool withdrawnFunds;

        /*
            Client parameters
        */

        // List of clients that bought the contract
        address[] clients;

        // Needed to track how many funds are undisputed and what can the provider withdraw
        uint clientDisputes;

        // Needed to give access for a client to call dispute function or recall funds
        mapping (address => bool) isClient;
        // Needed so a client does not raise multiple disputes so he claims his money as well as others if he is right
        mapping (address => bool) raisedDispute;
        // Needed to check if dispute is resolved or not to not claim same dispute multiple times
        mapping (address => bool) resolvedDispute;
        mapping (address => uint) timeOfDispute;
        // !!!!!!!!!! Needs to be sent in private channel
        // !!!!!!!!!! mapping (address => bytes32) encryptedKey;

        /*
            The client provides the encryptedKey's hash that would allow the provided to provider the decoding key
            Also this is used to compare this hash with the real key later provided publicly by the provider
        */
        mapping (address => bytes32) encryptedKeyHash;
        mapping (address => uint) keyDecoder;
    }


    // Public will set up getters for each (easier for web3js call/send functions)
    DataReference[] public dataReferences;

    uint internal disputePrice = 0.02 ether;

    // Gives access to the smart contract's owner to change disputePrice since ether/USD pair is not stable
    function setDisputePrice(uint _price) onlyOwner external{
        disputePrice = _price;
    }

    /*
    TODO FUNCTIONS
    Settle dispute
    */


}
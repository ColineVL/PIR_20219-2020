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

        /*
            Client parameters
        */

        // List of clients that bought the contract
        address[] clients;

        // Needed for contesting for false key or ask for a refund in case provider did not submit key
        address[] clientsDispute;

        /*
        !!!!!!!!!!!!! Check later if it is better to pack booleans in one structure (gas and storage wise)
        !!!!!!!!!!!!! Check later about public mappings
        */

        // Needed to give access for a client to call dispute function or recall funds
        mapping (address => bool) isClient;
        // Needed so a client does not raise multiple disputes so he claims his money as well as others if he is right
        mapping (address => bool) raisedDispute;
        // Needed to check if dispute is resolved or not to not claim same dispute multiple times
        mapping (address => bool) resolvedDispute;
        mapping (address => uint) timeOfDispute;
    }


    // Public will set up getters for each (easier for web3js call/send functions)
    DataReference[] public dataReferences;

    uint disputePrice = 0.02 ether;

    // Gives access to the smart contract's owner to change disputePrice since ether/USD pair is not stable
    function setDisputePrice(uint _price) onlyOwner external{
        disputePrice = _price;
    }

    /*
    ---------------------------------------------
    TODO functions
    ---------------------------------------------

    No comments for the moment

    */

    /*

    ---------------------------------------------
    Provider functions
    ---------------------------------------------
    */

    event NewDataReference(uint referenceId, address provider, uint price, uint contractEndTime);

    //function createDataReference
    function createDataReference (uint _price, uint _contractEndTime) public {
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

        emit NewDataReference(referenceIdCounter, msg.sender, _price, _contractEndTime);

        // !!!!!!!!!!!!! Maybe we will not use data ID counter also use SafeMath to add the counter
        referenceIdCounter = referenceIdCounter.add(1);

    }

    // Give access to the provider only
    modifier onlyProvider(uint _referenceId) {
        require(msg.sender == dataReferences[_referenceId].provider);
        _;
    }

    // Allows the provider to submit the data's unencrypted key for later verification
    //    function submitReferenceKey (uint32 _referenceId, uint64 _referenceKey) external onlyProvider {
    //
    //        // !!!!!!!!!!!!! check uint compatibility and casting
    //        require(time.now < contractEndTime);
    //        dataReferences[_referenceId].referenceKey = _referenceKey;
    //
    //        // Debate whether it should automatically check for every client the correctness of the _referenceKey
    //
    //        // Add pay function after key submission
    //    }


}
// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

// To avoid overflow
// import "./SafeMath.sol";

contract Depreciation_Contract {
// CHECK ALL TYPES and PUBLIC STUFF

    // To avoid overflow
//    using SafeMath for uint256;

    // Import it later
//    using SafeMath32 for uint32;

    uint32 dataIdCounter = 0;

    struct DataReference{ // Contains reference ANd price
        uint32 dataId;
        uint price;
        uint64 dataKey; //Take care of hackers, must be long enough ... to be determined
        /*
        contractDuration is too long, it must be shortened with:
           - Changing data type with a risk not to optimize storage
           - Put require statement in createDataReference
        */

        /*
        Should not be allowed to be changed by anyone, even the owner to avoid scams and ...
        ... withholding funds for a longer time than anticipated
        */
        uint64 contractEndTime;
        address[] clients;
        address provider;
    }

    DataReference[] dataReferences;

    /*
    ---------------------------------------------
    TODO functions
    ---------------------------------------------

     Code Views

     Code setters

     function verifyKey

     function settlePayment

     function buyReference // payable

    */

    /*
    ---------------------------------------------
    Client functions
    ---------------------------------------------
    */

    /*
    ---------------------------------------------
    Provider functions
    ---------------------------------------------
    */

    event NewDataReference(uint32 dataId, address provider, uint price, uint64 contractEndTime);

    //function createDataReference
    function createDataReference (uint _price, uint64 _contractEndTime) public {
        // Creating new data reference

        DataReference memory ref;
        ref.price = _price;
        ref.contractEndTime=_contractEndTime;

        dataReferences.push(ref);

        emit NewDataReference(dataIdCounter, msg.sender, _price, _contractEndTime);

        // !!!!!!!!!!!!! Maybe we will not use data ID counter
        dataIdCounter = dataIdCounter +1;

    }

    // Give access to the provider only
    modifier onlyProvider(uint32 _dataId) {
        require(msg.sender == dataReferences[_dataId].provider);
        _;
    }

    // Allows the provider to submit the data's unencrypted key for later verification
//    function submitDataKey (uint32 _dataId, uint64 _dataKey) external onlyProvider {
//
//        // !!!!!!!!!!!!! check uint compatibility and casting
//        require(time.now < contractEndTime);
//        dataReferences[_dataId].dataKey = _dataKey;
//
//        // Debate whether it should automatically check for every client the correctness of the _dataKey
//
//        // Add pay function after mey submission
//    }


}

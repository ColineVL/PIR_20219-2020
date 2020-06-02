pragma solidity >=0.5.0 <0.6.0;

// To avoid overflow
import "./safemath.sol";
using SafeMath for uint256;
using SafeMath32 for uint32;

contract Depreciation_Contract {
// CHECK ALL TYPES and PUBLIC STUFF
    uint32 dataIdCounter = 0;

    struct DataReference{ // Contains reference ANd price
        uint32 dataId;
        uint32 price;
        uint64 dataKey; //Take care of hackers, must be long enough ... to be determined
        uint64 contractDeploymentTime;
        /*
        contractDuration is too long, it must be shortened with:
           - Changing data type with a risk not to optimize storage
           - Put require statement in createDataReference 
        */
        uint64 contractDuration; // Should not be allowed to be changed by anyone, even the owner to avoid scams and withholding funds for a long time
        address[] clients;
        address provider;
    }

    DataReference[] dataReferences;

    //Code Views
    //Code setters

    function createDataReference (uint32 _price, uint _contractDuration) external {
        // Creating new data reference
        dataReferences.push(DataReference(dataIdCounter, _price, , time.now, _contractDuration, , msg.sender));
        
        // Incrementing data reference
        dataIdCounter = dataIdCounter.add(1);
    }
    
    
    
    //function createDataReference
    //function setKey \\Only owner
    //function verifyKey
    //function settlePayment
    //function buyReference // payable
}

// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;

// To avoid overflow
import "./node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract Depreciation_Contract{

    using SafeMath for uint256;
    using SafeMath for uint128;

    // CHECK ALL TYPES and PUBLIC STUFF

    // To avoid overflow
    //    using SafeMath for uint256;
    // Import it later
    //    using SafeMath32 for uint32;

    uint referenceIdCounter = 0;

    struct DataReference{ // Contains reference ANd price

        uint initialPrice;
        uint redeemFunds;

        uint referenceKey; //Take care of hackers, must be long enough ... to be determined
        /*
        contractDuration is too long, it must be shortened with:
           - Changing data type with a risk not to optimize storage
           - Put require statement in createDataReference
        */

        uint128 minimumData;
        uint128 numberOfData;


        // Needed to calculate depreciation value
        uint128 deployTime;
        /*
            Should not be allowed to be changed by anyone, even the owner to avoid scams and ...
            ... withholding funds for a longer time than anticipated
        */
        uint128 endTime;

        /*
            Value depreciation factors.
            1: linear depreciation | 2: quadratic depreciation. Any other value constant price (no depreciation)
        */
        uint8 depreciationType;

        address provider;
        // Necessary to check if the provider withdrew undisputed funds so he does not withdraw other's funds
        uint withdrawableFunds;

        /*
            Client parameters
        */

        // List of clients that bought the contract
        address[] clients;
        mapping (address => uint) clientFunds;

        // Needed to give access for a client to call dispute function or recall funds
        mapping (address => bool) isClient;
        // Needed so a client does not raise multiple disputes so he claims his money as well as others if he is right
        mapping (address => bool) raisedDispute;
        // Needed to return a table of clients disputes
        uint128 numberOfDisputes;
        // Needed to distribute redeemFunds
        uint128 completedClients;
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

    function getReferenceCurrentPrice(uint _referenceId) view public returns(uint price){
        uint _price = dataReferences[_referenceId].initialPrice;
        uint8 depreciationType = dataReferences[_referenceId].depreciationType;

        // Linear value depreciation
        if(depreciationType == 1){
            // reference time length timeLength: T(end) - T(deploy)
            uint timeLength = uint (dataReferences[_referenceId].endTime - dataReferences[_referenceId].deployTime);
            // time elapsed from the beginning of contract T: now - deployTime
            uint timeElapsed = now - uint (dataReferences[_referenceId].deployTime);

            _price = _price - (_price * timeElapsed / timeLength);

        }

        // Quadratic value depreciation
        else if(depreciationType == 2){
            // reference time length timeLength: T(end) - T(deploy)
            uint timeLength = uint (dataReferences[_referenceId].endTime - dataReferences[_referenceId].deployTime);
            // time elapsed from the beginning of contract T: now - deployTime
            uint timeElapsed = now - uint (dataReferences[_referenceId].deployTime);

            _price = (_price*timeElapsed*timeElapsed)/(timeLength*timeLength)
            - (2*_price*timeElapsed)/(timeLength) + _price;
        }

        // if no depreciation type index is correct it will return the initial price (constant value / no depreciation)
        return _price;
    }


    function getNumberOfData(uint _referenceId) view external returns(uint128 numberOfData){
        return dataReferences[_referenceId].numberOfData;
    }


}
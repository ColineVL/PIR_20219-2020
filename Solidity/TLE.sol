// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "./Provider_Depreciation_Contract.sol";

contract TLE_Contract is Provider_Depreciation_Contract {

    struct structTLE {
        string spaceObject;
        bytes32 TLE;
    }

    // mapping between referenceId and the data (here two line element as a string)
    mapping (uint => structTLE[]) public TLEs;

    event newTLE(uint indexed referenceId, string TLE);

    function setTLE(uint _referenceId, string memory _spaceObject, bytes32 _TLE) onlyProvider(_referenceId) public{

        structTLE memory _newObs;
        _newObs.spaceObject = _spaceObject;
        _newObs.TLE = _TLE;

        TLEs[_referenceId].push(_newObs);
        dataReferences[_referenceId].numberOfData ++;

        emit newTLE(_referenceId, _spaceObject);
    }

    function getTLEs (uint _referenceId) external view returns(structTLE[] memory){
        return TLEs[_referenceId];
    }

}
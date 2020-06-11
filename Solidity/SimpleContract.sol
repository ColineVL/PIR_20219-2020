// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.7.0;

contract SimpleContract {
    uint32 data = 0;
    uint public data2 =5;

    mapping(uint => uint) public maptest;

    event NewData(uint32 data, address provider);

    function  getData() public view returns (uint32) {
        // Creating new data reference
        return data;
    }

    function Setmaptest (uint key, uint value) public {
        maptest[key] = value;
    }

    function  setData (uint32 i) public {
        // Creating new data reference
        data = i ;
        emit NewData(data, msg.sender);
    }
}

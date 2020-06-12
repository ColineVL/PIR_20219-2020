// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.7.0;

contract SimpleContract {
    uint32 data = 0;
    uint public data2 = 5;

    mapping(uint => uint) public maptest;

    mapping(uint => uint) public uint1;
    mapping(uint => bool) public bool1;
    mapping(uint => bool) public bool2;



    struct mapGasTest {
        uint uintMap;
        bool boolMap1;
        bool boolMap2;
    }


    ////////////////////////////////

    mapping(uint => mapGasTest) gasTest;

    function setUint1 (uint key, uint _uint) public {
        uint1[key] = _uint;
    }


    function setBool1 (uint key, bool _bool1)   public {
        bool1[key] = _bool1;
    }

    function setBool2 (uint key, bool _bool2) public {
        bool2[key] = _bool2;
    }

    //////////////////////////////////

    function setUintMap (uint key, uint _uintMap) public {
        gasTest[key].uintMap = _uintMap;
    }

    function setBoolMap1(uint key, bool _boolMap1) public {
        gasTest[key].boolMap1 = _boolMap1;
    }

    function setBoolMap2(uint key, bool _boolMap2) public {
        gasTest[key].boolMap2 = _boolMap2;
    }


    event NewData(uint32 data, address provider);

    function getData() public view returns (uint32) {
        // Creating new data reference
        return data;
    }

    function Setmaptest(uint key, uint value) public {
        maptest[key] = value;
    }


    function setData(uint32 i) public {
        // Creating new data reference
        data = i;
        emit NewData(data, msg.sender);
    }
}

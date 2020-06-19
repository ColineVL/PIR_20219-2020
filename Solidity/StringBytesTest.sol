// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;


contract StringBytesTest {
    string public testString;
    bytes16 public byt;

    struct DataReference{ // Contains reference ANd price
        uint int1;
        address[] clients;
        mapping (address => bool) isClient;
    }

    address[]  public clients3;

    DataReference[] public dataReferences;

    event Eventee(string indexed testStringIndexed, string testString, bytes16 byt);

    function set( string memory _testString, bytes16 _byt) public {
        testString = _testString;
        byt = _byt;
        emit Eventee(_testString, _testString, byt);
    }

    function set1( uint _int) public{


        dataReferences.int1 = _int;
        dataReferences.clients.push(msg.sender);
        dataReferences.isClient[msg.sender] = true;

        dataReferences.push(newReference);
    }
    function setArr() public {
        clients3.push(msg.sender) ;
    }
    function getArr(uint i) public view {
        return clients3[i];
    }
    function getArrRef(uint i, uint j) public view {
        return dataReferences[i].clients[j];
    }

}
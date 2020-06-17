// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;


contract StringBytesTest {
    string public testString;
    bytes16 public byt;

    event Eventee(string indexed testStringIndexed, string testString, bytes16 byt);

    function set( string memory _testString, bytes16 _byt) public {
        testString = _testString;
        byt = _byt;

        emit Eventee(_testString, _testString, byt);
    }

}
// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;


contract StringBytesTest {
    string public testString;

    event Event(string indexed testStringIndexed, string testString);

    function set( string memory _testString) public {
        testString = _testString;

        emit Event(_testString, _testString);
    }

}
// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.7.0;


contract StringBytesTest {
    bytes16 public testBytes;
    string public testString;

    event Event(string indexed testStringIndexed, string testString, bytes32 indexed testBytes);

    function set(bytes16 _testBytes, string _testString){
        testBytes = _testBytes;
        testString = _testString;

        emit Event(_testString, _testString, _testBytes);
    }

}
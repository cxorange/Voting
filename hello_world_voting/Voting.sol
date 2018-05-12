pragma solidity ^0.4.19;

contract Voting{
    //候选人键值对
	mapping (bytes32 => uint8) public votesReceived;
    //候选人列表
	bytes32[] public candidateList;
    //构造函数
	function Voting(bytes32[] candidateNames) public{
	   candidateList = candidateNames;
	}
	//候选人票数
	function totalVotesFor(bytes32 candidate) view public returns(uint8){
	   require(validCandidate(candidate));

	   return votesReceived[candidate];
	}
	//投票
	function voteForCandidate(bytes32 candidate) public {
	   require(validCandidate(candidate));

	   votesReceived[candidate] += 1;
	}
	//判断是否含有该候选人
	function validCandidate(bytes32 candidate) view private returns(bool){
	   for(uint i = 0; i < candidateList.length; i++){
	       if(candidateList[i] == candidate){
	          return true;
	       }
	   }

	   return false;
	}
}
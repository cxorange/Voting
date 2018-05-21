pragma solidity ^0.4.18;

contract Voting{

   mapping (bytes32 => uint) public votesReceived;

   bytes32[] public candidateList;


   function Voting(bytes32[] candidateNames) public {
       candidateList = candidateNames;
   }

   function totalVotesFor(bytes32 candidate) view public returns(uint){
       require(validCandidate(candidate));

       return votesReceived[candidate];
   }
   
   //投票
   function voteForCandidate(bytes32 candidate,uint votesInTokens) public {
       require(validCandidate(candidate));


       votesReceived[candidate] += 1;
   }
   

   //判断是否有该候选人
   function validCandidate(bytes32 candidate) view private returns(bool){
       for(uint i = 0; i < candidateList.length; i++){
           if(candidateList[i] == candidate){
                return true;
           }
       }
       return false;
   }
 }

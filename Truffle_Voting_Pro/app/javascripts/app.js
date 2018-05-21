// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import voting_artifacts from '../../build/contracts/Voting.json'

// Voting is our usable abstraction, which we'll use through the code below.
var Voting = contract(voting_artifacts);
let candidates = {"Rama" : "candidate-1","Nick":"candidate-2","Lasa":"candidate-3"};

window.voteForCandidate = function(candidate){
  let candidateName = $("#candidate").val();

  try{
    $("msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.");
    $("#candidate").val("");
    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
     Voting.deployed().then(function(contractInstance){
        console.log(web3.eth.accounts[0]);
        contractInstance.voteForCandidate(candidateName, {gas:140000,from:web3.eth.accounts[0]}).then(function(){
          let div_id = candidates[candidateName];
          return contractInstance.totalVotesFor(candidateName).then(function(value){
            console.log('=======' + value + "=========");
             $('#' + div_id).html(value.toString());
             $("#msg").html("");
          });
        });
     });
  }catch(err){
    console.log(err);
  }
}

$(document).ready(function(){
  if (typeof web3 !== 'undefined') {
     console.log("Using web3 detected from external source like Metamask");
     // Use Mist/MetaMask's provider
     window.web3 = new Web3(web3.currentProvider);
  }else{
    console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.provider.HttpProvider('http://localhost:8545'));
  }
  Voting.setProvider(web3.currentProvider);

  let candidatesNames = Object.keys(candidates);

  for (var i = 0; i < candidatesNames.length; i++) {
    let name = candidatesNames[i];
    Voting.deployed().then(function(contractInstance){
       contractInstance.totalVotesFor(name).then(function(value){
         $('#' + candidates[name]).html(value.toString());
       });
    })
  }
});
// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import voting_artifacts from '../../build/contracts/Voting.json'

// Voting is our usable abstraction, which we'll use through the code below.
var Voting = contract(voting_artifacts);
let tokenPrice = null;
let candidates = {};

window.voteForCandidate = function(candidate){
  let candidateName = $("#candidate").val();
  let voteToken = $("#vote-tokens").val();

  $("#msg").html("Vote has been submitted.The vote count will increment as soon as the vote is recorded on the blockchain.Please wait.");
  $("#candidate").val("");
  $("#vote-tokens").val("");

  Voting.deployed().then(function(contractInstance){
    contractInstance.voteForCandidate(candidateName, voteToken,{gas:470000, from:web3.eth.accounts[0]}).then(function(){
      return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
        $("#" + div_id).html(v.toString());
        $("#msg").html("");
      });
    });
  })
}


window.buyTokens = function(){
  let tokensToBuy = $("#buy").val();
  let price = tokensToBuy * tokenPrice;

  $("#buy-msg").html("Purchase order has been submitted. Please wait.");

  Voting.deployed().then(function(contractInstance){
    contractInstance.buy({value: web3.toWei(price, 'ether'),from: web3.eth.accounts[0]}).then(function(v){
      $("#buy-msg").html("");
      web3.eth.getBalance(contractInstance.address, function(err, result){
        $("#contract-balance").html(web3.fromWei(result.toString()) + "Ether");
      });
    })
  });

}

window.lookupVoterInfo = function(){
  let address = $("#voter-info").val();

  Voting.deployed().then(function(contractInstance){
    contractInstance.voterDetails.call(address).then(function(value){
      $("#tokens-bought").html("Total Tokens bought:" + value[0].toString());

      let votersPerCandidate = value[1];

      $("#votes-cast").empty();
      $("#votes-cast").append("Votes cast per candidate: <br>");
      let allCandidates = Object.keys(candidates);
      for (var i = 0; i < allCandidates.length; i++) {
        $("#votes-cast").append(allCandidates[i] + "：" + votersPerCandidate[i] + "<br>");
      }
    });
  });
}
//创建候选人行数
function setupCandidateRows(){
  console.log(candidates);
  Object.keys(candidates).forEach(function(candidate){
    $("#candidate-rows").append("<tr><td>"+candidate +"</td><td id='"+ candidates[candidate] + "''></td></tr>")
  });
}

function populateCandidateVotes(){
  let candidateNames = Object.keys(candidates);

  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    Voting.deployed().then(function(contractInstance){
      contractInstance.totalVotesFor.call(name).then(function(value){
        $("#" + candidates[name]).html(value.toString());
      });
    });
  }
}

function populateTokenData(){
  Voting.deployed().then(function(contractInstance){
    contractInstance.totalTokens().then(function(value){
      $("#tokens-total").html(value.toString());
    });

    contractInstance.tokensSold.call().then(function(value){
      $("#tokens-sold").html(value.toString());
    });

    contractInstance.tokenPrice().then(function(value){
      tokenPrice = parseFloat(web3.fromWei(value.toString()));
      $("#token-cost").html(tokenPrice + "Ether");
    });

    web3.eth.getBalance(contractInstance.address, function(err, result){
      $("#contract-balance").html(web3.fromWei(result.toString()) + 'Ether');
    });
  });
}

function populateCandidates(){
  Voting.deployed().then(function(contractInstance){
    contractInstance.allCandidate.call().then(function(candidateArray){
      for (var i = 0; i < candidateArray.length; i++) {
        candidates[web3.toUtf8(candidateArray[i])] = "candidate-" + i; 
      }

      setupCandidateRows();
      populateCandidateVotes();
      populateTokenData();
    });
  });
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

  populateCandidates();
});
// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var HDWalletProvider = require('truffle-hdwallet-provider');

const fs = require('fs');
var infura_key = 'Ae4MVDOiNFsNciWi20ld';
var mnemonic = fs.readFileSync('mnemonic').toString();

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    ropsten:{
      provider: new HDWalletProvider(mnemonic,"https://ropsten.infura.io/" + infura_key),
      network_id: 3,
      gas:1600000
    }
  }

}

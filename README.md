# PIR
Projet d'innovation recherche de 2A. <br>
Développement d'une interface web pour interagir plus simplement avec une blockchain.

# Menu
[Prerequisites](#prerequisites)

[Launching the blockchain](#start-the-blockchain)

[Start the Server](#start-the-server)

[Using the server](#using-the-server)



## Installation

### Prerequisites
<ul>
  <li><a href="https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Install-Binaries/">Besu</a></li>
  <li><a href="https://nodejs.org/en/">Node Js</a></li>
</ul>
Other packages need to be installed, use npm install.



### Start The Blockchain
How to launch the 4 nodes <br>
The full tutorial is available <a href="https://besu.hyperledger.org/en/stable/Tutorials/Private-Network/Create-IBFT-Network/">here<a> , but for a quickstart, use <a href="https://github.com/ColineVL/PIR/tree/master/IBFT-Network">IBFT-Network<a>, and follow these steps:
  <ol>
    <li>open 4 consoles,cd to the paths Node-1,-2,-3 and -4. </li>
    <li> start by launching the bootnode(Node-1), enter the following command : <br>
      besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled  --rpc-http-api=ETH,NET,IBFT,WEB3,PRIV,PERM,ADMIN --host-whitelist="*" --rpc-http-cors-origins=“all”  </li>
    <li> in Node-2 : <br>
      besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://39ac2c24db6c07ba5b2b39658d4fd1c9b51c813a4c5975ca53a0080520b7c6f5ce5d0f6e651193d216bfcfccbf378d4601266f8b58219e5f606ef0c0a1a6b4eb@127.0.0.1:30303 --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8546 </li>
    <li> in 3 : <br>
      besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://39ac2c24db6c07ba5b2b39658d4fd1c9b51c813a4c5975ca53a0080520b7c6f5ce5d0f6e651193d216bfcfccbf378d4601266f8b58219e5f606ef0c0a1a6b4eb@127.0.0.1:30303 --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547  </li>
    <li> 4 : <br>
      besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://39ac2c24db6c07ba5b2b39658d4fd1c9b51c813a4c5975ca53a0080520b7c6f5ce5d0f6e651193d216bfcfccbf378d4601266f8b58219e5f606ef0c0a1a6b4eb@127.0.0.1:30303 --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548   </li>
  </ol>
   Finally, an easy to verify the blockhain is up and running, simply insert the following in a new console (should indicate 4 nodes): <br>
  curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' localhost:8545
  <br>
  
  To further simplify launching the nodes, you can copy the command in INSERT LINK HERE, the previous steps will be done automatically.


### Start the Server
Simply open a new terminal window, navigate to the correct path and enter <i>node server.js</i>.


Be sure the blockchain is up and running beforehand.
The blockchain's address must coincide with the ones in the files.

### Using the Server
Dans un navigateur, se connecter à adresseIP:8089/todo, où l'adresse IP est celle de l'ordinateur qui a lancé le serveur. 

Sur Linux, pour obtenir son adresse IP privée, taper dans la console : hostname -I.

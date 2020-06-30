# PIR
Projet d'innovation recherche de 2A. <br>
Développement d'une interface web pour interagir plus simplement avec une blockchain.

## Installation

### Prérequis
<ul>
  <li><a href="https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Install-Binaries/">Besu</a></li>
  <li><a href="https://nodejs.org/en/">Node Js</a></li>
</ul>
Other packages need to be installed, use npm install.



### Lancer la blockchain
Comment lancer les quatres noeuds <br>
Le tutoriel est disponible <a href="https://besu.hyperledger.org/en/stable/Tutorials/Private-Network/Create-IBFT-Network/">ici<a> , mais pour un quickstart, un exemple est disponible dans <a href="https://github.com/ColineVL/PIR/tree/master/IBFT-Network">IBFT-Network<a>, il suffit:
  <ol>
    <li>d'ouvrir 4 consoles, placées dans le repertoire Node-1,-2,-3 et -4. </li>
    <li> commencer par le bootnode, donc le Node-1, lancer la commande : <br>
      besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled  --rpc-http-api=ETH,NET,IBFT,WEB3,PRIV,PERM,ADMIN --host-whitelist="*" --rpc-http-cors-origins=“all”  </li>
    <li> dans le Node-2 : <br>
      besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://39ac2c24db6c07ba5b2b39658d4fd1c9b51c813a4c5975ca53a0080520b7c6f5ce5d0f6e651193d216bfcfccbf378d4601266f8b58219e5f606ef0c0a1a6b4eb@127.0.0.1:30303 --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8546 </li>
    <li> dans le 3 : <br>
      besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://39ac2c24db6c07ba5b2b39658d4fd1c9b51c813a4c5975ca53a0080520b7c6f5ce5d0f6e651193d216bfcfccbf378d4601266f8b58219e5f606ef0c0a1a6b4eb@127.0.0.1:30303 --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547  </li>
    <li> 4 : <br>
      besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://39ac2c24db6c07ba5b2b39658d4fd1c9b51c813a4c5975ca53a0080520b7c6f5ce5d0f6e651193d216bfcfccbf378d4601266f8b58219e5f606ef0c0a1a6b4eb@127.0.0.1:30303 --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548   </li>
  </ol>
   Enfin simplement pour confirmer que tout fonctionne bien, dans une 5eme console, la commande suivante devrait renvoyer 4 noeuds : <br>
  curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' localhost:8545


### Démarrer le serveur
Pour lancer le serveur, il faut entrer <i>node server.js</i> dans un terminal.


Pour éviter les erreurs, il vaut mieux lancer la blockchain avant.
L'adresse de la blockchain doit correspondre à l'adresse donnée dans les fichiers.

### Se connecter au serveur depuis un autre ordinateur
Dans un navigateur, se connecter à adresseIP:8089/todo, où l'adresse IP est celle de l'ordinateur qui a lancé le serveur. 

Sur Linux, pour obtenir son adresse IP privée, taper dans la console : hostname -I.
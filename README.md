# PIR
Projet d'innovation recherche de 2A. <br>
Développement d'une interface web pour interagir plus simplement avec une blockchain.*

## Installation

### Prérequis
<ul>
  <li><a href="https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Install-Binaries/">Besu<a></li>
  <li><a href="https://nodejs.org/en/">Node Js<a></li>
</ul>
    Peut être d'autres packages, ils vous seront indiqués lors des imports (utiliser npm install..)



### Lancer la blockchain
Comment lancer les quatres noeuds <br>
Le tutoriel est disponible <a href="https://besu.hyperledger.org/en/stable/Tutorials/Private-Network/Create-IBFT-Network/">ici<a> , mais pour un quickstart, un exemple est disponible dans <a href="https://github.com/ColineVL/PIR/tree/master/IBFT-Network">IBFT-Network<a>, il suffit:
  <ol>
    <li>d'ouvrir 4 consoles, placées dans le repertoire Node-1,-2,-3 et -4. </li>
    <li> commencer par le bootnode, donc le Node-1, lancer la commande : <br>
      besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled  --rpc-http-api=ETH,NET,IBFT,WEB3,PRIV,PERM,ADMIN --rpc-ws-api=ETH,NET,IBFT,WEB3,PRIV,PERM,ADMIN --host-whitelist="*" --rpc-http-cors-origins=“all” --rpc-ws-enabled </li>
    <li> dans le Node-2 : <br>
      besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://ff9beb059a4510a11e117899ea6b9709e4250ed9f06898e14cd15ae76c9e3925dba5030b2461273cb611419b34c9f958ad807937e5afd7c2e15a344a9ecba6b1@127.0.0.1:30303 --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8549 </li>
    <li> dans le 3 : <br>
      besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://ff9beb059a4510a11e117899ea6b9709e4250ed9f06898e14cd15ae76c9e3925dba5030b2461273cb611419b34c9f958ad807937e5afd7c2e15a344a9ecba6b1@127.0.0.1:30303 --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547 </li>
    <li> 4 : <br>
      besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://ff9beb059a4510a11e117899ea6b9709e4250ed9f06898e14cd15ae76c9e3925dba5030b2461273cb611419b34c9f958ad807937e5afd7c2e15a344a9ecba6b1@127.0.0.1:30303 --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548  </li>
  </ol>
   Enfin simplement pour confirmer que tout fonctionne bien, dans une 5eme console, la commande suivante devrait renvoyer 4 noeuds : <br>
  curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' localhost:8545

### Certainnes Fonctionnalités déjà codée en local

Les fichiers nécessaires (moyennant certains npm install), sont dans <a href="https://github.com/ColineVL/PIR/tree/master/Node_Js_Tes">Node Js Test<a>. Vous pouvez les lancer dans une console avec la commande <i> node <nom du fichier> </i> <br> 
  
Signed_Transaction.js permet de creer une transaction signée entre 2 noeuds, qui est soit automatiquement effectuée, soit vous donne une commande pour le faire plus tard.

Monitoring.js est une ebauche et un fichier test de fonctionnalité de web3, notamment il va afficher( si un reséau tourne en parallele sur le localhost8545) le nombre de noeuds connectées et leur infos, puis tant que le programme est lancé, il compte le nombre de blocks minés par chaque noeuds (depuis 0, pas la séance actuelle)


### Démarrer le serveur
Comment lancer le serveur <br>

Les fichiers nécessaires (moyennant certains npm install), sont dans <a href="https://github.com/ColineVL/PIR/tree/master/Node_Js_Tes">Node Js Test<a>. <br>
  <i> node testExpress.js </i> permet de lancer le serveur. (et également avoir un réseau a 1 ou plus noeud qui tourne sur le localhost8545)

### Se connecter au serveur depuis un autre ordinateur
Dans un navigateur, se connecter à adresseIP:8080/todo, où l'adresse IP est celle de l'ordinateur qui a lancé le serveur. 

Attention, pour que ça fonctionne il faut être sous le même réseau !
On peut pour cela utiliser un VPN, par exemple Hamachi. 
Hamachi se télécharge à cette adresse : https://vpn.net/
On utilise actuellement le réseau "reseau_PIR", dont le mot de passe est "mdpPIR". Attention, seules cinq personnes peuvent se connecter à ce réseau.

Sur Linux, pour obtenir son adresse IP privée, taper dans la console : hostname -I.

## Liens utiles
Ethereum yellow paper : https://ethereum.github.io/yellowpaper/paper.pdf <br>
Besu : https://besu.hyperledger.org/en/stable/ <br>
Installer Besu : https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Install-Binaries/ <br>
Créer un réseau privé avec IBFT : https://besu.hyperledger.org/en/stable/Tutorials/Private-Network/Create-IBFT-Network/ <br>
Golden Layout : https://golden-layout.com/ <br>
Tutoriel CryptoZombies pour apprendre Solidity : https://cryptozombies.io/ <br>
Tutoriel HTML : https://www.codecademy.com/learn/learn-html <br>
Tutoriel JavaScript : https://www.codecademy.com/learn/introduction-to-javascript <br>
Tutoriel Make a Website (HTML, CSS, Bootstrap, déployer son site) : https://www.codecademy.com/learn/introduction-to-javascript <br>
Tutoriel Git : https://openclassrooms.com/fr/courses/2342361-gerez-votre-code-avec-git-et-github <br>

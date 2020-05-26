var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const Web3 = require('web3');
const Admin =require('web3-eth-admin').Admin;

var SignedTransaction = require('./SignedTransactionModule');


var provider = 'http://localhost:8545';
var web3 = new Web3(new Web3.providers.HttpProvider(provider))
const options = {
    defaultAccount: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
    defaultBlock: 'latest',
    defaultGas: 1,
    defaultGasPrice: 0,
    transactionBlockTimeout: 50,
    transactionConfirmationBlocks: 24,
    transactionPollingTimeout: 480,
};
const admin = new Admin(provider, null, options);
var app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

let nodelist = [];




/* On utilise les sessions */
// app.use(session({secret: 'todotopsecret'}))
// app.use(express.static('public'))
app.use('/public', express.static(__dirname + '/public'))

    /* S'il n'y a pas de nodelist dans la session,
    on en crée une vide sous forme d'array avant la suite */
    // .use(function(req, res, next){
    //     if (typeof(nodelist) == 'undefined') {
    //         nodelist = [];
    //     }
    //     // next();
    // })

    /* On affiche la liste de noeuds */
    .get('/nodes', function(req, res) {
        res.render('nodes.ejs', {nodelist: nodelist});
    })
    /* On affiche les infos de'un noeud */
    .get('/node/', async (req, res) => {

        const id = req.query.id ;
        const list = nodelist;
        const node = list[id];

        const account = await web3.eth.accounts.privateKeyToAccount("0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63");
        const bal = await web3.eth.getBalance(account.address);
        console.log(bal);
        res.render('node.ejs', {node: node});
    })
    .get('', function(req, res) {
        res.render('home.ejs', {nodelist: nodelist});
    })

    /* Rafraichir la page pour voir si plus de noeuds sont presents */
    .get('/nodes/refresh/', async (req, res) => {
        let PeerCount = await web3.eth.net.getPeerCount();
        console.log(PeerCount)
        let peers = await admin.getPeers();
        nodelist =[];
        for(let i=0; i<PeerCount; i++) {
            nodelist.push(peers[i]);
        }
        res.redirect('/nodes');
    })
    /* Vue pour afficher le balance d'une adresse */
    .get('/balance/', async (req, res) => {

        // const account = prompt("Please enter an address",
        //     "0");
        const account = req.query.account;
        console.log(account);
        if (account != null) {
            // const bal = await web3.eth.getBalance(address);
            document.getElementById("balance").innerHTML =5;// "Balance: " + bal;
            document.getElementById("address").innerHTML =5;// "For: " + account;
        }
        res.render('balance.ejs',);
    })

    .get('/SignedTransaction/', async (req, res) => {
        let PeerCount = await web3.eth.net.getPeerCount();
        console.log(PeerCount)
        let peers = await admin.getPeers();
        nodelist =[];
        for(let i=0; i<PeerCount; i++) {
            nodelist.push(peers[i]);
        }
        res.render('signedTransactionForm.ejs', {nodelist: nodelist});
    })

    .post('/CreateTransaction/', async (req, res) => {
        const sender = req.body.sender
        const privateKey = req.body.privateKey
        const receiver = req.body.receiver
        const ammount = req.body.ammount

        console.log(sender);
        console.log(privateKey);


        const r = await SignedTransaction.createAndSendSignedTransaction(provider,ammount,privateKey,sender,receiver);//,0.001,'8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','0xfe3b557e8fb62b89f4916b721be55ceb828dbd73','0xf17f52151EbEF6C7334FAD080c5704D77216b732');
        console.log("receipt:", r)
        // const valueInEther = prompt("Value in Ether to send? (press enter for default)",'5');
        res.render('resultTransaction.ejs',{sender: sender, receiver: receiver, ammount: ammount, r: r});
    })

    /* On redirige vers home si la page demandée n'est pas trouvée */
    .use(function(req, res, next){
        res.redirect('/nodes');
    })

    .listen(8080);

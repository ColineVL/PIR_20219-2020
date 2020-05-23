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

let nodelist = [];




async function CheckBalance() {
    const account = prompt("Please enter an address",
        "0");
    if (account != null) {
        const bal = await web3.eth.getBalance(address);
        document.getElementById("balance").innerHTML = "Balance: " + bal;
        document.getElementById("address").innerHTML = "For: " + account;
    }

}

/* On utilise les sessions */
// app.use(session({secret: 'todotopsecret'}))
app.use(express.static('public'))

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
        const list = req.session.nodelist;
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

        res.render('balance.ejs',);
    })

    .get('/SignedTransaction/', async (req, res) => {
        let PeerCount = await web3.eth.net.getPeerCount();
        console.log(PeerCount)
        let peers = await admin.getPeers();
        req.session.nodelist =[];
        for(let i=0; i<PeerCount; i++) {
            req.session.nodelist.push(peers[i]);
        }
        res.render('signedTransactionForm.ejs', {nodelist: req.session.nodelist});
    })

    .get('/CreateTransaction/', async (req, res) => {
        const sender = req.sender
        const receiver = req.receiver
        const ammount = req.ammount

        const r = await SignedTransaction.createAndSendSignedTransaction(provider);
        console.log("Hey.......")
        console.log("receipt:", r)
        console.log("Hey....")
        // const valueInEther = prompt("Value in Ether to send? (press enter for default)",'5');
        res.render('resultTransaction.ejs',{sender: sender, receiver: receiver, ammount: ammount, r: r});
    })

    /* On redirige vers home si la page demandée n'est pas trouvée */
    .use(function(req, res, next){
        res.redirect('/nodes');
    })

    .listen(8080);

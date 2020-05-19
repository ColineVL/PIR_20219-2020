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


/* On utilise les sessions */
app.use(session({secret: 'todotopsecret'}))

    /* S'il n'y a pas de todolist dans la session,
    on en crée une vide sous forme d'array avant la suite */
    .use(function(req, res, next){
        if (typeof(req.session.nodelist) == 'undefined') {
            req.session.nodelist = [];
        }
        next();
    })

    /* On affiche la todolist et le formulaire */
    .get('/nodes', function(req, res) {
        res.render('nodes.ejs', {nodelist: req.session.nodelist});
    })
    .get('', function(req, res) {
        res.render('home.ejs', {nodelist: req.session.nodelist});
    })

    /* Rafraichir la page pour voir si plus de noeuds sont presents */
    .get('/nodes/refresh/', async (req, res) => {
        let PeerCount = await web3.eth.net.getPeerCount();
        console.log(PeerCount)
        let peers = await admin.getPeers();
        req.session.nodelist =[];
        for(let i=0; i<PeerCount; i++) {
            req.session.nodelist.push(peers[i].name);
        }
        res.redirect('/nodes');
    })
    //fonction pour afficher les infos d'un noeud d'id: id
    .get('/SignedTransaction/', async (req, res) => {
        res.render('signedTransactionForm.ejs', {nodelist: req.session.nodelist});
    })
    .get('/CreateTransaction/', async (req, res) => {
        const sender = req.sender
        const receiver = req.receiver
        const ammount = req.ammount

        const r = await SignedTransaction.createAndSendSignedTransaction(provider);
        console.log("Hey.......")
        console.log("receipt:", r.from)
        console.log("Hey....")
        // const valueInEther = prompt("Value in Ether to send? (press enter for default)",'5');
        res.render('resultTransaction.ejs',{sender: sender, receiver: receiver, ammount: ammount, r: r});
    })

    /* On redirige vers home si la page demandée n'est pas trouvée */
    .use(function(req, res, next){
        res.redirect('/nodes');
    })

    .listen(8080);

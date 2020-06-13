var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const Web3 = require('web3');
const Admin =require('web3-eth-admin').Admin;

var SignedTransaction = require('./js/SignedTransactionModule');

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
// Load the css folder
app.use(express.static(__dirname + '/css'));
// Load the js files
app.use(express.static(__dirname + '/js'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

let Account = undefined;

app.use('/public', express.static(__dirname + '/public'))

    /* Home view */
    .get('', async (req, res) => {
        if (Account) {
            let funds = await web3.eth.getBalance(Account.address)
            res.render('homeClient.ejs',{account : Account, funds: funds});
        } else{
            res.render('homeClient.ejs',{account : Account});
        }
    })

    /* Form view to connect with private key*/
    .get('/ConnexionForm', function(req, res) {
        res.render('ConnexionForm.ejs', {account : Account});
    })

    /* Handler to process the connection */
    .post('/Connexion/', async (req, res) => {
        try {
            let account = web3.eth.accounts.privateKeyToAccount(req.body.prKey);
            Account = account;
            console.log("attempt to connect");
            console.log(Account);
            res.redirect(''); // Redirecting home to confirm connection
        }
            catch(err) { // If an error is raised, try reconnecting
                console.log(typeof err)
                console.log(typeof err == "object")
                console.log(Object.keys(err))
                 res.render('ConnexionForm.ejs', {error : err, account : Account});
            };
    })

    /* Interface for a buyer */
    .get('/BuyerMenu', async (req, res) => {
        if (Account) {
            let funds = await web3.eth.getBalance(Account.address)
            res.render('BuyerMenu.ejs',{account : Account, funds: funds});
        } else{
            res.render('BuyerMenu.ejs',{account : Account});
        }
    })

    /* Availabe References to buy */
    .get('/ForSale', async (req, res) => {
        let Ids =[] // CODE FUNCTION HERE TO GET REFERENCES
        res.render('ForSale.ejs',{account : Account, Ids: Ids});
    })

    /* If user asks for an innexistant view, we redirect him to the homepage */
    .use(function(req, res, next){
        res.redirect('/');
    })

    .listen(8080);

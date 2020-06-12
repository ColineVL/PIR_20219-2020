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
    .get('', function(req, res) {
        console.log(Account);
        res.render('homeClient.ejs',{account : Account});
    })

    /* Form view to connect with private key*/
    .get('/ConnexionForm', function(req, res) {
        res.render('ConnexionForm.ejs', {account : Account});
    })

    /* Handler to process the connection */
    .post('/Connexion/', async (req, res) => {
        try {
            account = web3.eth.accounts.privateKeyToAccount(req.body.prKey);
            Account = account;
            console.log("attempt to connect");
            console.log(Account);
            res.redirect('');
        }
            // .then( (account) => {
            //     Account =account;
            //     console.log("attempt to connect");
            //     console.log(Account);
            //     res.redirect('');
            // })
            catch(err) {
                console.log(typeof err)
                console.log(typeof err == "object")
                console.log(Object.keys(err))
                 res.render('ConnexionForm.ejs', {error : err, account : Account});
            };

    })


    /* On redirige vers home si la page demandée n'est pas trouvée */
    .use(function(req, res, next){
        res.redirect('/');
    })

    .listen(8080);
var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var bc = require('./js/blockchain');

/********************************
 * Create the app
 ********************************/
var app = express();
// Load the css folder
app.use(express.static(__dirname + '/css'));
// Load the js files
app.use(express.static(__dirname + '/js'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/********************************
 * Register the URLs
 ********************************/
app.use('/public', express.static(__dirname + '/public'))

    .get('', function(req, res) {
        res.render('home.ejs');
    })

    .get('/updatenodelist/', async(req, res) => {
        let liste = bc.getNodelistIDS();
        res.json(liste);
    })

    .get('/updatelistBlocks/', async (req, res) => {
        let info = bc.getBlockslistNUMBERS();
        res.json(info);
    })

    .get('/getblockinfo/:blocknumber', async (req, res) => {
        let info = await bc.getBlockInfo(req.params.blocknumber);
        console.log(info);
        res.json(info);
    })

    .get('/getbalance/:addressToCheck', async (req, res) => {
        let bal = await bc.getBalance(req.params.addressToCheck);
        res.json(bal);
    })

    .get('/newaccount/', async(req, res) => {
        let info = await bc.createNewAccount();
        res.json([info["address"], info["privateKey"]]);
    })

    /* On redirige vers home si la page demandée n'est pas trouvée */
    .use(function(req, res, next){
        res.redirect('/');
    })

    .listen(8080);

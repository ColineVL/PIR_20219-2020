const express = require('express');
const session = require('cookie-session'); // Charge le middleware de sessions
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const bc = require('./js/blockchain');
const EventsModule = require('./js/EventsModule');
// const crypto = require('./js/CryptoModule');
// const readwrite = require('./js/ReadWriteModule');


// /********************************
//  * Defining Database N.B : will destruct if server is closed...
//  ********************************/
// var DiffieSchema = { // Schema for storing Diffie-H keys
//     refId: "", // Id of the reference for which this applies
//     PubDH: "", // Public key of Diffie-h
//     PrivDH: "", // Private key of Diffie-h
//     Pub_Other: "", // Public key of other individual
// };
// var Reference_ClientSchema = { // Schema for storing reference information for a Client (keys and messages.)
//     public_key: "", // User ethereum public key
//     refId: "", // Id of the reference for which this applies
//     KxorK2: "", // KxorK2 provided by the seller
//     K2: "", // K2 provided later by the seller
// };
// var Reference_SellerSchema = { // Schema for storing reference information for a Seller (keys and messages.)
//     public_key: "", // User ethereum public key
//     refId: "", // Id of the reference for which this applies
//     K: "", // Primary key used to encrypt the info
//     K2: [],     // a mapping between client addresses and the hashes to send them
// };
//
// const Diffie = Object.create(DiffieSchema);
// const Reference_Seller = Object.create(Reference_SellerSchema);
// const Reference_Client = Object.create(Reference_ClientSchema);

/********************************
 * Create the app
 ********************************/
const app = express();
// Load the css folder
app.use(express.static(__dirname + '/css'));
// Load the js files
app.use(express.static(__dirname + '/js'));
// Load the html files
app.use(express.static(__dirname + '/html'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use(session({
    'secret': '343ji43j4n3jn4jk3n'
}));

/********************************
 * Listen on port 8081
 ********************************/

let server = app.listen(8081, function () {
    console.log("Server listening on port 8081.");
});

/********************************
 * Register the URLs
 ********************************/
app.use('/public', express.static(__dirname + '/public'))

    .get('', function (req, res) {
        res.render('home.ejs');
    })

    /** Main gets **/

    .get('/connect/:privateKey', async (req, res) => {
        req.session.Account = await bc.getAccount(req.params.privateKey);
        const address = req.session.Account.address;
        const balance = await bc.getBalance(address);
        res.json({address: address, balance: balance});
    })

    .get('/signout', function (req, res) {
        req.session.Account = undefined;
    })

    .get('/newaccount/', async (req, res) => {
        const info = await bc.createNewAccount();
        res.json([info["address"], info["privateKey"]]);
    })

    .get('/updatenodelist/', async (req, res) => {
        const list = await bc.getNodelistIDS();
        res.json(list);
    })

    .get('/updatelistBlocks/', async (req, res) => {
        const info = bc.getBlockslistNUMBERS();
        res.json(info);
    })

    .get('/getblockinfo/:blocknumber', async (req, res) => {
        const info = await bc.getBlockInfo(req.params.blocknumber);
        res.json(info);
    })

    .get('/maketransaction/:jsonInfo', async (req, res) => {
        const receipt = await bc.createTransaction(req.params.jsonInfo);
        res.json(receipt);
    })

    /** Buy **/

    .get('/getreferences/', async (req, res) => {
        const Ids = await EventsModule.GetAvailableRefs();
        res.json(Ids);
    })

    .get('/getrefinfo/:id/:privateKey', async (req, res) => {
        let product = await EventsModule.GetRef(req.params.id);
        product = product[0].returnValues;
        const actualPrice = await bc.getCurrentPrice(req.params.privateKey, req.params.id);
        product["actualPrice"] = actualPrice;
        res.json(product);
    })

    .get('/getboughtdata/:address', async (req, res) => {
        const Ids = await EventsModule.GetBoughtRefs(req.params.address);
        res.json(Ids);
    })

    .get('/buy/:id/:privateKey', async (req, res) => {
        let product = await EventsModule.GetRef(req.params.id);
        let result = await bc.buyProduct(req.params.id, product, req.params.privateKey);
        if (result === "error") {
            res.json(result);
        } else {
            res.json(product[0]);
        }
    })


    /** Sell **/
    .get('/sellNewProduct/:json', async (req, res) => {
        let receipt = await bc.sellItem(req.params.json);
        res.json(receipt);
    })

    .get('/ongoingSales/:address', async (req, res) => {
        let Ids = await EventsModule.GetSoldRefs(req.params.address); // TODO: Verify FUNCTION HERE TO GET REFERENCES
        res.json(Ids);
    })

    .get('/manageId/:id/:privateKey', async (req, res) => {
        const result = await bc.manageID(req.params.id, req.params.privateKey);
        // result = [product, total_clients, num_clients_step1, num_clients_step2]
        res.json(result);
    })

    .get('/sendCryptedK2/:id/:privateKey', async (req, res) => {
        let result = await bc.sendCryptedK2(req.params.id, req.params.privateKey);
        // result = [num, done]
        res.json(result);
    })


    /** Close the server **/

    .get('/closeserver', function (req, res) {
        res.render('closeServer.ejs');
        server.close(() => {
            console.log("Server closed.");
        });
    })

    /** Redirection to home if the page is not found **/
    .use(function (req, res) {
        res.redirect('/');
    });

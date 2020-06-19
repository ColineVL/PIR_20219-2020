const express = require('express');
const bc = require('./js/blockchain');
const EventsModule = require('./js/EventsModule');
// const crypto = require('./js/CryptoModule');
// const readwrite = require('./js/ReadWriteModule');


/********************************
 * Defining Database N.B : will destruct if server is closed...
 ********************************/
var DiffieSchema = { // Schema for storing Diffie-H keys
    refId: "", // Id of the reference for which this applies
    PubDH: "", // Public key of Diffie-h
    PrivDH: "", // Private key of Diffie-h
    Pub_Other: "", // Public key of other individual
};
var Reference_ClientSchema = { // Schema for storing reference information for a Client (keys and messages.)
    public_key: "", // User ethereum public key
    refId: "", // Id of the reference for which this applies
    KxorK2: "", // KxorK2 provided by the seller
    K2: "", // K2 provided later by the seller
};
var Reference_SellerSchema = { // Schema for storing reference information for a Seller (keys and messages.)
    public_key: "", // User ethereum public key
    refId: "", // Id of the reference for which this applies
    K: "", // Primary key used to encrypt the info
    K2: [],     // a mapping between client addresses and the hashes to send them
};

const Diffie = Object.create(DiffieSchema);
const Reference_Seller = Object.create(Reference_SellerSchema);
const Reference_Client = Object.create(Reference_ClientSchema);

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
        const account = await bc.getAccount(req.params.privateKey);
        res.json(account);
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

    .get('/getbalance/:addressToCheck', async (req, res) => {
        const bal = await bc.getBalance(req.params.addressToCheck);
        res.json(bal);
    })

    .get('/newaccount/', async (req, res) => {
        const info = await bc.createNewAccount();
        res.json([info["address"], info["privateKey"]]);
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

    .get('/getrefinfo/:id', async (req, res) => {
        const product = Ids[id];
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
        let result = await bc.sellItem(req.params.json);
        res.json(result);
    })

    .get('/ongoingSales/:address', async (req, res) => {
        let Ids = await EventsModule.GetSoldRefs(req.params.address); // TODO: Verify FUNCTION HERE TO GET REFERENCES
        res.json(Ids);
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

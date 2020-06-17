const express = require('express');
const session = require('cookie-session'); // Charge le middleware de sessions
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const bc = require('./js/blockchain');
const transactions = require('./js/SignedTransactionModule');
const crypto = require('./js/CryptoModule');
const EventsModule = require('./js/EventsModule');
const readwrite = require('./js/ReadWriteModule');



/********************************
 * Goal : delete this
 ********************************/
// const Web3 = require('web3');
// const Admin =require('web3-eth-admin').Admin;
//
// const SignedTransaction = require('./js/SignedTransactionModule');
// /* Providers */
// const provider = 'http://192.168.33.115:8545';
// const web3 = new Web3(new Web3.providers.HttpProvider(provider));
// const web3ws = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.33.115:8546'));
//
// /*Loading contract */
// let abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"publicKey","type":"uint256"}],"name":"NewClient","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"contractEndTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"publicKey","type":"uint256"}],"name":"NewDataReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"bytes32","name":"encryptedKeyHash","type":"bytes32"}],"name":"encryptedKeyHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"raiseDisputeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":false,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"withdrawRefund","type":"event"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"uint256","name":"_publicKey","type":"uint256"}],"name":"buy_reference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_contractEndTime","type":"uint256"},{"internalType":"uint256","name":"_publicKey","type":"uint256"}],"name":"createDataReference","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dataReferences","outputs":[{"internalType":"uint256","name":"referenceId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"referenceKey","type":"uint256"},{"internalType":"uint256","name":"contractEndTime","type":"uint256"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"bool","name":"withdrawnFunds","type":"bool"},{"internalType":"uint256","name":"clientsDispute","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"raiseDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setDisputePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_encryptedKeyHash","type":"bytes32"}],"name":"setEncryptedHashedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawDisputeFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}]
// ; //TODO: current abi :Provider
// const contract = new web3.eth.Contract(abi,'0x9B8397f1B0FEcD3a1a40CdD5E8221Fa461898517'); //TODO give correct address when available
// const contractws = new web3ws.eth.Contract(abi,'0x9B8397f1B0FEcD3a1a40CdD5E8221Fa461898517');; //TODO give correct address when available
//
//
//
// const options = {
//     defaultAccount: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
//     defaultBlock: 'latest',
//     defaultGas: 1,
//     defaultGasPrice: 0,
//     transactionBlockTimeout: 50,
//     transactionConfirmationBlocks: 24,
//     transactionPollingTimeout: 480,
// };
// const admin = new Admin(provider, null, options);

/********************************
 * Defining Database N.B : will destruct if server is closed...
 ********************************/
var DiffieSchema = { // Schema for storing Diffie-H keys
    public_key:  "", // User ethereum public key
    refId: "", // Id of the reference for which this applies
    PubDH:   "", // Public key of Diffie-h
    PrivDH: "", // Private key of Diffie-h
    Pub_Other: "", // Public key of other individual
};
var Reference_ClientSchema = { // Schema for storing reference information for a Client (keys and messages.)
    public_key: "", // User ethereum public key
    refId: "", // Id of the reference for which this applies
    KxorK2 :   "", // KxorK2 provided by the seller
    K2: "", // K2 provided later by the seller
};
var Reference_SellerSchema = { // Schema for storing reference information for a Seller (keys and messages.)
    public_key:  "", // User ethereum public key
    refId: "", // Id of the reference for which this applies
    K: "", // Primary key used to encrypt the info
    K2:  [],     // a mapping between client addresses and the hashes to send them
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
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

let Account = undefined;
let prime = crypto.GetPrime(1024);

app.use('/public', express.static(__dirname + '/public'))

    /* Home view */
    .get('', async (req, res) => {
        if (Account) {
            let funds = await bc.getBalance(Account.address);
            res.render('homeClient.ejs',{account : Account, funds: funds});
        } else {
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
            // let account = web3.eth.accounts.privateKeyToAccount(req.body.prKey);
            let account = await bc.getAccount(req.body.prKey);
            Account = account;
            res.redirect(''); // Redirecting home to confirm connection
        }
            catch(err) { // If an error is raised, try reconnecting
                console.log(typeof err)
                console.log(typeof err == "object")
                console.log(Object.keys(err))
                 res.render('ConnexionForm.ejs', {error : err, account : Account});
            };
    })

    /************************************  BUYER PART ***************************/

    /* Interface for a buyer */
    .get('/BuyerMenu', async (req, res) => {
        if (Account) {
            let funds = await bc.getBalance(Account.address)
            res.render('BuyerMenu.ejs',{account : Account, funds: funds});
        } else{
            res.render('BuyerMenu.ejs',{account : Account});
        }
    })

    /************ Buy ************/

    /* Availabe References to buy */
    .get('/ForSale', async (req, res) => {
        let Ids =await EventsModule.GetAvailableRefs(); // TODO: Verify FUNCTION HERE TO GET REFERENCES

        res.render('ForSale.ejs',{account : Account, Ids: Ids});
    })

    /* See a specific reference */
    .get('/ProductId/', async (req, res) => {
        const id = req.query.id ;
        let product = await EventsModule.GetRef(id)

        res.render('Product.ejs', {product: product[0]});
    })

    /* Buy a specific reference */
    .get('/Buy/', async (req, res) => {
        if (Account) {
            const id = req.query.id ;
            let product = await EventsModule.GetRef(id)
            const keys = crypto.DiffieHellmanGenerate(prime);
            /* Updating object to write and save */
            Diffie.PrivDH = keys[0];
            Diffie.PubDH = keys[1];
            Diffie.public_key = Account.address;
            Diffie.refId =id
            await readwrite.Write(id.toString() + '_' + Account.address.toString() +'.txt',JSON.stringify(Diffie));

            const receipt = await transactions.BuyReference(Account,product[0],Diffie.PubDH);
            console.log(receipt);
            res.render('Product.ejs', {product: product[0]});
        } else {
            res.render('homeClient.ejs',{account : Account});
        }

    })
    /************ Bought ************/
    /* Interface for a buyer */
    .get('/Bought', async (req, res) => {
        if (Account) {
            let Ids =await EventsModule.GetBoughtRefs(Account); // TODO: Verify FUNCTION HERE TO GET REFERENCES
            res.render('BoughtInfo.ejs',{Ids: Ids});
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })


    /************************************  SELLER PART ***************************/
    /* Seller Menu */
    .get('/SellerMenu', async (req, res) => {
        if (Account) {
            let funds = await bc.getBalance(Account.address)
            res.render('SellerMenu.ejs',{account : Account, funds: funds});
        } else{
            res.render('SellerMenu.ejs',{account : Account});
        }
    })

    /* Sell a new product */
    .get('/SellNew', async (req, res) => {
        res.render('SellNew.ejs',{account : Account});
    })






    /* If user asks for an innexistant view, we redirect him to the homepage */
    .use(function(req, res, next){
        res.redirect('/');
    })

    .listen(8086);

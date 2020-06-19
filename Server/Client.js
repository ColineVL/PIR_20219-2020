const express = require('express');
const session = require('cookie-session'); // Charge le middleware de sessions
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const bc = require('./js/blockchain');
// const transactions = require('./js/SignedTransactionModule');
// const crypto = require('./js/CryptoModule');
const EventsModule = require('./js/EventsModule');
// const readwrite = require('./js/ReadWriteModule');



// /********************************
//  * Defining Database N.B : will destruct if server is closed...
//  ********************************/
// var DiffieSchema = { // Schema for storing Diffie-H keys
//     refId: "", // Id of the reference for which this applies
//     PubDH:   "", // Public key of Diffie-h
//     PrivDH: "", // Private key of Diffie-h
//     Pub_Other: "", // Public key of other individual
// };
// var Reference_ClientSchema = { // Schema for storing reference information for a Client (keys and messages.)
//     public_key: "", // User ethereum public key
//     refId: "", // Id of the reference for which this applies
//     KxorK2 :   "", // KxorK2 provided by the seller
//     K2: "", // K2 provided later by the seller
// };
// var Reference_SellerSchema = { // Schema for storing reference information for a Seller (keys and messages.)
//     public_key:  "", // User ethereum public key
//     refId: "", // Id of the reference for which this applies
//     K: "", // Primary key used to encrypt the info
//     K2:  [],     // a mapping between client addresses and the hashes to send them
// };

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
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

let Account = undefined;

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

    /************ Buy New ************/

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
            let result = await bc.buyProduct(id, product, Account.privateKey);
            if (result === "error") {
                res.redirect('/BuyError');
            } else {
                res.render('Product.ejs', {product: product[0]});
            }
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })

    /*If something has gone wrong..*/
    .get('/BuyError', async (req, res) => {
        res.render('BuyError.ejs');
    })

    /************ Ongoing Buys ************/

    /*Information and management of Ongoing transactions buyer-side ..*/
    .get('/OngoingBuy', async (req, res) => {
        if (Account) {
            let Ids = await EventsModule.GetBoughtRefs(Account.address);
            let IdsDone = []; // TODO: Still no idea how to do this

            res.render('OngoingBuys.ejs',{Ids: Ids, IdsDone: IdsDone});
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })

    /*Information and management of Ongoing transactions buyer-side ..*/
    .get('/ManageIdBuyer', async (req, res) => {
        if (Account) {
            let Id = req.query.id;
            let product = await EventsModule.GetRef(Id)

            let eventPhase1 = await EventsModule.GetEncryptedKeySentSpecific(Id, Account.address)
            let eventPhase2 = await EventsModule.GetKeySentSpecific(Id,Account.address)
            let num_event2 = eventPhase2.length
            let num_event1 = eventPhase1.length -num_event2 // Because in that case it is already done
            res.render('ManageBuy.ejs',{Id: Id, product:product[0], num_event1:num_event1, num_event2:num_event2});
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })
    /*Information and management of Ongoing transactions buyer-side ..*/
    .get('/SendClientHash', async (req, res) => {
        if (Account) {
            let Id = req.query.id;
            let product = await EventsModule.GetRef(Id)

            let eventPhase1 = await EventsModule.GetEncryptedKeySentSpecific(Id, Account.address)
            let eventPhase2 = await EventsModule.GetKeySentSpecific(Id,Account.address)
            res.render('ManageBuy.ejs',{Id: Id, product:product[0], eventPhase1:eventPhase1, eventPhase2:eventPhase2});
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })

    /************ Bought ************/

    /* Interface for a buyer */
    .get('/Bought', async (req, res) => {
        if (Account) {
            let Ids =await EventsModule.GetBoughtRefs(Account.address); // TODO: Verify FUNCTION HERE TO GET REFERENCES
            res.render('BoughtInfo.ejs',{Ids: Ids});
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })


    /************************************  SELLER PART ***************************/

    /********* Global part *********/
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

    .post('/PostProduct', async(req, res) =>{
        if (Account) {
            /* Info to be sent*/
            const price = req.body.price ;
            const endTime= req.body.contractEndTime ;
            const description = req.body.description ;
            let jsonInfo = {"price":price, "contractEndTime":endTime, "descr":description, "privateKey":Account.privateKey};

            let result = await bc.sellItem(jsonInfo);
            console.log(result);
            if (result === "ok") {
                res.redirect('/ForSale');
            } else {
                res.redirect('/SellError');
            }
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })

    /********* Need Actions ***********/

    /*See ongoing sales*/
    .get('/OngoingSales', async (req, res) => {
        if (Account) {
            let Ids =await EventsModule.GetSoldRefs(Account.address); // TODO: Verify FUNCTION HERE TO GET REFERENCES
            let IdsDone = [];
            res.render('OngoingSales.ejs',{Ids: Ids, IdsDone: IdsDone});
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })

    /* Interface to manage a certain id being sold*/
    .get('/ManageId/', async (req, res) => {
        if (Account) {
            const id = req.query.id ;
            const [product, total_clients, num_clients_step1, num_clients_step2] = await bc.manageID(id, Account.privateKey);
            // TODO finish coding function.. to get number of disputes
            res.render('ManageId.ejs', {product: product[0], Id: id, total_clients: total_clients, num_clients_step1: num_clients_step1, num_clients_step2: num_clients_step2});
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })

    /* Interface to sned K2 keys to the ones who have'nt got it yet*/
    .get('/SendCryptedK2/', async (req, res) => {
        if (Account) {
            const id = req.query.id ;
            let [num, done] = await bc.sendCryptedK2(id, Account.privateKey);
            res.render('SentToClients.ejs', {num: num, done: done});
        } else {
            res.render('homeClient.ejs',{account : Account});
        }
    })

    /*If something has gone wrong..*/
    .get('/SellError', async (req, res) => {
        res.render('SellError.ejs');
    })

    /* If user asks for an innexistant view, we redirect him to the homepage */
    .use(function(req, res, next){
        res.redirect('/');
    })

    .listen(8086);
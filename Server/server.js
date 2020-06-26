const express = require('express');
const session = require('cookie-session'); // Charge le middleware de sessions
// const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const bc = require('./js/blockchain');
const EventsModule = require('./js/EventsModule');


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

    /************ Sign in and out ************/

    .get('/connect/:privateKey', async (req, res) => {
        try {
            req.session.Account = await bc.getAccount(req.params.privateKey);
            const address = req.session.Account.address;
            const balance = await bc.getBalance(address);
            res.json({address: address, balance: balance});
        } catch (e) {
            res.status(500).json(e.message);
        }
    })

    .get('/signout', function (req, res) {
        req.session.Account = undefined;
    })

    .get('/newaccount/', async (req, res) => {
        const info = await bc.createNewAccount();
        res.json([info["address"], info["privateKey"]]);
    })

    /************ Nodes and blocks ************/

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

    /************ For sale products ************/

    .get('/getreferences/', async (req, res) => {
        try {
            const Ids = await EventsModule.GetAvailableRefs();
            res.json(Ids);
        } catch (e) {
            res.status(500).json(e.message);
        }
    })

    .get('/getrefinfo/:id', async (req, res) => {
        try {
            let product = await EventsModule.GetRef(req.params.id);
            res.json(product);
        } catch (e) {
            res.status(500).json(e.message);
        }
    })

    .get('/getPrice/:id', async (req, res) => {
        try {
            const actualPrice = await bc.getCurrentPrice(req.session.Account, req.params.id);
            res.json(actualPrice);
        } catch (e) {
            res.status(500).json(e.message);
        }
    })

    /************ Bought products ************/

    .get('/getboughtdata/', async (req, res) => {
        try {
            const Ids = await EventsModule.GetBoughtRefs(req.session.Account);
            res.json(Ids);
        } catch (e) {
            res.status(500).json(e.message);
        }
    })

    .get('/getboughtiteminfo/:id', async (req, res) => {
        try {
            let product = await EventsModule.GetRef(req.params.id);
            product = product[0].returnValues;
            res.json(product);
        } catch (e) {
            res.status(500).json(e.message);
        }
    })

    /************ Buy a product ************/

    .get('/buy/:id', async (req, res) => {
        try {
            let product = await EventsModule.GetRef(req.params.id);
            await bc.buyProduct(req.params.id, req.session.Account);
            res.json(product[0]);
        } catch (e) {
            res.status(500).json(e.message);
        }
    })

    /************ Ongoing buys ************/

    .get('/ongoingBuys/', async (req, res) => {
        try {
            let Ids = await EventsModule.GetBoughtRefs(req.session.Account.address);
            res.json(Ids);
        } catch (e) {
            res.status(500).json(e.message);
        }
    })

    .get('/manageIdBuyer/:id', async (req, res) => {
        try {
            let result = await bc.manageIDBuyer(req.params.id, req.session.Account);
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(500).json(e.message);
        }
    })

    .get('/sendBuyerHash/:id', async (req, res) => {
        try {
            await bc.sendClientHash(req.params.id, req.session.Account);
            res.json(req.params.id);
        } catch (e) {
            console.log(e);
            res.status(500).json(e.message);
        }
    })

    .get('/computeK/:id', async (req, res) => {
        try {
            const K = await bc.ComputeK(req.params.id, req.session.Account);
            res.json({id: req.params.id, K: K});
        } catch (e) {
            console.log(e);
            res.status(500).json(e.message);
        }
    })

    .get('/dispute/:id', async (req, res) => {
        try {
            let [alreadyEncoded, possibleRefund, alreadyDisputed] = await bc.DisputeInfoClient(req.params.id, req.session.Account);
            res.json({
                id: req.params.id,
                alreadyEncoded: alreadyEncoded,
                possibleRefund: possibleRefund,
                alreadyDisputed: alreadyDisputed,
            });
        } catch (e) {
            console.log(e);
            res.status(500).json(e.message);
        }
    })

    .get('/confirmDispute/:id', async (req, res) => {
        try {
            let funds = await bc.Dispute(req.params.id, req.session.Account);
            res.json({id: req.params.id, funds: funds});
        } catch (e) {
            console.log(e);
            res.status(500).json(e.message);
        }
    })

    /************ Sell a product ************/

    .get('/sellNewProduct/:json', async (req, res) => {
        try {
            let receipt = await bc.sellItemColine(req.params.json, req.session.Account);
            res.json(receipt);
        } catch (e) {
            console.log(e);
            res.status(500).json(e.message);
        }
    })

    /************ Ongoing sales ************/

    .get('/ongoingSales/', async (req, res) => {
        try {
            let Ids = await EventsModule.GetSoldRefs(req.session.Account); // TODO: Verify FUNCTION HERE TO GET REFERENCES
            res.json(Ids);
        } catch (e) {
            res.status(500).json(e.message);
        }
    })

    .get('/manageIdSeller/:id', async (req, res) => {
        try {
            const result = await bc.manageID(req.params.id, req.session.Account);
            // result = [product, total_clients, num_clients_step1, num_clients_step2, Key]
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(500).json(e.message);
        }
    })

    /** Upload a new TLE to the reference **/
    .get('/uploadNewTLE/:json', async (req, res) => {
        try {
            // A toi Ziad
            const result = req.params.json;
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(500).json(e.message);
        }
    })

    /** Seller step 1 **/
    .get('/sendEncodedEncryptedKey/:id', async (req, res) => {
        try {
            let result = await bc.sendEncryptedEncodedKey(req.params.id, req.session.Account);
            // result = [num, done]
            res.json(result);
        } catch (e) {
            console.log(e);

            res.status(500).json(e.message);
        }
    })

    /** Seller step 2 **/
    .get('/sendDecoderKey/:id', async (req, res) => {
        try {
            let result = await bc.sendDecoderKey(req.params.id, req.session.Account);
            // result = [num, done]
            res.json(result);
        } catch (e) {
            console.error(e);
            res.status(500).json(e.message);
        }
    })

    /** Seller release key **/
    .get('/postRefKey/:id', async (req, res) => {
        try {
            let result = await bc.sendReferenceKey(req.params.id, req.session.Account);            // result = [num, done]
            res.json(result);
        } catch (e) {
            console.error(e);
            res.status(500).json(e.message);
        }
    })

    /** Seller withdraw funds **/
    .get('/withdrawFunds/:id', async (req, res) => {
        try {
            let funds = await bc.withdrawFundsProvider(req.params.id, req.session.Account);
            res.json({id: req.params.id, funds: funds});
        } catch (e) {
            throw e;
        }
    })

    .get('/maketransaction/:jsonInfo', async (req, res) => {
        let receipt = await bc.createTransaction(req.params.jsonInfo);
        res.json(receipt);
    })



    /************ Close the server ************/

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


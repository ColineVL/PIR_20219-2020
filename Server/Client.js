const express = require('express');
const session = require('cookie-session'); // Charge le middleware de sessions
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const bc = require('./js/blockchain');
// const transactions = require('./js/SignedTransactionModule');
// const crypto = require('./js/CryptoModule');
const EventsModule = require('./js/EventsModule');
const readwrite = require('./js/ReadWriteModule');

// let prime = crypto.GetPrime(32);
// const Web3 = require('web3');
// const provider = 'http://192.168.33.115:8545';
// const web3 = new Web3(new Web3.providers.HttpProvider(provider))

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

app.use(session({
    'secret': '343ji43j4n3jn4jk3n'
}));


// let Account = undefined;
app.use('/public', express.static(__dirname + '/public'))


    /* Home view */
    .get('', async (req, res) => {
        if (req.session.Account) {
            let funds = await bc.getBalance(req.session.Account.address);
            res.render('homeClient.ejs', {account: req.session.Account, funds: funds});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /* Form view to connect with private key*/
    .get('/ConnexionForm', function (req, res) {
        res.render('ConnexionForm.ejs', {account: req.session.Account});
    })
    /* Emulating Signout by deleting account*/
    .get('/Signout', function (req, res) {
        req.session.Account = undefined;
        res.redirect('/');
    })

    /* Handler to process the connection */
    .post('/Connexion/', async (req, res) => {
        try {
            // let account = web3.eth.accounts.privateKeyToAccount(req.body.prKey);
            req.session.Account = await bc.getAccount(req.body.prKey);
            // Account = account;
            res.redirect(''); // Redirecting home to confirm connection
        } catch (err) { // If an error is raised, try reconnecting
            res.render('ConnexionForm.ejs', {error: err, account: req.session.Account});
        }
        ;
    })

    /************************************  BUYER PART ***************************/

    /* Interface for a buyer */
    .get('/BuyerMenu', async (req, res) => {
        if (req.session.Account) {
            let funds = await bc.getBalance(req.session.Account.address)
            res.render('BuyerMenu.ejs', {account: req.session.Account, funds: funds});
        } else {
            res.render('BuyerMenu.ejs', {account: req.session.Account});
        }
    })

    /************ Buy New ************/

    /* Available References to buy */
    .get('/ForSale', async (req, res) => {
        let Ids = await EventsModule.GetAvailableRefs(); // TODO: Verify FUNCTION HERE TO GET REFERENCES
        res.render('ForSale.ejs', {account: req.session.Account, Ids: Ids})//, price:price, endDate:endDate});
    })

    /* See a specific reference */
    .get('/ProductId/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            let product = await EventsModule.GetRef(id)
            let price = await bc.getCurrentPrice(req.session.Account, id)

            res.render('Product.ejs', {product: product[0], price: price});
        } else {
            res.render('BuyerMenu.ejs', {account: req.session.Account});
        }
    })

    /* Buy a specific reference */
    .get('/Buy/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            let product = await EventsModule.GetRef(id)
            let result = await bc.buyProduct(id, req.session.Account);
            if (result === "error") {
                res.redirect('/BuyError');
            } else {
                res.render('Bought.ejs', {product: product[0], price: result});
            }
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /*If something has gone wrong..*/
    .get('/BuyError', async (req, res) => {
        res.render('BuyError.ejs');
    })

    /************ Ongoing Buys ************/

    /*Information and management of Ongoing transactions buyer-side ..*/
    .get('/OngoingBuy', async (req, res) => {
        if (req.session.Account) {
            let Ids = await EventsModule.GetBoughtRefs(req.session.Account.address);
            let IdsDone = []; // TODO: Still no idea how to do this

            res.render('OngoingBuys.ejs', {Ids: Ids, IdsDone: IdsDone});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /*Information and management of Ongoing transactions buyer-side ..*/
    .get('/ManageIdBuyer', async (req, res) => {
        if (req.session.Account) {
            let Id = req.query.id;
            let product = await EventsModule.GetRef(Id)

            let eventPhase1 = await EventsModule.GetEncryptedKeySentSpecific(Id, req.session.Account.address)
            let eventPhase2 = await EventsModule.GetKeySentSpecific(Id, req.session.Account.address)

            let num_event2 = eventPhase2.length
            let num_event1 = eventPhase1.length - num_event2 // Because in that case it is already done
            res.render('ManageBuy.ejs', {Id: Id, product: product[0], num_event1: num_event1, num_event2: num_event2});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })
    /*Send the hash I compute to the provider ..*/
    .get('/SendClientHash', async (req, res) => {
        if (req.session.Account) {
            let id = req.query.id;
            let done = await bc.sendClientHash(id, req.session.Account.privateKey)

            res.render('SentHash.ejs', {done: done});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /*Send a fake hash I compute to the provider ..*/
    .get('/SendClientHashMalicious', async (req, res) => {
        if (req.session.Account) {
            let id = req.query.id;
            let done = await bc.sendClientHashMalicious(id, req.session.Account.privateKey)

            res.render('SentHash.ejs', {done: done});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /*Send the hash I compute to the provider ..*/
    .get('/computeK', async (req, res) => {
        if (req.session.Account) {
            let id = req.query.id;

            let K = await bc.ComputeK(id, req.session.Account.privateKey)
            res.render('KeyClient.ejs', {K: K, id: id});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /*Confirm Dispute before raising*/
    .get('/DisputeConfirmation', async (req, res) => {
        if (req.session.Account) {
            let id = req.query.id;

            let info = await bc.DisputeInfoClient(id, req.session.Account.privateKey);
            res.render('DisputeConfirmation.ejs', {id: id, info:info});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /*Raise a dispute if you think a scam happened, or simply withdraw your money if still possible ..*/
    .get('/Dispute', async (req, res) => {
        if (req.session.Account) {
            let id = req.query.id;
            // TODO ADD to received funds, the real funds received: maybe received insurance deposit as well...
            let info = await bc.Dispute(id, req.session.Account.privateKey)
            res.render('Dispute.ejs',{id:id,info:info});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })


    /************ Bought ************/

    /* Interface for a buyer */
    .get('/Bought', async (req, res) => {
        if (req.session.Account) {
            let Ids = await EventsModule.GetBoughtRefs(req.session.Account); // TODO: Verify FUNCTION HERE TO GET REFERENCES
            res.render('BoughtInfo.ejs', {Ids: Ids});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })


    /************************************  SELLER PART ***************************/

    /********* Global part *********/
    /* Seller Menu */
    .get('/SellerMenu', async (req, res) => {
        if (req.session.Account) {
            let funds = await bc.getBalance(req.session.Account.address)
            res.render('SellerMenu.ejs', {account: req.session.Account, funds: funds});
        } else {
            res.render('SellerMenu.ejs', {account: req.session.Account});
        }
    })
    .get('/ProductInfoSeller', async (req, res) => {
        if (req.session.Account) {
            let id = req.query.id;
            let K = await readwrite.Read_K(__dirname + '/Database/SellerInfo' + id.toString() + '_' + req.session.Account.address.toString() + '.txt')

            let num = await bc.getClients(req.session.Account, id)


            res.render('ProductInfoSeller.ejs', {num: num.length, K: K, id: id});
        } else {
            res.render('SellerMenu.ejs', {account: req.session.Account});
        }
    })


    /* Sell a new product */
    .get('/SellNew', async (req, res) => {
        res.render('SellNew.ejs', {account: req.session.Account});
    })

    .post('/PostProduct', async (req, res) => {
        if (req.session.Account) {
            /* Info to be sent*/
            const initialPrice = req.body.price;
            const durationDays = req.body.DurationDays;
            const durationHours = req.body.DurationHours;
            const durationMinutes = req.body.DurationMinutes;
            const description = req.body.description;
            const minData = req.body.minData;
            const depreciationType = req.body.depreciationType;
            const deposit = req.body.insuranceDeposit;
            // TODO Add to JSON
            let jsonInfo = {
                "price": initialPrice,
                "durationDays": durationDays,
                "descr": description,
                "privateKey": req.session.Account.privateKey
            };

            let result = await bc.sellItemZiad(initialPrice, description, durationDays, durationHours, durationMinutes, req.session.Account, minData, depreciationType, deposit);

            if (result[0]) {
                res.redirect('/ProductInfoSeller?id=' + result[1]);
            } else {
                res.redirect('/SellError');
            }
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /********* Need Actions ***********/

    /*See ongoing sales*/
    .get('/OngoingSales', async (req, res) => {
        if (req.session.Account) {
            let Ids = await EventsModule.GetSoldRefs(req.session.Account); // TODO: Verify FUNCTION HERE TO GET REFERENCES
            let IdsDone = [];
            res.render('OngoingSales.ejs', {Ids: Ids, IdsDone: IdsDone});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /* Interface to manage a certain id being sold*/
    .get('/ManageId/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            const [product, total_clients, num_clients_step1, num_clients_step2, Key] = await bc.manageID(id, req.session.Account);
            // TODO finish coding function.. to get number of disputes
            res.render('ManageId.ejs', {
                product: product[0],
                Id: id,
                total_clients: total_clients,
                num_clients_step1: num_clients_step1,
                num_clients_step2: num_clients_step2,
                Key: Key,
            });
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /* Interface to send crypted version of K2 keys to the ones who haven't got it yet*/
    .get('/SendEncryptedEncodedKey/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            let [num, done] = await bc.sendEncryptedEncodedKey(id, req.session.Account.privateKey);
            res.render('SentToClients.ejs', {num: num, done: done});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /* Malicious version, see comment for real version*/
    .get('/SendEncryptedEncodedKeyMalicious/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            let [num, done] = await bc.sendEncryptedEncodedKeyMalicious(id, req.session.Account.privateKey);
            res.render('SentToClients.ejs', {num: num, done: done});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })


    /* Interface to send K2 keys to the ones who responded with a hash*/
    .get('/SendDecoderKey/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            let [num, done] = await bc.sendDecoderKey(id, req.session.Account.privateKey);
            res.render('SentK2.ejs', {num: num, done: done});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })
    /* Malicious Version, still verifies hashes thought*/
    .get('/SendDecoderKeyMalicious/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            let [num, done] = await bc.sendDecoderKeyMalicious(id, req.session.Account.privateKey);
            res.render('SentK2.ejs', {num: num, done: done});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /* Interface topublicly post the reference Key K*/
    .get('/PostRefKey/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            let result = await bc.sendReferenceKey(id, req.session.Account.privateKey);
            res.render('SentRefKey.ejs', {id: id, receipt: result[0], refKey:result[1]});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /* Malicious Version K*/
    .get('/PostRefKeyMalicious/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            let result = await bc.sendReferenceKeyMalicious(id, req.session.Account.privateKey);
            res.render('SentRefKey.ejs', {id: id, receipt: result[0], refKey:result[1]});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /* Malicious Version K*/
    .get('/WithdrawFundsProvider/', async (req, res) => {
        if (req.session.Account) {
            const id = req.query.id;
            let result = await bc.withdrawFundsProvider(id, req.session.Account.privateKey);
            res.render('Withdrawn.ejs', {id: id, result: result[0]});
        } else {
            res.render('homeClient.ejs', {account: req.session.Account});
        }
    })

    /*If something has gone wrong..*/
    .get('/SellError', async (req, res) => {
        res.render('SellError.ejs');
    })

    /* If user asks for an innexistant view, we redirect him to the homepage */
    .use(function (req, res, next) {
        res.redirect('/');
    })

    .listen(8087);
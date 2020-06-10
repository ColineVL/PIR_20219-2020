var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var bc = require('./js/blockchain');


var app = express();
// Load the css folder
app.use(express.static(__dirname + '/css'));
// Load the js files
app.use(express.static(__dirname + '/js'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


/* On utilise les sessions */
app.use('/public', express.static(__dirname + '/public'))

    .get('', function(req, res) {
        let listetest = ["yo", "bla", "blu"];
        res.render('home.ejs', {listetest:listetest});
    })

    // TODO supprimer, c'est un test
    .get('/Test/', function(req, res) {
        let bla = Date.now();
        //res.render('test.ejs', {bla:bla});
    })

    .get('/Test2/:id', async(req, res) => {
        res.json(req.params.id + 2);
        console.log("YESSS" + req.params.id + 2);
        //res.render('test.ejs', {bla:bla});
    })

    .get('/updatenodelist/', async(req, res) => {
        let liste = bc.getNodelistIDS();
        res.json(liste);
    })

    /* On redirige vers home si la page demandée n'est pas trouvée */
    .use(function(req, res, next){
        res.redirect('/');
    })

    .listen(8080);

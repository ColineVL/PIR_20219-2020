var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();


/* On utilise les sessions */
app.use(session({secret: 'todotopsecret'}))


    /* S'il n'y a pas de todolist dans la session,
    on en crée une vide sous forme d'array avant la suite */
    .use(function(req, res, next){
        if (typeof(req.session.todolist) == 'undefined') {
            req.session.todolist = [];
        }
        next();
    })

    /* On affiche la todolist et le formulaire */
    .get('/todo', function(req, res) {
        res.render('todo.ejs', {todolist: req.session.todolist});
    })

    /* On ajoute un élément à la todolist */
    .post('/todo/ajouter/', urlencodedParser, function(req, res) {
        if (req.body.newtodo != '') {
            req.session.todolist.push(req.body.newtodo);
        }
        res.redirect('/todo');
    })

    /* Supprime un élément de la todolist */
    .get('/todo/supprimer/:id', function(req, res) {
        if (req.params.id != '') {
            req.session.todolist.splice(req.params.id, 1);
        }
        res.redirect('/todo');
    })

    /* On redirige vers la todolist si la page demandée n'est pas trouvée */
    .use(function(req, res, next){
        res.redirect('/todo');
    })

    .listen(8080);

//
// app.get('/', function(req, res) {
//     res.setHeader('Content-Type', 'text/plain');
//     res.send('Vous êtes à l\'accueil, que puis-je pour vous ?');
// });
//
// app.get('/sous-sol', function(req, res) {
//     res.setHeader('Content-Type', 'text/plain');
//     // res.status(404).send('Page introuvable !');
//     res.send('Vous êtes dans la cave à vins, ces bouteilles sont à moi !');
// });
//
// app.get('/etage/:etagenum/chambre', function(req, res) {
//     res.render('chambre.ejs', {etage: req.params.etagenum});
// });
//
// app.get('/compter/:nombre', function(req, res) {
//     var noms = ['Robert', 'Jacques', 'David'];
//     res.render('page.ejs', {compteur: req.params.nombre, noms: noms});
// });




// app.listen(8080);
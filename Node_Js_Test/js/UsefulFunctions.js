/** Just tests **/

function geek() {
    var doc = prompt("Please enter some text",
        "GeeksforGeeks");
    if (doc != null) {
        document.getElementById("g").innerHTML =
            "Welcome to " + doc;
    }
};

var myVar = setInterval(myDateTimer, 2000);
function myDateTimer() {
    var d = new Date();
    document.getElementById("date").innerHTML = d.toLocaleTimeString();
};

/** To get a response from the server **/

function loadXMLDoc(page, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("RESULT D'ABORD : " +this.responseText);
            /** Je ne peux pas utiliser responseText si responseType est json **/
            // Ca m'affiche dans la console du navigateur : RESULT D'ABORD : "62"
            // Donc il arrive bien à avoir la réponse du serveur.
            console.log("response : " + typeof this.responseText);
            callback(JSON.parse(this.responseText));
            //return this.responseText;
        }
    };
    xhttp.open("GET", page, true);
    xhttp.send();
};


/** Test of callback functions **/
// En cliquant sur un bouton sur le navigateur, j'exécute la fonction testXML.
function zecallback(param) {
    console.log("dans zecallback");
    document.getElementById("result").innerHTML = param;
};

function testXML(callback) {
    let res = loadXMLDoc("updatenodelist", callback);
};


/** To display a list with <li> **/

function displayList(list) {
    let txt = "";
    list.forEach(function (elt) {
        txt += '<li>' + elt + '</li>';
    });
    return txt;
};


/** Update of the nodelist **/
function zecallback(param) {
    console.log("dans zecallback");
    document.getElementById("result").innerHTML = param;
};

function testXML(callback) {
    let res = loadXMLDoc("updatenodelist", callback);
};


// Attention il va surement me falloir une autre fonction timée pour mettre à jour l'affichage !
var timerUpdateNodelist = setInterval(updateNodesList, 2000);
function callbackNodelist(param) {
    console.log(typeof param);
    param = displayList(param);
    document.getElementById("nodelist").innerHTML = param;
};

function updateNodesList() {
    loadXMLDoc("updatenodelist", callbackNodelist);
};
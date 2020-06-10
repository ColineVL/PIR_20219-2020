function geek() {
    var doc = prompt("Please enter some text",
        "GeeksforGeeks");
    if (doc != null) {
        document.getElementById("g").innerHTML =
            "Welcome to " + doc;
    }
};

/** DEBUT DU PROBLEME 1 **/
// En cliquant sur un bouton sur le navigateur, j'exécute la fonction testXML.
async function testXML() {
    let res = await loadXMLDoc("test2/6");
    console.log("ICI ENSUITE " + res);
    // Ca m'affiche dans la console du navigateur : ICI ENSUITE undefined
    // Et il l'affiche *avant* le RESULT D'ABORD, donc avant que la fonction loadXMLDOC ait fini de tourner et ait renvoyé le résultat.
    document.getElementById("result").innerHTML = res;
};

function loadXMLDoc(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("RESULT D'ABORD : " +this.responseText);
            // Ca m'affiche dans la console du navigateur : RESULT D'ABORD : "62"
            // Donc il arrive bien à avoir la réponse du serveur.
            return this.responseText;
        }
    };
    xhttp.open("GET", page, true);
    xhttp.send();
};
/** FIN DU PROBLEME 1 **/





var myVar = setInterval(myDateTimer, 2000);
function myDateTimer() {
    var d = new Date();
    document.getElementById("date").innerHTML = d.toLocaleTimeString();
};



function displayList(list) {
    let txt = "";
    list.forEach(function (elt) {
        txt += '<li>' + elt + '</li>';
    });
    return txt;
};

// Attention il va surement me falloir une autre fonction timée pour mettre à jour l'affichage !
// var myTimer = setInterval(updateNodesList, 2000);
// function updateNodesList() {
//     let list = loadXMLDoc();
//     list = displayList(list);
//     document.getElementById("g").innerHTML = list;
//}
function updateNodesList() {
    let list = loadXMLDoc("updatenodelist");
    list = displayList(list);
    document.getElementById("nodelist").innerHTML = list;
};
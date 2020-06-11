/** To get a response from the server **/

function loadXMLDoc(page, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", page, true);
    xhttp.send();
};


/** Test of callback functions **/
function zecallback(param) {
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
    document.getElementById("result").innerHTML = param;
};

function testXML(callback) {
    let res = loadXMLDoc("updatenodelist", callback);
};


// Attention il va surement me falloir une autre fonction timée pour mettre à jour l'affichage !
var timerUpdateNodelist = setInterval(updateNodesList, 2000);
function callbackNodelist(param) {
    param = displayList(param);
    document.getElementById("nodelist").innerHTML = param;
};

function updateNodesList() {
    loadXMLDoc("updatenodelist", callbackNodelist);
};

/** Creation of a new account **/
function callbackNewAccount(param) {
    document.getElementById("newaddress").innerHTML = param[0];
    document.getElementById("newprivatekey").innerHTML = param[1];
};

function createNewAccount() {
    loadXMLDoc("newaccount", callbackNewAccount);
};
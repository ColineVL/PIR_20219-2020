/** To get a response from the server **/
function loadXMLDoc(page, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // TODO la ligne suivante sert à des tests
            callback(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", page, true);
    xhttp.send();
};

/** Display functions **/
function displayListBlocks(list) {
    let html = "";
    list.forEach(function (blockNumber) {
        html += "<div onclick=displayBlockInfo(" + blockNumber + ")>" + '<li>' + blockNumber + '</li>' + "</div>";
    });
    return html;
}

function displayListNodes(list) {
    let html = "";
    list.forEach(function (nodeID) {
        html += "<div onclick=displayNodeInfo(" + nodeID + ")>" + '<li>' + nodeID + '</li>' + "</div>";
    });
    // Ici nodeID est bien sous la forme 0x50295... en string

    return html;
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function displayDict(dict) {
    let html = "<table><tbody>";
    for (let key in dict) {
        html += "<tr>";
        html += "<td>" + key.capitalize() + "</td>";
        html += "<td>" + dict[key] + "</td>";
        html += "</tr>";
    }
    html += "</tbody></table>";
    return html;
}


/** Update of the nodelist **/
setInterval(updateNodesList, 1000);

function callbackNodelist(param) {
    param = displayListNodes(param);
    document.getElementById("nodelist").innerHTML = param;
};

function updateNodesList() {
    loadXMLDoc("updatenodelist", callbackNodelist);
};

/** Info about one node **/
function callbackNodeInfo(param) {
    param = displayDict(param);
    document.getElementById("nodeinfo").innerHTML = param;
};

function displayNodeInfo(nodeID) {
    console.log(typeof nodeID + " "  + nodeID);
    // Ici nodeID est sous la forme number 4.98e+153
    addItem(nodeInfoItem);
    loadXMLDoc("getnodeinfo/" + nodeID, callbackNodeInfo);
};

/** Creation of a new account **/
function callbackNewAccount(param) {
    document.getElementById("newaddress").innerHTML = param[0];
    document.getElementById("newprivatekey").innerHTML = param[1];
};

function createNewAccount() {
    loadXMLDoc("newaccount", callbackNewAccount);
};

/** Update of the blocks list **/
setInterval(updateBlocksList, 1000);

function callbackBlockslist(param) {
    param = displayListBlocks(param);
    document.getElementById("blockslist").innerHTML = param;
};

function updateBlocksList() {
    loadXMLDoc("updatelistBlocks", callbackBlockslist);
};

/** Info about one block **/
function callbackBlockInfo(param) {
    param = displayDict(param);
    document.getElementById("blockinfo").innerHTML = param;
};

function displayBlockInfo(blocknumber) {
    addItem(blockInfoItem);
    loadXMLDoc("getblockinfo/" + blocknumber, callbackBlockInfo);
}

/** Get the balance of an account **/
function callbackGetBalance(param) {
    document.getElementById("balance").innerHTML = param;
};

function getBalance() {
    let addressToCheck = prompt("Please enter an address");
    loadXMLDoc("getbalance/" + addressToCheck, callbackGetBalance);
    document.getElementById("address").innerHTML = addressToCheck;
};

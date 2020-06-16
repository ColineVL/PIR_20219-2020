/** Variables **/
let myAccount = "notConnected";
let references;

/** To get a response from the server **/
function loadXMLDoc(page, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", page, true);
    xhttp.send();
}

/** Display functions **/
function displayListBlocks(list) {
    let html = "";
    list.forEach(function (blockNumber) {
        html += "<li onclick=displayBlockInfo(" + blockNumber + ")>" + blockNumber + "</li>";
    });
    return html;
}

function displayListNodes(list) {
    let html = "";
    list.forEach(function (nodeID) {
        html += "<li onclick=displayNodeInfo(" + nodeID + ")>" + nodeID + "</li>";
    });
    // Ici nodeID est bien sous la forme 0x50295... en string

    return html;
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function displayTable(dict) {
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

/********************************
 * Accounts
 ********************************/

/** Load my account **/
function callbackGetMyBalance(param) {
    $("#myAccount_value").html(param);
}

function loadMyAccount() {
    if (myAccount === "notConnected") {
        $('#myAccount_connected').hide();
        $('#myAccount_notConnected').show();
    } else {
        $('#myAccount_notConnected').hide();
        $('#myAccount_connected').show();
        $('#myAccount_address').html(myAccount.address);
        loadXMLDoc("getbalance/" + myAccount.address, callbackGetMyBalance);
    }
}

/** Connection **/
function callbackConnect(account) {
    if (account["error"]) {
        $('#myAccount_message').html(account["error"]);
    } else {
        let address = document.getElementById("myAccount_connection_address").value;
        if (account.address == address) {
            myAccount = account;
            loadMyAccount();
        } else {
            $('#myAccount_message').html("Address and private key don't match. Make sure your address begins with 0x.");
        }
    }
}

function connect() {
    let privateKey = document.getElementById("myAccount_connection_privateKey").value;
    loadXMLDoc("connect/" + privateKey, callbackConnect);
}

function disconnect() {
    myAccount = "notConnected";
    loadMyAccount();
}

/** Creation of a new account **/
function callbackNewAccount(param) {
    $("#newAccount_address").html(param[0]);
    $("#newAccount_privatekey").html(param[1]);
}

function createNewAccount() {
    loadXMLDoc("newaccount", callbackNewAccount);
}

/** Get the balance of an account **/
function callbackGetBalance(param) {
    $("#balance_value").html(param);
}

function getBalance() {
    let addressToCheck = document.getElementById("balance_addressAsked").value;
    if (addressToCheck === "") {
        $("#balance_message").html("Please enter an address");
    } else {
        $("#balance_message").hide();
        loadXMLDoc("getbalance/" + addressToCheck, callbackGetBalance);
        $("#balance_address").html(addressToCheck);
    }
}

/********************************
 * Nodes
 ********************************/

/** Update of the nodelist **/
setInterval(updateNodesList, 5000);

function callbackNodelist(param) {
    param = displayListNodes(param);
    $("#nodes_list").html(param);
}

function updateNodesList() {
    loadXMLDoc("updatenodelist", callbackNodelist);
}

/** Info about one node **/
function callbackNodeInfo(param) {
    param = displayTable(param);
    $("#node_info").html(param);
}

function displayNodeInfo(nodeID) {
    // TODO ici j'ai un problème
    console.log(typeof nodeID + " " + nodeID);
    // Ici nodeID est sous la forme number 4.98e+153
    addItem(nodeInfoItem);
    loadXMLDoc("getnodeinfo/" + nodeID, callbackNodeInfo);
}

/********************************
 * Blocks
 ********************************/

/** Update of the blocks list **/
setInterval(updateBlocksList, 2000);

function callbackBlockslist(param) {
    param = displayListBlocks(param);
    $("#blocks_list").html(param);
}

function updateBlocksList() {
    loadXMLDoc("updatelistBlocks", callbackBlockslist);
}

/** Info about one block **/
function callbackBlockInfo(param) {
    param = displayTable(param);
    $("#block_info").html(param);
}

function displayBlockInfo(blocknumber) {
    if (blocknumber === -1) {
        blocknumber = document.getElementById("blocks_blockNumber").value;
        blocknumber = Number(blocknumber);
    }
    if (blocknumber > 0) {
        addItem(blockInfoItem);
        loadXMLDoc("getblockinfo/" + blocknumber, callbackBlockInfo);
    }
}

/********************************
 * Transaction
 ********************************/

/** Make a transaction **/
function callbackMakeTransaction(param) {
    addItem(resultTransactionItem);
    param = displayTable(param);
    $("#resultTransaction_receipt").html(param);
}

function makeTransaction() {
    let sender = document.getElementById("transaction_sender").value;
    let receiver = document.getElementById("transaction_receiver").value;
    let privateKey = document.getElementById("transaction_privateKey").value;
    let amount = document.getElementById("transaction_amount").value;

    if (sender === "" || receiver === "" || privateKey === "" || amount === "") {
        $("#transaction_message").html("Please complete the whole form.");
    } else {
        // TODO si la transaction échoue ?
        $("#transaction_message").html("Transaction completed!");
        let json = {
            sender: sender,
            receiver: receiver,
            privateKey: privateKey,
            amount: amount,
        };
        loadXMLDoc("maketransaction/" + JSON.stringify(json), callbackMakeTransaction);
    }
}

/********************************
 * Buy menu
 ********************************/

/** Get references **/
function callbackGetReferences(Ids) {
    // Ids est sous la forme d'une liste de 5 Objects.
    // Pour chaque Objects, .returnValues
    // ["contractEndTime"]
    // ["price"]
    // ["provider"]
    // ["public key"]
    // ["referenceId"]
    // let keysToDisplay = ["contractEndTime", "price", "public key", "referenceId"];

    let html = "";
    Ids.forEach(function (reference) {
        html += "<li onclick=getRefInfo(" + reference.returnValues["referenceId"] + ")>" + reference.returnValues["referenceId"] + "</li>";
    });
    $("#forSale_list").html(html);
}

function getReferences() {
    loadXMLDoc("getreferences", callbackGetReferences);
}

/** Reference info **/
function callbackGetRefInfo(product) {
    console.log(product);
}
function getRefInfo(id) {
    loadXMLDoc("getrefinfo/"+id, callbackGetRefInfo);
}
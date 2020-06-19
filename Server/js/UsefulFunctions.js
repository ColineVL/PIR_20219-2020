/** Variables **/
let myAccount = "notConnected";
let references;
let boughtData;

/** To get a response from the server **/
function loadXMLDoc(page, successCallback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            try {
                console.log(this.responseText);
                let result = JSON.parse(this.responseText);
                successCallback(result);
            } catch (e) {
                failureCallback(e);
            }
        }
    }
    xhttp.open("GET", page, true);
    xhttp.send();
}

function failureCallback(err) {
    console.log(err);
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
        html += "<li>" + nodeID + "</li>";
    });
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
        let address = $("#myAccount_connection_address").val();
        if (account.address == address) {
            myAccount = account;
            loadMyAccount();
        } else {
            $('#myAccount_message').html("Address and private key don't match. Make sure your address begins with 0x.");
        }
    }
}

function connect() {
    let privateKey = $("#myAccount_connection_privateKey").val();
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

function callbackConnectNewAccount(account) {
    if (account["error"]) {
        $('#myAccount_message').html(account["error"]);
    } else {
        myAccount = account;
        loadMyAccount();
    }
}

function logInWithNewAccount() {
    let privateKey = $("#newAccount_privatekey").text();
    loadXMLDoc("connect/" + privateKey, callbackConnectNewAccount);
}

/** Get the balance of an account **/
function callbackGetBalance(param) {
    $("#balance_value").html(param);
}

function getBalance() {
    let addressToCheck = $("#balance_addressAsked").val();
    if (addressToCheck === "") {
        $("#balance_message").show();
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
setInterval(updateNodesList, 2000);

function callbackNodelist(param) {
    param = displayListNodes(param);
    $("#nodes_list").html(param);
}

function updateNodesList() {
    // We only update the list if the item is displayed on the screen
    if ($("#listNodesItem").text()) {
        loadXMLDoc("updatenodelist", callbackNodelist);
    }
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
    // We only update the list if the item is displayed on the screen
    if ($("#listBlocksItem").text()) {
        loadXMLDoc("updatelistBlocks", callbackBlockslist);
    }
}

/** Info about one block **/
function callbackBlockInfo(param) {
    param = displayTable(param);
    $("#block_info").html(param);
}

function displayBlockInfo(blocknumber) {
    if (blocknumber === -1) {
        blocknumber = $("#blocks_blockNumber").val();
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
    let sender = $("#transaction_sender").val();
    let receiver = $("#transaction_receiver").val();
    let privateKey = $("#transaction_privateKey").val();
    let amount = $("#transaction_amount").val();

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
function callbackGetReferences(param) {
    references = param;
    let html = "";
    references.forEach(function (reference) {
        html += "<details>";
        html += "<summary>" + reference.returnValues["referenceId"] + "</summary>";
        html += "<p>" + reference.returnValues["description"] + "</p>";
        html += "<p>(Wei) " + reference.returnValues["price"] + "</p>";
        html += "<p class='link' onclick=getRefForSaleInfo(" + reference.returnValues["referenceId"] + ")>Get more info</p>";
        html += "</details>";
    });
    $("#forSale_list").html(html);
}

function getReferences() {
    loadXMLDoc("getreferences", callbackGetReferences);
}

/** Product info **/
function getRefForSaleInfo(id) {
    const product = references[id].returnValues;
    const keysToDisplay = ["referenceId", "description", "price", "contractEndTime", "provider", "publicKeyDH"];
    displayProductInfo(product, keysToDisplay);
}

function getBoughtItemInfo(id) {
    const product = boughtData[id].returnValues;
    const keysToDisplay = ["referenceId", "publicKeyDH"];
    displayProductInfo(product, keysToDisplay);
}

function displayProductInfo(product, keysToDisplay) {
    addItem(productInfoItem);
    let html = "<table><tbody>";
    keysToDisplay.forEach(function (key) {
        html += "<tr>";
        html += "<td>" + key.capitalize() + "</td>";
        html += "<td>" + product[key] + "</td>";
        html += "</tr>";
    });
    html += "</tbody></table>";
    $('#productInfo_info').html(html);
}

/** Get bought data **/
function callbackGetBoughtData(Ids) {
    boughtData = Ids;
    let html = "";
    for (let i = 0; i < Ids.length; i++) {
        html += "<details>";
        html += "<summary>" + Ids[i].returnValues["referenceId"] + "</summary>";
        // TODO afficher des infos, au minimum la description
        html += "<p class='link' onclick=getBoughtItemInfo(" + Ids[i].returnValues["referenceId"] + ")>Get more info</p>";
        html += "</details>";
    }
    $("#boughtData_list").html(html);
}

function getBoughtData() {
    if (myAccount === "notConnected") {
        $('#boughtData_connected').hide();
        $('#boughtData_notConnected').show();
    } else {
        $('#boughtData_notConnected').hide();
        $('#boughtData_connected').show();
        loadXMLDoc("getboughtdata/" + myAccount.address, callbackGetBoughtData);
    }
}

/** Buy product **/
function callbackBuy(param) {
    console.log(param);
}

async function buyProduct() {
    if (myAccount === "notConnected") {
        console.log("Pas connecté");
    } else {
        const id = 1;
        loadXMLDoc("buy/" + id, callbackBuy);
    }
}

/********************************
 * Sell menu
 ********************************/
function loadSellNewProductItem() {
    loadHTMLDoc("sellNew.html", callbackLoadHTMLsellNew);
}

function callbackSellNewProduct(param) {
    $("#sellNew_message").show();
    $("#sellNew_message").html(param);
}

function sellNewProduct() {
    /* Info to be sent */
    let price = $("#sellNew_price").val();
    let contractEndTime = $("#sellNew_contractEndTime").val();
    let descr = $("#sellNew_description").val();
    let json = {price: price, contractEndTime: contractEndTime, descr: descr, privateKey: myAccount.privateKey};

    if (price === "" || contractEndTime === "" || descr === "") {
        console.log("Please complete the whole form.");
        $("#sellNew_message").show();
        $("#sellNew_message").html("Please complete the whole form.");
    } else {
        $("#sellNew_message").hide();
        loadXMLDoc("sellNewProduct/" + JSON.stringify(json), callbackSellNewProduct);
    }
}
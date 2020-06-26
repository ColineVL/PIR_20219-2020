/** Variables **/
let connected = false;
let references;
let myAccount = {};

/** To get a response from the server **/
function loadXMLDoc(page, successCallback, errorCallback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 500) {
            errorCallback(this.responseText);
        }
        if (this.readyState === 4 && this.status === 200) {
            try {
                let result = JSON.parse(this.responseText);
                successCallback(result);
            } catch (e) {
                errorCallback(e.message);
            }
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

function displayProductInfo(product, keysToDisplay, keysNames) {
    let html = "<table><tbody>";
    html += "<tr>";
    html += "<td>ReferenceId</td>";
    html += "<td id='productInfo_referenceID'>" + product["referenceId"] + "</td>";
    html += "</tr>";
    for (let i = 0; i < keysToDisplay.length; i++) {
        let key = keysToDisplay[i];
        let keyName = keysNames[i];
        html += "<tr>";
        html += "<td>" + keyName + "</td>";
        html += "<td>" + product[key] + "</td>";
        html += "</tr>";
    }
    html += "</tbody></table>";
    return html;
}

/********************************
 * Accounts
 ********************************/

/** Load my account **/
function loadMyAccount() {
    if (connected) {
        $('#myAccount_notConnected').hide();
        $('#myAccount_connected').show();
        $('#myAccount_address').html(myAccount.address);
        // updateBalance();
        loadOngoingSales();
        getBoughtData();
        loadOngoingBuys();
        loadHTMLDoc("sellNew.html", callbackLoadHTMLsellNew);
    } else {
        $('#myAccount_connected').hide();
        $('#myAccount_notConnected').show();
    }
}

/** Update balance **/
function callbackUpdateBalance(balance) {
    myAccount.balance = balance;
    $("#myAccount_value").html(myAccount.balance);
}

function updateBalance() {
    loadHTMLDoc("balance.html", callbackUpdateBalance, callbackError);
}

/** Connection **/
function callbackConnect(address) {
    connected = true;
    myAccount.address = address;
    loadMyAccount();
}

function callbackErrorConnect(err) {
    $("#myAccount_message").show();
    $("#myAccount_message").html(err);
}

function connect() {
    let privateKey = $("#myAccount_connection_privateKey").val();
    loadXMLDoc("connect/" + privateKey, callbackConnect, callbackErrorConnect);
}

function disconnect() {
    connected = false;
    myAccount = {};
    loadMyAccount();
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", 'signout', true);
    xhttp.send();
}

/** Creation of a new account **/
function callbackNewAccount(param) {
    $("#newAccount_address").html(param[0]);
    $("#newAccount_privatekey").html(param[1]);
}

function createNewAccount() {
    loadXMLDoc("newaccount", callbackNewAccount, callbackError);
}

function callbackConnectNewAccount(json) {
    connected = true;
    myAccount.address = json["address"];
    myAccount.balance = json["balance"];
    loadMyAccount();
}

function logInWithNewAccount() {
    let privateKey = $("#newAccount_privatekey").text();
    loadXMLDoc("connect/" + privateKey, callbackConnectNewAccount, callbackError);
}

/********************************
 * Nodes
 ********************************/

/** Update of the nodelist **/
function callbackNodelist(param) {
    param = displayListNodes(param);
    $("#nodes_list").html(param);
}

function updateNodesList() {
    // We only update the list if the item is displayed on the screen
    if ($("#listNodesItem").text()) {
        loadXMLDoc("updatenodelist", callbackNodelist, callbackError);
    }
}

setInterval(updateNodesList, 2000);


/********************************
 * Blocks
 ********************************/

/** Update of the blocks list **/
function callbackBlockslist(param) {
    param = displayListBlocks(param);
    $("#blocks_list").html(param);
}

function updateBlocksList() {
    // We only update the list if the item is displayed on the screen
    if ($("#listBlocksItem").text()) {
        loadXMLDoc("updatelistBlocks", callbackBlockslist, callbackError);
    }
}

setInterval(updateBlocksList, 2000);

/** Info about one block **/
function callbackBlockInfo(param) {
    param = displayTable(param);
    $('#block_message').hide();
    $("#block_info").html(param);
}

function displayBlockInfo(blocknumber) {
    if (blocknumber === -1) {
        blocknumber = $("#blocks_blockNumber").val();
        blocknumber = Number(blocknumber);
    }
    if (blocknumber > 0) {
        addItem(blockInfoItem);
        loadXMLDoc("getblockinfo/" + blocknumber, callbackBlockInfo,callbackError);
    }
}

/********************************
 * Buy menu
 ********************************/

/** Get references for sale **/
function callbackGetReferences(param) {
    $('#forSale_message').hide();
    references = {};
    let html = "";
    param.forEach(function (reference) {
        html += "<details>";
        html += "<summary>" + reference.returnValues["description"] + "</summary>";
        html += "<p>Reference Id: " + reference.returnValues["referenceId"] + "</p>";
        html += "<p>Minimum data: " + reference.returnValues["minimumData"] + "</p>";
        html += "<p class='link' onclick=getRefForSaleInfo(" + reference.returnValues["referenceId"] + ")>Get more info</p>";
        html += "</details>";
        references[reference.returnValues["referenceId"]] = reference.returnValues;
    });
    $("#forSale_list").html(html);
}

function callbackErrorGetReferences(err) {
    $('#forSale_message').show();
    $('#forSale_message').html(err);
}

function getReferences() {
    loadXMLDoc("getreferences", callbackGetReferences, callbackErrorGetReferences);
}

/** For sale Product info **/
function callbackGetPrice(price) {
    $("#productInfo_currentPrice").html(price);
}

function updatePrice() {
    // We only update the price if the item is displayed on the screen
    if ($("#productInfo_referenceID").text()) {
        const id = $('#productInfo_referenceID').text();
        loadXMLDoc("getPrice/" + id, callbackGetPrice, callbackError);
    }
}

let myTimerPrice;
function callbackgetRefForSaleInfo(product) {
    let html = "<table><tbody>";
    html += "<tr>";
    html += "<td>Reference Id</td>";
    html += "<td id='productInfo_referenceID'>" + product["referenceId"] + "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<td>Description</td>";
    html += "<td>" + product["description"] + "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<td>Current price</td>";
    html += "<td id='productInfo_currentPrice'></td>";
    html += "</tr>";

    const keysToDisplay = ["provider", "insuranceDeposit", "minimumData", "depreciationType"];
    const keysNames = ["Provider", "Insurance funds by the provider", "Minimum Data", "Type of Depreciation"];
    for (let i = 0; i < keysToDisplay.length; i++) {
        let key = keysToDisplay[i];
        let keyName = keysNames[i];
        html += "<tr>";
        html += "<td>" + keyName + "</td>";
        html += "<td>" + product[key] + "</td>";
        html += "</tr>";
    }

    html += "<tr>";
    html += "<td>Time of Deployment</td>";
    let deployTime = Number(product["deployTime"]);
    deployTime = new Date(deployTime * 1000);
    deployTime = deployTime.toLocaleString();
    html += "<td>" + deployTime + "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<td>End Time</td>";
    let endTime = Number(product["endTime"]);
    endTime = new Date(endTime * 1000);
    endTime = endTime.toLocaleString();
    html += "<td>" + endTime + "</td>";
    html += "</tr>";

    html += "</tbody></table>";

    addItem(forSaleproductInfoItem);
    $('#forSaleProductInfo_info').html(html);

    if (!connected) {
        $('#forSaleProductInfo_message').show();
        $('#forSaleProductInfo_message').text("To see the price and buy the product you need to be connected...");
        $('#forSaleProductInfo_buyButton').hide();
        clearInterval(myTimerPrice);
    } else {
        $('#forSaleProductInfo_buyButton').show();
        $('#forSaleProductInfo_message').hide();
        myTimerPrice = setInterval(updatePrice, 3000);
    }
}

function getRefForSaleInfo(id) {
    loadXMLDoc("getrefinfo/" + id, callbackgetRefForSaleInfo,callbackError);
}

/** Get bought data **/
function comparisonBoughtData(data1, data2) {
    if (parseInt(data1.returnValues["referenceId"], 10) < parseInt(data2.returnValues["referenceId"], 10)) {
        return -1;
    } else {
        return 1;
    }
}

function callbackGetBoughtItemInfo(product) {
    const keysToDisplay = ["referenceId"];
    addItem(boughtProductInfoItem);
    const html = displayProductInfo(product, keysToDisplay, keysToDisplay);
    $('#boughtProductInfo_info').html(html);
}

function getBoughtItemInfo(id) {
    loadXMLDoc("getboughtiteminfo/" + id, callbackGetBoughtItemInfo, callbackError);
}

function callbackGetBoughtData(Ids) {
    $("#boughtData_message").hide();
    Ids.sort(comparisonBoughtData);
    myAccount.boughtData = {};
    let html = "";
    for (const data of Ids) {
        html += "<details>";
        html += "<summary>" + data.returnValues["description"] + "</summary>";
        html += "<p>Reference Id: " + data.returnValues["referenceId"] + "</p>";
        html += "</details>";
        myAccount.boughtData[data.returnValues["referenceId"]] = data.returnValues;
    }
    $("#boughtData_list").html(html);
}

function callbackErrorGetBoughtData(err) {
    $("#boughtData_message").show();
    $("#boughtData_message").html(err);
}

function getBoughtData() {
    if (connected) {
        $('#boughtData_notConnected').hide();
        $('#boughtData_connected').show();
        loadXMLDoc("getboughtdata", callbackGetBoughtData, callbackErrorGetBoughtData);
    } else {
        $('#boughtData_connected').hide();
        $('#boughtData_notConnected').show();
    }
}

/** Buy product **/
function callbackBuy(param) {
    myAccount.boughtData[param["referenceId"]] = param;
    $('#forSaleProductInfo_message').show();
    $('#forSaleProductInfo_message').text("Bought!");
}

function callbackErrorBuy(err) {
    $('#forSaleProductInfo_message').show();
    $('#forSaleProductInfo_message').text(err);
}

async function buyProduct() {
    const id = $('#productInfo_referenceID').text();
    if (myAccount.boughtData.hasOwnProperty(id)) {
        // Check if the product is already bought: we shouldn't buy it twice
        $("#forSaleProductInfo_message").show();
        $("#forSaleProductInfo_message").html("You already bought this product.");
    } else if (myAccount.forSale.includes(id)) {
        // Check if I am the seller
        $("#forSaleProductInfo_message").show();
        $("#forSaleProductInfo_message").html("You can't buy this product as you are the seller.");
    } else {
        loadXMLDoc("buy/" + id, callbackBuy, callbackErrorBuy);
    }
}

/** Ongoing buys **/

function callbackOngoingBuys(Ids) {
    $("#ongoingBuys_message").hide();
    myAccount.buying = [];
    let html = "";
    for (const data of Ids) {
        html += "<details>";
        html += "<summary>" + data["description"] + "</summary>";
        html += "<p>Reference Id: " + data["referenceId"] + "</p>";
        html += "<p class='link' onclick=manageIdBuyer(" + data["referenceId"] + ")>Manage this Id</p>";
        html += "</details>";
        myAccount.buying.push(data["referenceId"]);
    }
    $("#ongoingBuys_beingBought").html(html);
}

function callbackErrorOngoingBuys(err) {
    $("#ongoingBuys_message").show();
    $("#ongoingBuys_message").html(err);
}

function loadOngoingBuys() {
    if (connected) {
        $('#ongoingBuys_notConnected').hide();
        $('#ongoingBuys_connected').show();
        loadXMLDoc("ongoingBuys", callbackOngoingBuys, callbackErrorOngoingBuys);
    } else {
        $('#ongoingBuys_connected').hide();
        $('#ongoingBuys_notConnected').show();
    }
}

/** Manage Id Buyer **/
function callbackManageIdBuyer(param) {
    addItem(manageIdBuyerItem);

    const [product, hashSent, encryptedEncodedReceived, decoderReceived] = param;
    const keys = ["provider", "description"];
    const keysNames = ["Provider", "Description"];
    const tableProduct = displayProductInfo(product, keys, keysNames);
    $("#manageIdBuyer_produit").html(tableProduct);

    if (!encryptedEncodedReceived) {
        // Waiting for the encrypted encoded key
        $('#manageidBuyer_encryptedEncodedWaiting').show();
        $('#manageidBuyer_sendHash').hide();
        $('#manageidBuyer_decoderKeyWaiting').hide();
        $('#manageidBuyer_decoderKeyReceived').hide();
    } else {
        // Encrypted encoded key received
        if (!hashSent) {
            // Client has to send the hash
            $('#manageidBuyer_encryptedEncodedWaiting').hide();
            $('#manageidBuyer_sendHash').show();
            $('#manageidBuyer_decoderKeyWaiting').hide();
            $('#manageidBuyer_decoderKeyReceived').hide();
        } else {
            // Client has sent the hash
            if (!decoderReceived) {
                // Waiting for the decoder key
                $('#manageidBuyer_encryptedEncodedWaiting').hide();
                $('#manageidBuyer_sendHash').hide();
                $('#manageidBuyer_decoderKeyWaiting').show();
                $('#manageidBuyer_decoderKeyReceived').hide();
            } else {
                // Decoder key received, client can compute
                $('#manageidBuyer_encryptedEncodedWaiting').hide();
                $('#manageidBuyer_sendHash').hide();
                $('#manageidBuyer_decoderKeyWaiting').hide();
                $('#manageidBuyer_decoderKeyReceived').show();
            }
        }
    }
}

function callbackErrorManageIdBuyer(err) {
    console.log(err);
}

function manageIdBuyer(id) {
    loadXMLDoc("manageIdBuyer/" + id, callbackManageIdBuyer, callbackErrorManageIdBuyer);
}

function callbackBuyerAction(id) {
    manageIdBuyer(id);
}

function sendBuyerHash() {
    const id = $('#productInfo_referenceID').text();
    loadXMLDoc("sendBuyerHash/" + id, callbackBuyerAction, callbackErrorManageIdBuyer);
}

function callbackComputeK(result) {
    manageIdBuyer(result["id"]);
    $('#manageIdBuyer_K').html("K: " + result["K"]);
}

function computeK() {
    const id = $('#productInfo_referenceID').text();
    loadXMLDoc("computeK/" + id, callbackComputeK, callbackErrorManageIdBuyer);
}

/** Dispute **/
function callbackDisputeNotConfirmed(json) {
    $('#dispute_notConfirmed').show();
    $('#dispute_confirmed').hide();
    $('#dispute_id').html(json["id"]);

    if (json["alreadyDisputed"]) {
        $('#dispute_alreadyDisputed').show();
        $('#dispute_alreadyEncoded').hide();
        $('#dispute_refund').hide();
    } else if (json["alreadyEncoded"]) {
        $('#dispute_alreadyDisputed').hide();
        $('#dispute_alreadyEncoded').show();
        $('#dispute_refund').hide();
    } else {
        $('#dispute_alreadyDisputed').hide();
        $('#dispute_alreadyEncoded').hide();
        $('#dispute_refund').show();
        $('#dispute_possibleRefund').html(json["possibleRefund"]);
    }
}

function dispute() {
    const id = $('#productInfo_referenceID').text();
    addItem(disputeItem);
    loadXMLDoc("dispute/" + id, callbackDisputeNotConfirmed, callbackErrorManageIdBuyer);
}

function callbackConfirmDispute(json) {
    $('#dispute_notConfirmed').hide();
    $('#dispute_confirmed').show();
    $('#dispute_id').html(json["id"]);
    if (json["funds"] > 0) {
        $('#dispute_unsuccessful').hide();
        $('#dispute_successful').show();
        $('#dispute_funds').html(json["funds"]);
    } else {
        $('#dispute_unsuccessful').show();
        $('#dispute_successful').hide();
    }
}

function confirmDispute() {
    const id = $('#dispute_id').text();
    loadXMLDoc("confirmDispute/" + id, callbackConfirmDispute, callbackErrorManageIdBuyer);
}

/********************************
 * Sell menu
 ********************************/

/** Sell product **/

function callbackSellNewProduct(param) {
    $("#sellNew_message").text("The offer is on the blockchain!");
    $("#sellNew_receipt").show();
    $("#sellNew_blockNumber").text(param["blockNumber"]);
    $("#sellNew_gasUsed").text(param["cumulativeGasUsed"]);
    $("#sellNew_referenceId").text(param["id"]);
    myAccount.forSale.push(param["id"]);
}

function callbackErrorSellNewProduct(err) {
    $("#sellNew_message").show();
    $("#sellNew_message").html(err);
}

function sellNewProduct() {
    /* Info to be sent */
    let json = {
        initialPrice: $("#sellNew_price").val(),
        durationDays: $("#sellNew_durationDays").val(),
        durationHours: $("#sellNew_durationHours").val(),
        durationMinutes: $("#sellNew_durationMinutes").val(),
        description: $("#sellNew_description").val(),
        minData: $("#sellNew_minData").val(),
        depreciationType: document.querySelector('input[name="depreciationType"]:checked').value,
        deposit: $("#sellNew_insuranceDeposit").val(),
    };

    let complete = false;
    for (const property in json) {
        if (json.property === "") {
            $("#sellNew_message").show();
            $("#sellNew_message").html("Please complete the whole form.");
            break;
        } else {
            complete = true;
        }
    }
    if (complete) {
        $("#sellNew_message").hide();
        loadXMLDoc("sellNewProduct/" + JSON.stringify(json), callbackSellNewProduct, callbackErrorSellNewProduct);
    }
}

/** Ongoing sales **/

function callbackOngoingSales(Ids) {
    $("#ongoingSales_message").hide();
    myAccount.forSale = [];
    let html = "";
    for (const data of Ids) {
        html += "<details>";
        html += "<summary>" + data.returnValues["description"] + "</summary>";
        html += "<p>Reference Id: " + data.returnValues["referenceId"] + "</p>";
        html += "<p class='link' onclick=manageIdSeller(" + data.returnValues["referenceId"] + ")>Manage this Id</p>";
        html += "</details>";
        myAccount.forSale.push(data.returnValues["referenceId"]);
    }
    $("#ongoingSales_beingSold").html(html);
}

function callbackErrorOngoingSales(err) {
    $("#ongoingSales_message").show();
    $("#ongoingSales_message").html(err);
}

function loadOngoingSales() {
    if (connected) {
        $('#ongoingSales_notConnected').hide();
        $('#ongoingSales_connected').show();
        loadXMLDoc("ongoingSales", callbackOngoingSales, callbackErrorOngoingSales);
    } else {
        $('#ongoingSales_connected').hide();
        $('#ongoingSales_notConnected').show();
    }
}

/** Manage Id Seller **/

function callbackManageIdSeller(param) {
    addItem(manageIdSellerItem);
    const [product, total_clients, num_clients_step1, num_clients_step2, key] = param;
    const keys = ["provider", "initialPrice", "currentPrice", "description"];
    const keysNames = ["Provider", "Initial price", "Current price", "Description"];
    const tableProduct = displayProductInfo(product, keys, keysNames);
    $("#manageIdSeller_produit").html(tableProduct);

    $("#manageIdSeller_totalNumberClients").text(total_clients);
    $("#manageIdSeller_NumClientsStep1").text(num_clients_step1);
    $("#manageIdSeller_NumClientsStep2").text(num_clients_step2);
    $("#manageIdSeller_totalNumberClients").text(total_clients);

    if (key === 0) {
        $('#manageIdSeller_keyReleased').hide();
        $('#manageIdSeller_keyNotReleased').show();
    } else {
        $('#manageIdSeller_keyNotReleased').hide();
        $('#manageIdSeller_keyReleased').show();
        $('#manageIdSeller_releasedKey').html(key);
    }
}

function callbackErrorManageIdSeller(err) {
    console.log(err);
}

function manageIdSeller(id) {
    $("#manageIdSeller_message").hide();
    loadXMLDoc("manageIdSeller/" + id, callbackManageIdSeller, callbackErrorManageIdSeller);
}
function manageIdSeller(id) {
    $("#manageIdSeller_message").hide();
    loadXMLDoc("manageIdSeller/" + id, callbackManageIdSeller, callbackErrorManageIdSeller);
}

/** New TLE **/
function callbackUploadNewTLE(param) {
    console.log("je suis dans la callback, pas d'erreur, afficher quelque chose au user");
    $("#newTLE_message").show();
    $("#newTLE_message").html(param);
}

function callbackErrorUploadNewTLE(err) {
    $("#newTLE_message").show();
    $("#newTLE_message").html(err);}

function uploadNewTLE() {
    let json = {
        id: $("#newTLE_id").text(),
        line0: $("#newTLE_line0").val(),
        line1: $("#newTLE_line1").val(),
        line2: $("#newTLE_line2").val(),
    };

    let complete = false;
    for (const property in json) {
        if (json.property === "") {
            $("#newTLE_message").show();
            $("#newTLE_message").html("Please complete the whole form.");
            break;
        } else {
            complete = true;
        }
    }
    if (complete) {
        $("#newTLE_message").hide();
        loadXMLDoc("uploadNewTLE/" + JSON.stringify(json), callbackUploadNewTLE, callbackErrorUploadNewTLE);
    }
}

function loadNewTLEForm() {
    addItem(newTLEItem);
    loadHTMLDoc("newTLE.html", callbackLoadHTMLnewTLE);
}

/** Seller step 1 **/

function callbackEncodedEncryptedKey(param) {
    const [num, done] = param;
    $("#manageIdSeller_message").show();
    $("#manageIdSeller_message").html("Successfully sent info to " + done + " clients out of " + num + " expected!");
}

function sendEncodedEncryptedKey() {
    const id = $('#productInfo_referenceID').text();
    loadXMLDoc("sendEncodedEncryptedKey/" + id, callbackEncodedEncryptedKey, callbackError);
}

/** Seller step 2 **/
function callbackSendDecoderKey(result) {
    $("#manageIdSeller_message").show();
    let [num, done] = result;
    $("#manageIdSeller_message").html("Successfully sent K2 to " + done + " clients out of " + num + " expected!<br>The others were ignored because a wrong hash was sent.");
}

function sendDecoderKey() {
    const id = $('#productInfo_referenceID').text();
    loadXMLDoc("sendDecoderKey/" + id, callbackSendDecoderKey, callbackError);
}

/** Seller post key **/
function callbackpostRefKey(result) {
    $("#manageIdSeller_message").show();
    let [receipt, refKey] = result;
    $("#manageIdSeller_message").html("Successfully sent the Reference Key to the contract.");
}

function postRefKey() {
    const id = $('#productInfo_referenceID').text();
    loadXMLDoc("postRefKey/" + id, callbackpostRefKey, callbackError);
}

/** Withdraw Funds **/
function callbackWithdrawFunds(param) {
    $("#manageIdSeller_message").show();
    $("#manageIdSeller_message").html("Successfully withdrew funds. You received " + param["funds"] + " Ether.");
}
function callbackErrorWithdrawFunds(err) {
    $("#manageIdSeller_message").show();
    $("#manageIdSeller_message").html(err);
}
function withdrawFunds() {
    const id = $('#productInfo_referenceID').text();
    loadXMLDoc("withdrawFunds/" + id, callbackWithdrawFunds, callbackErrorWithdrawFunds);
}

/** Error **/

function callbackError(err) {
    console.error(err);
}

/** Make a transaction, to delete **/
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
        document.getElementById("message").innerHTML = "Please complete the whole form.";
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
        loadXMLDoc("maketransaction/" + JSON.stringify(json), callbackMakeTransaction, callbackError);
    }
}
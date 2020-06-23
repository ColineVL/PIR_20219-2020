/** Variables **/
let connected = false;
let references;
let myAccount = {};

/** To get a response from the server **/
function loadXMLDoc(page, successCallback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            try {
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
        $("#myAccount_value").html(myAccount.balance);
    } else {
        $('#myAccount_connected').hide();
        $('#myAccount_notConnected').show();
    }
}

/** Connection **/
function callbackConnect(json) {
    connected = true;
    loadOngoingSales();
    getBoughtData();
    myAccount.address = json["address"];
    myAccount.balance = json["balance"];
    loadMyAccount();
}

function connect() {
    let privateKey = $("#myAccount_connection_privateKey").val();
    loadXMLDoc("connect/" + privateKey, callbackConnect);
}

function disconnect() {
    connected = false;
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
    loadXMLDoc("newaccount", callbackNewAccount);
}

function callbackConnectNewAccount(json) {
    connected = true;
    myAccount.address = json["address"];
    myAccount.balance = json["balance"];
    loadMyAccount();
}

function logInWithNewAccount() {
    let privateKey = $("#newAccount_privatekey").text();
    loadXMLDoc("connect/" + privateKey, callbackConnectNewAccount);
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
 * Buy menu
 ********************************/

/** Get references for sale **/
function callbackGetReferences(param) {
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

function getReferences() {
    loadXMLDoc("getreferences", callbackGetReferences);
}

/** For sale Product info **/
function getRefForSaleInfo(id) {
    if (connected) {
        loadXMLDoc("getrefinfo/" + id, callbackgetRefForSaleInfo);
    } else {
        console.log("You should connect");
    }

}

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
    html += "<td id='productInfo_currentPrice'>" + product["actualPrice"] + "</td>";
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
    deployTime = new Date(deployTime);
    deployTime = deployTime.toLocaleString();
    html += "<td>" + deployTime + "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<td>End Time</td>";
    let endTime = Number(product["endTime"]);
    endTime = new Date(endTime);
    endTime = endTime.toLocaleString();
    html += "<td>" + endTime + "</td>";
    html += "</tr>";

    html += "</tbody></table>";

    addItem(forSaleproductInfoItem);
    $('#forSaleProductInfo_info').html(html);
    if (myAccount === "notConnected") {
        $('#forSaleProductInfo_message').show();
        $('#forSaleProductInfo_message').text("You are not connected...");
        $('#forSaleProductInfo_buyButton').hide();
    } else {
        $('#forSaleProductInfo_buyButton').show();
        $('#forSaleProductInfo_message').hide();
    }
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
    loadXMLDoc("getboughtiteminfo/" + id, callbackGetBoughtItemInfo);
}

function callbackGetBoughtData(Ids) {
    Ids.sort(comparisonBoughtData);
    myAccount.boughtData = {};
    let html = "";
    for (const data of Ids) {
        html += "<details>";
        html += "<summary>" + data.returnValues["referenceId"] + "</summary>";
        // TODO afficher des infos, au minimum la description
        html += "<p class='link' onclick=getBoughtItemInfo(" + data.returnValues["referenceId"] + ")>Get more info</p>";
        html += "</details>";
        myAccount.boughtData[data.returnValues["referenceId"]] = data.returnValues;
    }
    $("#boughtData_list").html(html);
}

function getBoughtData() {
    if (connected) {
        $('#boughtData_notConnected').hide();
        $('#boughtData_connected').show();
        loadXMLDoc("getboughtdata", callbackGetBoughtData);
    } else {
        $('#boughtData_connected').hide();
        $('#boughtData_notConnected').show();
    }
}

/** Buy product **/
function callbackBuy(param) {
    myAccount.boughtData[param.returnValues["referenceId"]] = param.returnValues;
    // TODO en cas de problème
    $('#forSaleProductInfo_message').show();
    $('#forSaleProductInfo_message').text("Bought!");
}

async function buyProduct() {
    const id = $('#productInfo_referenceID').text();
    // Check if the product is already bought: we shouldn't buy it twice
    if (myAccount.boughtData.hasOwnProperty(id)) {
        $("#forSaleProductInfo_message").show();
        $("#forSaleProductInfo_message").html("You already bought this product.");
    }
    // Check if I am the seller
    if (myAccount.forSale.includes(id)) {
        $("#forSaleProductInfo_message").show();
        $("#forSaleProductInfo_message").html("You can't buy this product as you are the seller.");
    } else {
        loadXMLDoc("buy/" + id, callbackBuy);
    }
}

/********************************
 * Sell menu
 ********************************/

/** Sell product **/

function callbackSellNewProduct(param) {
    $("#sellNew_message").show();
    $("#sellNew_message").html(param);
    try {
        $("#sellNew_receipt").show();
        $("#sellNew_message").text("The offer is on the blockchain!");
        $("#sellNew_blockNumber").text(param["blockNumber"]);
        $("#sellNew_gasUsed").text(param["cumulativeGasUsed"]);
        $("#sellNew_referenceId").text(param["id"]);
        myAccount.forSale.push(param["id"]);
    } catch (err) {
        console.log(err);
    }
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
        loadXMLDoc("sellNewProduct/" + JSON.stringify(json), callbackSellNewProduct);
    }
}

/** Ongoing sales **/

function callbackOngoingSales(Ids) {
    myAccount.forSale = [];
    let html = "";
    for (const data of Ids) {
        html += "<details>";
        html += "<summary>" + data.returnValues["referenceId"] + "</summary>";
        html += "<p>" + data.returnValues["description"] + "</p>";
        html += "<p>Price (Wei): " + data.returnValues["price"] + "</p>";
        html += "<p>End time: " + data.returnValues["contractEndTime"] + "</p>";
        html += "<p class='link' onclick=manageItem(" + data.returnValues["referenceId"] + ")>Manage this Id</p>";
        html += "</details>";
        myAccount.forSale.push(data.returnValues["referenceId"]);
    }
    $("#ongoing_beingSold").html(html);
}

function loadOngoingSales() {
    if (connected) {
        $('#ongoing_notConnected').hide();
        $('#ongoing_connected').show();
        loadXMLDoc("ongoingSales", callbackOngoingSales);
    } else {
        $('#ongoing_connected').hide();
        $('#ongoing_notConnected').show();
    }
}

/** Manage Id **/

function callbackManageId(param) {
    const [product, total_clients, num_clients_step1, num_clients_step2] = param;
    const keys = ["provider", "price", "contractEndTime", "description"];
    const tableProduct = displayProductInfo(product[0].returnValues, keys, keys);
    $("#manageId_produit").html(tableProduct);
    $("#manageId_totalNumberClients").text(total_clients);
    $("#manageId_NumClientsStep1").text(num_clients_step1);
    $("#manageId_NumClientsStep2").text(num_clients_step2);
    $("#manageId_totalNumberClients").text(total_clients);
}

function manageItem(id) {
    addItem(manageIdItem);
    loadXMLDoc("manageId/" + id, callbackManageId);
}

function callbackSendCryptedK2(param) {
    const [num, done] = param;
    $("#manageId_message").html("Successfully sent info to " + done + " clients out of " + num + " expected!");
}

function sendCryptedK2() {
    const id = $('#productInfo_referenceID').text();
    loadXMLDoc("sendCryptedK2/" + id + "/" + myAccount.privateKey, callbackSendCryptedK2);
}
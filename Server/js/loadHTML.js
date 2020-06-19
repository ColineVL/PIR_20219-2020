/** To load HTML from the server **/
function loadHTMLDoc(page, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(this.responseText);
        }
    };
    xhttp.open("GET", page, true);
    xhttp.send();
}

function callbackLoadHTMLMyAccount(html) {
    $("#myAccount").html(html);
    loadMyAccount();
}

function callbackLoadHTMLsellNew(html) {
    $("#forSale").html(html);
    if (myAccount === "notConnected") {
        $('#sellNew_connected').hide();
        $('#sellNew_notConnected').show();
    } else {
        $('#sellNew_notConnected').hide();
        $('#sellNew_connected').show();
    }
}
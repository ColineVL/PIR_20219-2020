/********************************
 * Main Items
 ********************************/
const makeTransactionItem = {
    title: "make transaction",
    name: "makeTransactionItem"
}

const myAccountItem = {
    title: "My account",
    name: "myAccountItem",
};

const listNodesItem = {
    title: "List of nodes",
    name: "listNodesItem",
};

const listBlocksItem = {
    title: "List of last blocks",
    name: "listBlocksItem",
};

const blockInfoItem = {
    title: "Block Info",
    name: "blockInfoItem",
};

const resultTransactionItem = {
    title: "Transaction completed",
    name: "resultTransactionItem",
};

const newAccountItem = {
    title: "Create an account",
    name: "newAccountItem",
};

/********************************
 * Buy Items
 ********************************/

const forSaleItem = {
    title: "See products for sale",
    name: "forSaleItem",
};

const forSaleproductInfoItem = {
    title: "Product info",
    name: "forSaleproductInfoItem"
}

const boughtProductInfoItem = {
    title: "Product info",
    name: "boughtProductInfoItem"
}

const ongoingBuysItem = {
    title: "Ongoing buys",
    name: "ongoingBuysItem"
};

const boughtDataItem = {
    title: "Bought data",
    name: "boughtDataItem"
};

const manageIdSellerItem = {
    title: "Manage ID",
    name: "manageIdSellerItem"
};

const manageIdBuyerItem = {
    title: "Manage ID",
    name: "manageIdBuyerItem"
};

/********************************
 * Sell Items
 ********************************/

const sellNewItem = {
    title: "Sell a new product",
    name: "sellNewItem"
};

const ongoingSalesItem = {
    title: "Ongoing sales",
    name: "ongoingSalesItem"
};

/********************************
 * Create Layout
 ********************************/

const config = {
    content: [{
        type: 'row',
        isClosable: false,
        content: []
    }]
};

const myLayout = new window.GoldenLayout(config, $('#layoutContainer'));


/********************************
 * Register components
 ********************************/

/** Main items **/

myLayout.registerComponent('myAccountItem', function (container, state) {
    container.getElement().html('<div id="myAccount">');
    loadHTMLDoc("myAccount.html", callbackLoadHTMLMyAccount);
});

myLayout.registerComponent('listNodesItem', function (container, state) {
    container.getElement().html(
        '<div class="container" id="listNodesItem">' +
        '<p>The list updates regularly.</p>' +
        '<ol id="nodes_list"></ol>' +
        '</div>'
    );
});

myLayout.registerComponent('listBlocksItem', function (container, state) {
    container.getElement().html(
        '<div class="container" id="listBlocksItem">' +
        '<h1>Clic on a block to get more info</h1>' +
        '<ul id="blocks_list"></ul>' +
        '<h2>Or search by block number</h2>' +
        '<input id="blocks_blockNumber" type="number" min="0">' +
        '<button onclick="displayBlockInfo(-1)">Search block</button>' +
        '</div>'
    );
});

myLayout.registerComponent('blockInfoItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h1>Here are the details about the block.</h1>' +
        '<div id="block_info"></div>' +
        '</div>'
    );
});

myLayout.registerComponent('newAccountItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h1>Here is your new account info!</h2>' +
        '<h2>Take care to note them somewhere, they CANNOT BE RECOVERED.</h2>' +
        '<p>Your address:</p>' +
        '<p id="newAccount_address"></p>' +
        '<p>Your private key:</p>' +
        '<p id="newAccount_privatekey"></p>' +
        '<button onclick="logInWithNewAccount()">Sign in with this account</button>' +
        '</div>'
    );
});

myLayout.registerComponent('makeTransactionItem', function (container, state) {
    let htmlform = '';
    const form = {
        transaction_sender: "Sender:",
        transaction_privateKey: "Private Key:",
        transaction_receiver: "Receiver:",
        transaction_amount: "Amount:"
    };
    for (let value in form) {
        htmlform += "<label for=" + value + ">" + form[value] + "</label>";
        htmlform += "<input id=" + value + " type='text'>";
        htmlform += "<br>";
    }
    htmlform += "<button onclick='makeTransaction()'>Submit</button>";
    container.getElement().html(
        '<div class="container">' +
        '<h1>Fill in the form to make a transaction</h1>' +
        '<p id="transaction_message"></p>' +
        htmlform +
        '</div>'
    );
});

myLayout.registerComponent('resultTransactionItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h1>Here is your receipt.</h1>' +
        '<div id="resultTransaction_receipt"></div>' +
        '</div>'
    );
});

/** Buy items **/

myLayout.registerComponent('forSaleItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h1>For sale items:</h1>' +
        '<p id="forSale_message" class="message"></p>' +
        '<ul id="forSale_list"></ul>' +
        '</div>'
    );
});

myLayout.registerComponent('forSaleproductInfoItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h1>For sale product info:</h1>' +
        '<div id="forSaleProductInfo_info"></div>' +
        '<button id="forSaleProductInfo_buyButton" onclick="buyProduct()">Buy</button>' +
        '<p class="message" id="forSaleProductInfo_message"></p>' +
        '</div>'
    );
});

myLayout.registerComponent('boughtProductInfoItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h1>Bought product info:</h1>' +
        '<ul id="boughtProductInfo_info"></ul>' +
        '</div>'
    );
});

myLayout.registerComponent('ongoingBuysItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<div id="ongoingBuys_notConnected">' +
        '<p class="message">You are not connected...</p>' +
        '</div>' +
        '<div id="ongoingBuys_connected">' +
        '<h1>Products being bought :</h1>' +
        '<p id="ongoingBuys_message" class="message"></p>' +
        '<ul id="ongoingBuys_beingBought"></ul>' +
        '</div>' +
        '</div>'
    );
});

myLayout.registerComponent('manageIdBuyerItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h3>Product:</h3>' +
        '<div id="manageIdBuyer_produit"></div>' +
        '<h3>To do:</h3>' +
        '<ul>' +
        '<li>Encrypted encoded key received, send hash</li>' +
        '<li>Decoder key received, compute</li>' +
        '<li>Set a dispute or get a refund</li>' +
        '</ul>' +
        '<p class="message" id="manageIdSeller_message"></p>' +
        '</div>'
    );
});

myLayout.registerComponent('boughtDataItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<div id="boughtData_notConnected">' +
        '<p class="message">You are not connected...</p>' +
        '</div>' +
        '<div id="boughtData_connected">' +
        '<h1>Bought data:</h1>' +
        '<p id="boughtData_message" class="message"></p>' +
        '<ul id="boughtData_list"></ul>' +
        '</div>' +
        '</div>'
    );
});

/** Sell items **/

myLayout.registerComponent('sellNewItem', function (container, state) {
    container.getElement().html('<div id="forSale">');
});

myLayout.registerComponent('ongoingSalesItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<div id="ongoingSales_notConnected">' +
        '<p class="message">You are not connected...</p>' +
        '</div>' +
        '<div id="ongoingSales_connected">' +
        '<h1>Products being sold :</h1>' +
        '<p id="ongoingSales_message" class="message"></p>' +
        '<ul id="ongoingSales_beingSold"></ul>' +
        '</div>' +
        '</div>'
    );
});

myLayout.registerComponent('manageIdSellerItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<p>Total number of clients: <var id="manageIdSeller_totalNumberClients"></var></p>' +
        '<h3>Product:</h3>' +
        '<div id="manageIdSeller_produit"></div>' +
        '<h3>To do:</h3>' +
        '<ul>' +
        '<li onclick="sendEncodedEncryptedKey()">Send Encrypted Encoded Key (K2xorKxorK3): <var id="manageIdSeller_NumClientsStep1"></var> clients</li>' +
        '<li onclick="sendDecoderKey()">Verify hashes and send Decoder Key (K2): <var id="manageIdSeller_NumClientsStep2"></var> clients</li>' +
        '<li id="manageIdSeller_keyNotReleased" onclick="postRefKey()">Release reference key (key not released yet)</li>' +
        '<li id="manageIdSeller_keyReleased">Key is released: <var id="manageIdSeller_releasedKey"></var></li>' +
        '</ul>' +
        '<p class="message" id="manageIdSeller_message"></p>' +
        '</div>'
    );
});

/********************************
 * Initialize Layout
 ********************************/

myLayout.init();
myLayout.on('initialised', () => {
    addItem(myAccountItem);
    addItem(listBlocksItem);
});


/********************************
 * Create menu
 ********************************/

function addMenuItem(newItem) {
    const element = $('<li>' + newItem.title + '</li>');
    $('#menuContainer').append(element);

    const newItemConfig = {
        title: newItem.title,
        type: 'component',
        componentName: newItem.name,
        componentState: newItem
    };

    element.click(function () {
        let items = myLayout.root.getComponentsByName(newItem.name);
        // If this block is already open, don't open another one
        if (items.length === 0) {
            myLayout.root.contentItems[0].addChild(newItemConfig);
        }
    });

    if (newItem.name === "newAccountItem") {
        element.click(createNewAccount);
    }
    if (newItem.name === "forSaleItem") {
        element.click(getReferences);
    }
    if (newItem.name === "boughtDataItem") {
        element.click(getBoughtData);
    }
    if (newItem.name === "ongoingSalesItem") {
        element.click(loadOngoingSales);
    }
    if (newItem.name === "ongoingBuysItem") {
        element.click(loadOngoingBuys);
    }
    if (newItem.name === "sellNewItem") {
        element.click( () => {
            loadHTMLDoc("sellNew.html", callbackLoadHTMLsellNew);
        });


    }
}

$('#menuContainer').append("<h1>Menu</h1>");
addMenuItem(myAccountItem);
addMenuItem(listBlocksItem);
addMenuItem(listNodesItem);
addMenuItem(newAccountItem);
$('#menuContainer').append("<h2>Buy</h2>");
addMenuItem(forSaleItem);
addMenuItem(ongoingBuysItem);
addMenuItem(boughtDataItem);
$('#menuContainer').append("<h2>Sell</h2>");
addMenuItem(sellNewItem);
addMenuItem(ongoingSalesItem);
$('#menuContainer').append("<h3><a href='closeserver'>Close server</a></h3>");
addMenuItem(makeTransactionItem);

/********************************
 * Create items out of the menu
 ********************************/

function addItem(newItem) {
    const newItemConfig = {
        title: newItem.title,
        type: 'component',
        componentName: newItem.name,
        componentState: newItem
    };
    let items = myLayout.root.getComponentsByName(newItem.name);
    // If this block is already open, don't open another one
    if (items.length === 0) {
        myLayout.root.contentItems[0].addChild(newItemConfig);
    }
}

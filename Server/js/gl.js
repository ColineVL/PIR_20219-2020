/********************************
 * Main Items
 ********************************/

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

const createTransactionItem = {
    title: "Make a signed transaction",
    name: "createTransactionItem",
};

const resultTransactionItem = {
    title: "Transaction completed",
    name: "resultTransactionItem",
};

const checkABalanceItem = {
    title: "Check a balance",
    name: "checkABalanceItem",
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

const productInfoItem = {
    title: "Info about the product",
    name: "productInfoItem"
}

const ongoingTransactionsItem = {
    title: "Ongoing transactions",
    name: "ongoingTransactionsItem"
};

const boughtDataItem = {
    title: "Bought data",
    name: "boughtDataItem"
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
        '<input id="blocks_blockNumber" type="number">' +
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

myLayout.registerComponent('checkABalanceItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h1>Enter an address to get a balance.</h1>' +
        '<p class="message" id="balance_message"></p>' +
        '<input id="balance_addressAsked" type="text">' +
        '<button onclick="getBalance()">Check balance</button>' +
        '<table id="balance_table">' +
        '<tr>' +
        '<td>Address</td>' +
        '<td id="balance_address">/</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Balance (in ETH)</td>' +
        '<td id="balance_value">/</td>' +
        '</tr>' +
        '</table>' +
        '</div>'
    );
});

myLayout.registerComponent('createTransactionItem', function (container, state) {
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
        '<ul id="forSale_list"></ul>' +
        '</div>'
    );
});

myLayout.registerComponent('productInfoItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h1>Product info:</h1>' +
        '<ul id="productInfo_info"></ul>' +
        '</div>'
    );
});

myLayout.registerComponent('ongoingTransactionsItem', function (container, state) {
    container.getElement().html(
        '<div class="container">' +
        '<h1>Transactions:</h1>' +
        '<ul id="ongoing_list"></ul>' +
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
        '<h1>Products being sold :</h1>' +
        '<div id="ongoing_beingSold"></div>' +
        '<div id="ongoing_sold"></div>' +
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
    if (newItem.name === "sellNewItem") {
        element.click(loadSellNewProductItem);
    }
}

$('#menuContainer').append("<h1>Menu</h1>");
addMenuItem(myAccountItem);
addMenuItem(listBlocksItem);
addMenuItem(listNodesItem);
addMenuItem(newAccountItem);
$('#menuContainer').append("<h2>Buy</h2>");
addMenuItem(forSaleItem);
addMenuItem(ongoingTransactionsItem);
addMenuItem(boughtDataItem);
$('#menuContainer').append("<h2>Sell</h2>");
addMenuItem(sellNewItem);
addMenuItem(ongoingSalesItem);
$('#menuContainer').append("<h2>Debug</h2>");
addMenuItem(createTransactionItem);
addMenuItem(checkABalanceItem);
$('#menuContainer').append("<h3><a href='closeserver'>Close server</a></h3>");

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

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

const nodeInfoItem = {
    title: "Node Info",
    name: "nodeInfoItem",
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


/********************************
 * Initialise Layout
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
 * Register components and init
 ********************************/

/** Main items **/

myLayout.registerComponent('myAccountItem', function (container, state) {
    container.getElement().html(
        '<div id="myAccount_connected">' +
        '<h2>Current account connected:</h2>' +
        '<table id="myAccount_table">' +
        '<tr>' +
        '<td>Address</td>' +
        '<td id="myAccount_address">/</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Funds (in ETH)</td>' +
        '<td id="myAccount_value">/</td>' +
        '</tr>' +
        '</table>' +
        '<button onclick="disconnect()">Sign out</button>' +
        '</div>' +
        '<div id="myAccount_notConnected">' +
        '<p id="myAccount_message">You are not connected.</p>' +
        '<p>Your address</p>' +
        '<input id="myAccount_connection_address" type="string">' +
        '<p>Your private key</p>' +
        '<input id="myAccount_connection_privateKey" type="string">' +
        '<button onclick="connect()">Sign in</button>' +
        '</div>'
    );
});

myLayout.registerComponent('listNodesItem', function (container, state) {
    container.getElement().html(
        '<h2>Clic on a node to get more info.</h2>' +
        '<ul id="nodes_list"></ul>'
    );
});

myLayout.registerComponent('nodeInfoItem', function (container, state) {
    container.getElement().html(
        '<h2>Here are the details about the node.</h2>' +
        '<div id="node_info"></div>'
    );
});

myLayout.registerComponent('listBlocksItem', function (container, state) {
    container.getElement().html(
        '<h2>Clic on a block to get more info.</h2>' +
        '<ul id="blocks_list"></ul>' +
        '<p>Search by block number.</p>' +
        '<input id="blocks_blockNumber" type="string">' +
        '<button onclick="displayBlockInfo(-1)">Search block</button>'
    );
});

myLayout.registerComponent('blockInfoItem', function (container, state) {
    container.getElement().html(
        '<h2>Here are the details about the block.</h2>' +
        '<div id="block_info"></div>'
    );
});

myLayout.registerComponent('newAccountItem', function (container, state) {
    container.getElement().html(
        '<h2>Here is your new account info! Take care to note them somewhere, they CANNOT BE RECOVERED.</h2>' +
        '<p>Your address:</p>' +
        '<p id="newAccount_address"></p>' +
        '<p>Your private key:</p>' +
        '<p id="newAccount_privatekey"></p>'
    );
});

myLayout.registerComponent('checkABalanceItem', function (container, state) {
    container.getElement().html(
        '<h2>Enter an address to get a balance.</h2>' +
        '<input id="balance_addressAsked" type="string">' +
        '<button onclick="getBalance()">Check balance</button>' +
        '<p id="balance_message"></p>' +
        '<table id="balance_table">' +
        '<tr>' +
        '<td>Address</td>' +
        '<td id="balance_address">/</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Balance (in ETH)</td>' +
        '<td id="balance_value">/</td>' +
        '</tr>' +
        '</table>'
    );
});

myLayout.registerComponent('createTransactionItem', function (container, state) {
    let htmlform = "";
    const form = {
        transaction_sender: "Sender:",
        transaction_privateKey: "Private Key:",
        transaction_receiver: "Receiver:",
        transaction_amount: "Amount:"
    };
    for (let value in form) {
        htmlform += "<label for=" + value + ">" + form[value] + "</label>";
        htmlform += "<input id=" + value + " type='string'>";
        htmlform += "<br>";
    }
    htmlform += "<button onclick='makeTransaction()'>Submit</button>";
    container.getElement().html(
        '<p id="transaction_message"></p>' +
        '<div>' + htmlform + '</div>'
    );
});

myLayout.registerComponent('resultTransactionItem', function (container, state) {
    container.getElement().html(
        '<h2>Here is your receipt.</h2>' +
        '<div id="resultTransaction_receipt"></div>'
    );
});

/** Buy items **/
myLayout.registerComponent('forSaleItem', function (container, state) {
    container.getElement().html(
        '<h2>Available products:</h2>' +
        '<ul id="forSale_list"></ul>'
    );
});

myLayout.registerComponent('ongoingTransactionsItem', function (container, state) {
    container.getElement().html(
        '<h2>Transactions:</h2>' +
        '<ul id="ongoing_list"></ul>'
    );
});

myLayout.registerComponent('boughtDataItem', function (container, state) {
    container.getElement().html(
        '<h2>Bought data:</h2>' +
        '<ul id="boughtData_list"></ul>'
    );
});

/** Sell items **/

myLayout.init();

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
    if (newItem.name === "myAccountItem") {
        element.click(loadMyAccount);
    }
    if (newItem.name === "forSaleItem") {
        element.click(getReferences);
    }
}

$('#menuContainer').append("<h1>Menu</h1>");
addMenuItem(myAccountItem);
addMenuItem(listBlocksItem);
addMenuItem(listNodesItem);
addMenuItem(checkABalanceItem);
addMenuItem(newAccountItem);
$('#menuContainer').append("<h2>Buy</h2>");
addMenuItem(forSaleItem);
addMenuItem(ongoingTransactionsItem);
addMenuItem(boughtDataItem);
$('#menuContainer').append("<h2>Sell</h2>");
addMenuItem(createTransactionItem);


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


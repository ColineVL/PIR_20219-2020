/********************************
 * Items
 ********************************/

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
        '<td>Balance (in Ether)</td>' +
        '<td id="balance_value">/</td>' +
        '</tr>' +
        '</table>'
    );
});

myLayout.registerComponent('createTransactionItem', function (container, state) {
    let htmlform = "";
    const form = {transaction_sender: "Sender:", transaction_privateKey: "Private Key:", transaction_receiver: "Receiver:", transaction_amount: "Amount:"};
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
        element.click(function () {
            createNewAccount();
        });
    }
}

$('#menuContainer').append("<h1>Menu</h1>");
addMenuItem(listBlocksItem);
addMenuItem(listNodesItem);
addMenuItem(checkABalanceItem);
addMenuItem(createTransactionItem);
addMenuItem(newAccountItem);


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


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
        '<ul id="nodelist"></ul>'
    );
});

myLayout.registerComponent('nodeInfoItem', function (container, state) {
    container.getElement().html(
        '<h2>Here are the details about the node.</h2>' +
        '<div id="nodeinfo"></div>'
    );
});

myLayout.registerComponent('listBlocksItem', function (container, state) {
    container.getElement().html(
        '<h2 id="text">Clic on a block to get more info.</h2>' +
        '<ul id="blockslist"></ul>'
    );
});

myLayout.registerComponent('blockInfoItem', function (container, state) {
    container.getElement().html(
        '<h2>Here are the details about the block.</h2>' +
        '<div id="blockinfo"></div>'
    );
});

myLayout.registerComponent('newAccountItem', function (container, state) {
    container.getElement().html(
        '<h2>Here is your new account info! Take care to note them somewhere, they CANNOT BE RECOVERED.</h2>' +
        '<p>Your address:</p>' +
        '<p id="newaddress"></p>' +
        '<p>Your private key:</p>' +
        '<p id="newprivatekey"></p>'
    );
});

myLayout.registerComponent('checkABalanceItem', function (container, state) {
    container.getElement().html(
        '<h2>Enter an address to get a balance.</h2>' +
        '<input id="addressToCheck" type="string">' +
        '<button onclick="getBalance()">Check balance</button>' +
        '<p id="messageBalance"></p>' +
        '<table>' +
        '<tr>' +
        '<td>Address</td>' +
        '<td id="address"></td>' +
        '</tr>' +
        '<tr>' +
        '<td>Balance (in Ether)</td>' +
        '<td id="balance"></td>' +
        '</tr>' +
        '</table>'
    );
});

myLayout.registerComponent('createTransactionItem', function (container, state) {
    let htmlform = "";
    const form = {sender: "Sender:", privateKey: "Private Key:", receiver: "Receiver:", amount: "Amount:"};
    for (let value in form) {
        htmlform += "<label for=" + value + ">" + form[value] + "</label>";
        htmlform += "<input id=" + value + " type='string'>";
        htmlform += "<br>";
    }
    htmlform += "<button onclick='makeTransaction()'>Submit</button>";
    container.getElement().html(
        '<p id="message"></p>' +
        '<div id="form">' + htmlform + '</div>'
    );
});

myLayout.registerComponent('resultTransactionItem', function (container, state) {
    container.getElement().html(
        '<h2>Here is your receipt.</h2>' +
        '<div id="receipt"></div>'
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
addMenuItem(listNodesItem);
addMenuItem(checkABalanceItem);
addMenuItem(createTransactionItem);
addMenuItem(newAccountItem);
addMenuItem(listBlocksItem);

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


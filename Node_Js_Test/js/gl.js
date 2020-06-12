/********************************
 * Items
 ********************************/

var listNodesItem = {
    title: "List of nodes",
    text: "Clic on a node to get more info.",
    list: [],
    name: "listNodesItem",
};

var nodeInfoItem = {
    title: "Node Info",
    text: "Here are the details about the node.",
    nodeinfo: "",
    name: "nodeInfoItem",
};

var listBlocksItem = {
    title: "List of last blocks",
    text: "Clic on a block to get more info.",
    list: [],
    name: "listBlocksItem",
};

var blockInfoItem = {
    title: "Block Info",
    text: "Here are the details about the block.",
    blockinfo: "",
    name: "blockInfoItem",
};

var createTransactionItem = {
    title: "Make a signed transaction",
    form: {sender: "Sender:", privateKey: "Private Key:", receiver: "Receiver:", amount: "Amount:"},
    name: "createTransactionItem",
};

var resultTransactionItem = {
    title: "Transaction completed",
    text: "Here is your receipt.",
    receipt: "",
    name: "resultTransactionItem",
};

var checkABalanceItem = {
    title: "Check a balance",
    address: "No account given yet!",
    balance: "Nothing to show",
    label: "Address to check",
    name: "checkABalanceItem",
};


var newAccountItem = {
    title: "Create an account",
    text: "Here is your new account info! Take care to note them somewhere, they CANNOT BE RECOVERED.",
    address: "",
    privateKey: "",
    name: "newAccountItem",
};

/********************************
 * Initialise Layout
 ********************************/

var config = {
    content: [{
        type: 'row',
        isClosable: false,
        content: []
    }]
};

var myLayout = new window.GoldenLayout(config, $('#layoutContainer'));


/********************************
 * Register components and init
 ********************************/

myLayout.registerComponent('listNodesItem', function (container, state) {
    // let listToDisplay = displayList(state.list);
    container.getElement().html(
        '<h2>' + state.text + '</h2>' +
        '<ul id="nodelist">' + state.list + '</ul>'
    );
});

myLayout.registerComponent('nodeInfoItem', function (container, state) {
    container.getElement().html(
        '<h2>' + state.text + '</h2>' +
        '<div id="nodeinfo">' + state.nodeinfo + '</div>'
    );
});

myLayout.registerComponent('listBlocksItem', function (container, state) {
    // let listToDisplay = displayList(state.list);
    container.getElement().html(
        '<h2 id="text">' + state.text + '</h2>' +
        '<ul id="blockslist">' + state.list + '</ul>'
    );
});

myLayout.registerComponent('blockInfoItem', function (container, state) {
    container.getElement().html(
        '<h2>' + state.text + '</h2>' +
        '<div id="blockinfo">' + state.blockinfo + '</div>'
    );
});

myLayout.registerComponent('newAccountItem', function (container, state) {
    container.getElement().html(
        '<h2>' + state.text + '</h2>' +
        '<p id="newaddress">' + state.address + '</p>' +
        '<p id="newprivatekey">' + state.privateKey + '</p>'
    );
});

myLayout.registerComponent('checkABalanceItem', function (container, state) {
    container.getElement().html(
        '<h2 id="address">' + state.address + '</h2>' +
        '<p id="balance">' + state.balance + '</p>' +
        '<button onclick="getBalance()">Enter an address to get a balance</button>'
    );
});


myLayout.registerComponent('createTransactionItem', function (container, state) {
    let htmlform = "";
    for (let value in state.form) {
        htmlform += "<label for=" + value + ">" + state.form[value] + "</label>";
        htmlform += "<input id=" + value + " type='string'>";
        htmlform += "<br>";
    }
    htmlform += "<button onclick='makeTransaction()'>Submit</button>";
    container.getElement().html(
        '<div id="message"></div>' +
        '<div id="form">' + htmlform + '</div>'
    );
});

myLayout.registerComponent('resultTransactionItem', function (container, state) {
    container.getElement().html(
        '<h2>' + state.text + '</h2>' +
        '<div id="receipt">' + state.receipt + '</div>'
    );
});


myLayout.init();

/********************************
 * Create menu
 ********************************/
var addMenuItem = function (newItem) {
    var element = $('<li>' + newItem.title + '</li>');
    $('#menuContainer').append(element);

    var newItemConfig = {
        title: newItem.title,
        type: 'component',
        componentName: newItem.name,
        componentState: newItem
    };

    element.click(function () {
        let items = myLayout.root.getComponentsByName(newItem.name);
        // If this block is already open, don't open another one
        if (items.length == 0) {
            myLayout.root.contentItems[0].addChild(newItemConfig);
        }
    });
    if (newItem.name == "newAccountItem") {
        element.click(function () {
            createNewAccount();
        });
    }
};
$('#menuContainer').append("<h1>Menu</h1>");
addMenuItem(listNodesItem);
addMenuItem(checkABalanceItem);
addMenuItem(createTransactionItem);
addMenuItem(newAccountItem);
addMenuItem(listBlocksItem);

/********************************
 * Create items out of the menu
 ********************************/

var addItem = function (newItem) {
    var newItemConfig = {
        title: newItem.title,
        type: 'component',
        componentName: newItem.name,
        componentState: newItem
    };
    let items = myLayout.root.getComponentsByName(newItem.name);
    // If this block is already open, don't open another one
    if (items.length == 0) {
        myLayout.root.contentItems[0].addChild(newItemConfig);
    }
};


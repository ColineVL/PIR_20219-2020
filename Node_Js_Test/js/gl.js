/********************************
 * Items
 ********************************/
var listNodesItem = {
    title: "List of nodes",
    text: "Clic on a node to get more info.",
    list: [],
    name: "listNodesItem",
}

var listBlocksItem = {
    title: "List of last blocks",
    text: "Clic on a block to get more info.",
    list: [],
    name: "listBlocksItem",
}

var createTransactionItem = {
    title: "Make a signed transaction",
    text: "Yo",
    link: "<a href=\'/SignedTransaction/\'>Clic</a>",
    name: "withoutList",
}

var checkABalanceItem = {
    title: "Check a balance",
    address: "No account given yet!",
    balance: "Nothing to show",
    form: '<form action="/balance/" method="get">\n' +
        '<label for="account">Address to check:</label>\n' +
        '<input id="account" name="account" type="string">\n' +
        '<input type="submit" value="Submit">\n' +
        '</form>',
    link: "<a href=\'/balance/\'>Clic</a>",
    name: "checkABalanceItem",
}


var newAccountItem = {
    title: "Create an account",
    text: "Here is your new account info! Take care to note them somewhere, they CANNOT BE RECOVERED.",
    address: "",
    privateKey: "",
    name: "newAccountItem",
}

var adresse = 'loadXMLDoc("test2/6")';
var testItem2 = {
    title: "Test load XML",
    text: "Salut",
    link: "<button onclick='testXML(zecallback)'>Test XML</button>",
    name: "withoutList",
}




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

myLayout.registerComponent('listNodesItem', function (container, state) {
    let listToDisplay = displayList(state.list);
    container.getElement().html(
        '<h2>' + state.text + '</h2>' +
        '<ul id="nodelist">' + listToDisplay + '</ul>'
    );
});

myLayout.registerComponent('listBlocksItem', function (container, state) {
    let listToDisplay = displayList(state.list);
    container.getElement().html(
        '<h2>' + state.text + '</h2>' +
        '<ul id="blockslist">' + listToDisplay + '</ul>'
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
        state.form +
        '<p>' + state.link + '</p>'
    );
});

myLayout.registerComponent('withList', function (container, state) {
    txt = displayList(state.list);
    container.getElement().html('<h2 id="g">' + state.text + '</h2>' +
        txt +
        '<p id="date">' + state.link + '</p>');
});

myLayout.registerComponent('withoutList', function (container, state) {
    container.getElement().html('<h2 id="result">' + state.text + '</h2>' +
        '<p>' + state.link + '</p>');
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
        myLayout.root.contentItems[0].addChild(newItemConfig);
    });
    if (newItem.name=="newAccountItem") {
        element.click(function() {
            createNewAccount();
        });
    }
};
$('#menuContainer').append("<h1>Menu</h1>");
addMenuItem(listNodesItem);
addMenuItem(checkABalanceItem);
addMenuItem(createTransactionItem);
addMenuItem(newAccountItem);
addMenuItem(testItem2);
addMenuItem(listBlocksItem);
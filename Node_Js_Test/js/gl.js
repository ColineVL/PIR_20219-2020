/********************************
 * Items
 ********************************/
var listNodesItem = {
    title: "List of nodes",
    text: "Clic on a node to get more info.",
    list: lt,
    // link: "<a href=\'/updatenodelist/\'><button>Refresh</button></a>",
    link: "<button onclick='updateNodesList()'>Update</button>",
    name: "listNodesItem",
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


var createAnAccountItem = {
    title: "Create an account",
    text: "Salut",
    link: "<a href=\'/NewAccount/\'>Clic</a>",
    name: "withoutList",
}

var testItem = {
    title: "Test",
    text: "Salut",
    list: ["<button onclick='geek()'>Geek</button>"],
    link: "<a href=\'/Test/\'>Don't clic</a>",
    name: "withList",
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
        '<ul id="nodelist">' + listToDisplay + '</ul>' +
        '<p>' + state.link + '</p>'
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
};
$('#menuContainer').append("<h1>Menu</h1>");
addMenuItem(listNodesItem);
addMenuItem(checkABalanceItem);
addMenuItem(createTransactionItem);
addMenuItem(createAnAccountItem);
addMenuItem(testItem);
addMenuItem(testItem2);
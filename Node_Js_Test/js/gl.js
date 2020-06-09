
var listNodesItem = {
    title: "List of nodes",
    text: "Clic on a node to get more info.",
    list: lt,
    link: "<a href=\'/nodes/refresh/\'><button>Refresh</button></a>",
    name: "withList",
}

var createTransactionItem = {
    title: "Make a signed transaction",
    text: "Yo",
    link: "<a href=\'/SignedTransaction/\'>Clic</a>",
    name: "withoutList",
}

var checkABalanceItem = {
    title: "Check a balance",
    text: "Hey",
    link: "<a href=\'/balance/\'>Clic</a>",
    name: "withoutList",
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
    list: ["<button onclick='geek()'>Test</button>"],
    link: "<a href=\'/Test/\'>Clic</a>",
    name: "withList",
}


var testItem2 = {
    title: "Test",
    text: "Salut",
    list: ["<button onclick='loadXMLDoc(6)'>Test</button>"],
    link: "<a href=\'/Test/\'>Clic</a>",
    name: "withList",
}


var config = {
    content: [{
        type: 'row',
        isClosable: false,
        content: []
    }]
};


var myLayout = new window.GoldenLayout(config, $('#layoutContainer'));

function displayList(list) {
    let txt = "";
    list.forEach(function (elt) {
        txt += '<li>' + elt + '</li>';
    });
    return txt;
}

myLayout.registerComponent('withList', function (container, state) {
    txt = displayList(state.list);
    container.getElement().html('<h2 id="g">' + state.text + '</h2>' +
        txt +
        '<p>' + state.link + '</p>');
});

myLayout.registerComponent('withoutList', function (container, state) {
    container.getElement().html('<h2 id="g">' + state.text + '</h2>' +
        '<p>' + state.link + '</p>');
});

myLayout.init();


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
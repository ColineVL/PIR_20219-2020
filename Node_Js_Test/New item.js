var bonjourItem = {
    title: "home",
    text: "Bonjour"
};

var listNodesItem = {
    title: "List of nodes",
    text: "Ici on doit afficher la liste des noeuds"
}

var createTransactionItem = {
    title: "Make a signed transaction",
    text: "Yo"
}

var checkABalanceItem = {
    title: "Check a balance",
    text: "Yo"
}

var createAnAccountItem = {
    title: "Create an account",
    text: "Salut"
}

var config = {
    content: [{
        type: 'row',
        isClosable: false,
        content: [
        ]
    }]
};

var myLayout = new window.GoldenLayout( config, $('#layoutContainer') );

myLayout.registerComponent( 'example', function( container, state ){
    container.getElement().html( '<h2>' + state.text + '</h2>');
});

myLayout.init();



var addMenuItem = function( newItem ) {
    var element = $( '<li>' + newItem.title + '</li>' );
    $( '#menuContainer' ).append( element );

    var newItemConfig = {
        title: newItem.title,
        type: 'component',
        componentName: 'example',
        componentState: { text: newItem.text }
    };

    element.click(function(){
        myLayout.root.contentItems[ 0 ].addChild( newItemConfig );
    });
};

addMenuItem(bonjourItem);
addMenuItem(listNodesItem);
addMenuItem(checkABalanceItem);
addMenuItem(createTransactionItem);
addMenuItem(createAnAccountItem);
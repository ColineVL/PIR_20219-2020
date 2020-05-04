requirejs.config({
    baseUrl:'scripts',
    paths:{
        web3: 'node_modules/web3/dist/web3.min'
        // Admin: 'node_modules/web3-eth-admin/dist/web3-eth-admin.esm.js'
    }
});

require(['require', 'web3'/*,'web3-eth-admin'*/], function (require) {
    var Web3 = require('web3');
    // var Admin = require('web3-eth-admin');
});



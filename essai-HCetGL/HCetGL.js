Highcharts.chart('container', {

    title: {
        text: 'Solar Employment Growth by Sector, 2010-2016'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },

    series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});



/* Golden Script */

var config = {
    content: [{
        type: 'row',
        content: [{
                type: 'component',
                componentName: 'example',
                componentState: {text: 'Component 3'}
            }]
    }]
};

var myLayout = new GoldenLayout(config);
myLayout.registerComponent('example', function (container, state) {

    container.getElement().html('<h2>' + state.text + '</h2>'+ '<figure className="highcharts-figure"><div id="container"></div></figure>');
});
myLayout.init();
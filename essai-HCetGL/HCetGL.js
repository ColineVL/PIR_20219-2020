StockChartComponent = function( container, state ) {
    this._highChartsConfig = {
        title: { text: 'Historic prices for ' + state.companyName },
        series: [],
        plotOptions: { line: { marker: { enabled: false } } },
        xAxis:{ type: 'datetime' },
        yAxis:{ title: 'Price in USD' },
        chart:{ renderTo: container.getElement()[ 0 ] }
    };

    this._container = container;
    this._state = state;
    this._chart = null;

    this._container.setTitle( 'Chart for ' + state.companyName );
    this._container.on( 'open', this._createChart.bind( this ) );
};

StockChartComponent.prototype._createChart = function() {
    this._chart = new Highcharts.Chart( this._highChartsConfig );
    this._chart.showLoading( 'Loading data...' );
    new StockDataRequest( this._state.tickerSymbol, this._onDataReady.bind( this ) );
};

StockChartComponent.prototype._onDataReady = function( highchartsData ) {
    this._chart.addSeries({
        color: this._state.color,
        name: this._state.companyName,
        data: highchartsData
    });

    this._chart.hideLoading();
    this._bindContainerEvents();
};

StockChartComponent.prototype._bindContainerEvents = function() {
    this._container.on( 'resize', this._setSize.bind( this ) );
    this._container.on( 'destroy', this._chart.destroy.bind( this._chart ) );
};

StockChartComponent.prototype._setSize = function() {
    this._chart.setSize( this._container.width, this._container.height );
};


// TODO
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
            componentName: 'Nom1',
            componentState: {
                companyName: 'Google',
                tickerSymbol: 'Symb',
                color: '#7C7'
            }
        }, {
            type: 'component',
            componentName: 'Name2',
            componentState: {
                companyName: 'Apple',
                tickerSymbol: 'Symb2',
                color: '#77C'
            }
        }]
    }]
};

var myLayout = new GoldenLayout(config);
myLayout.registerComponent('stockChart', StockChartComponent);
myLayout.init();
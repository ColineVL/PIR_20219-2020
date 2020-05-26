/********************************
 * Class StockDataRequest
 ********************************/
StockDataRequest = function( tickerSymbol, callback ) {
    this._tickerSymbol = tickerSymbol;
    this._callback = callback;
    this._loadData();
};

StockDataRequest.prototype._createYqlQuery = function() {
    var url =	'https://query.yahooapis.com/v1/public/yql?' +
        'q=select * from yahoo.finance.historicaldata '+
        'where symbol = "' + this._tickerSymbol + '" ' +
        'and startDate = "2013-09-11" and endDate = "2014-03-10"&' +
        'format=json&diagnostics=true&' +
        'env=store://datatables.org/alltableswithkeys';

    return encodeURI( url );
};

StockDataRequest.prototype._loadData = function() {
    $.ajax({
        url: this._createYqlQuery( this._tickerSymbol ),
        success: this._onDataReceived.bind( this ),
        cache: true,
        dataType: 'jsonp'
    });
};

StockDataRequest.prototype._onDataReceived = function( rawData ) {
    var highchartsData = this._transformDataForHighCharts( rawData );
    this._callback( highchartsData );
};

StockDataRequest.prototype._transformDataForHighCharts = function( rawData ) {
    var quotes = rawData.query.results.quote,
        data = [],
        i;

    for( i = quotes.length - 1; i >=0; i-- ) {
        data.push([
            ( new Date( quotes[ i ].Date ) ).getTime(),
            parseFloat( quotes[ i ].Open )
        ]);
    }

    return data;
};

/********************************
 * Class StockChartComponent
 ********************************/
StockChartComponent = function( container, state ) {

    this._highChartsConfig = {
        title: { text: 'Historic prices for ' + state.companyName },
        series: [],
        plotOptions: { line: { marker: { enabled: false } } },
        xAxis:{ type: 'datetime' },
        yAxis:{ title: 'Price in USD' },
        chart:{
            renderTo: container.getElement()[ 0 ]
        }
    };

    this._chart = null;
    this._container = container;
    this._container.setTitle( 'Chart for ' + state.companyName );
    this._state = state;
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

/********************************
 * Initialise Layout
 ********************************/
$(function(){
    var myLayout = new GoldenLayout({
        content:[{
            type: 'row',
            content: [{
                type: 'component',
                componentName: 'stockChart',
                componentState: {
                    companyName: 'Google Inc.',
                    tickerSymbol: 'GOOGL',
                    color:'#7C7'
                }
            },{
                type: 'component',
                componentName: 'stockChart',
                componentState: {
                    companyName: 'Apple Inc.',
                    tickerSymbol: 'AAPL',
                    color: '#77C'
                }
            }]
        }]
    });

    myLayout.registerComponent( 'stockChart', StockChartComponent );
    myLayout.init();
});
	
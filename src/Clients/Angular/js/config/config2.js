
function config($stateProvider, $urlRouterProvider) {
	// http://viralpatel.net/blogs/angularjs-routing-and-views-tutorial-with-example/
	$urlRouterProvider.otherwise("/dashboard");
	// Now set up the states
	$stateProvider
	.state('dashboard', {
		cache : false,
		url : "/dashboard",
		templateUrl : "views/dashboard.html",
		controller : DashboardCtrl
	})
	.state('charts', {
		cache : false,
		url : "/charts",
		templateUrl : "views/charts.html"

	})
	.state('sensor', {
		cache : false,
		url : "/sensor/:sensorCode",
		templateUrl : "views/sensor.html",
		controller : SensorChartsCtrl
	});
};

function chartJsConfig(ChartJsProvider) {

	// Configure all charts
	ChartJsProvider.setOptions({
		colours : ['#97BBCD', '#A80000', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
		responsive : true,
		/* legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>" */
	});

	// Configure all doughnut charts
	ChartJsProvider.setOptions('Doughnut', {
		animateScale : true
	});

	/* ChartJsProvider.setOptions({
	colors : [, '#949FB1', '#4D5360', '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C'],
	responsive : true
	}); */
}

function HttpProviderDisableCacheConfig($httpProvider) {
	// enable http caching
	$httpProvider.defaults.cache = true;
};

angular
.module("myApp")
.config(config)
.config(HttpProviderDisableCacheConfig)
.config(chartJsConfig)
// It's very handy to add references to $state and $stateParams to the $rootScope
// so that you can access them from any scope within your applications.
// For example, <li ng-class="{ active: $state.includes('contacts.list') }">
// will set the <li> to active whenever 'contacts.list' or one of its
// decendents is active.

/* .run([ '$rootScope', '$state', '$stateParams',
function ($rootScope, $state, $stateParams) {
$rootScope.$state = $state;
$rootScope.$stateParams = $stateParams;
}]); */
;

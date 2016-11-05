
function MainCtrl() {};

function DashboardCtrl($scope, $http, $filter) {

 $scope.date = new Date();

	$scope.dataInfos = {};

	Array.prototype.mapProperty = function (property) {
		return this.map(function (obj) {
			return obj[property];
		});
	};

	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

	var url = 'http://iteon.pl/pogoda/lastSensorData.php'; //+ "?SensorCode=" + formData.SensorCode;

	$http.get(url).success(function (response) {

		for (var l in response) {
			if (response.hasOwnProperty(l)) {
				
				if (!$scope.dataInfos[response[l].SensorCode]) {

					/* console.log("Sensor:" + response[l].SensorCode); */

					$scope.dataInfos[response[l].SensorCode] = {
						"name" : response[l].SensorName,
						"description" : response[l].SensorDescription,
						"data" : []
					};
				};

				var dataType = {
					Code : response[l].DataTypeCode,
					Name : response[l].DataType,
					Value : response[l].Value,
					DateTime : response[l].DateTime,
					DataTypeSymbol: response[l].DataTypeSymbol
				};

				$scope.dataInfos[response[l].SensorCode].data.push(dataType);
			}
		}

		/* console.log($scope.dataInfos); */

	}).error(function (error) {

		console.log(error);

	});

};

function SensorChartsCtrl($scope, $http, $stateParams, $filter, $interval) {

	moment.locale('pl');
	/* console.log($stateParams.sensorCode); */
	/* var labels = myData.mapProperty('date') */

	$scope.charts = [];

	var chartsFromDb = {};
	var chartsFromDb2 = {};

	var today = new Date();
	var tomorrow = moment(today).format('YYYY-MM-DD HH:mm:ss');

	var yesterday = moment().format('YYYY-MM-DD 00:00:00'); //.add(-1, 'days')
	//yesterday.setDate(today.getDate() - 1);

	var formData = {
		SensorCode : $stateParams.sensorCode,
		StartDate : yesterday, //'2016-06-01 00:00:00',
		EndDate : tomorrow // '2016-07-31 00:00:00'
	};

	var url = 'http://iteon.pl/pogoda/sensorData.php?' + "SensorCode=" + formData.SensorCode + "&" + "StartDate=" + formData.StartDate + "&" + "EndDate=" + formData.EndDate;

	$http.get(url).success(function (response) {

		var dataLabels = [];
		for (var l in response.Labels) {
			if (response.Labels.hasOwnProperty(l)) {
				dataLabels.push(response.Labels[l].interval_start_formated)
			}
		}

		var sensors = [];
		for (var l in response.Sensors) {
			if (response.Sensors.hasOwnProperty(l)) {
				sensors.push(response.Sensors[l])
			}
		}

		/* console.log(sensors); */

		var result = [];
		for (var l in response.DataSensor) {
			if (response.DataSensor.hasOwnProperty(l)) {
				result.push(response.DataSensor[l])
				/* console.log(response.DataSensor[l]); */
			}
		}

		var datatypes = [];
		for (var l in response.DataTypes) {
			if (response.DataTypes.hasOwnProperty(l)) {
				datatypes.push(response.DataTypes[l])
				/* console.log(response.DataTypes[l]); */
			}
		}

		/* console.log(datatypes); */

		var datetimes = dataLabels; //.mapProperty('DateTime').filter(onlyUnique);

		for (var x in datatypes) {
			if (datatypes.hasOwnProperty(x)) {

				var parameterName = datatypes[x].Name;

				chartsFromDb[parameterName] = {};
				chartsFromDb[parameterName] = {
					"labels" : [],
					"data" : [],
					"series" : [],
					"name" : parameterName
				};

				for (var s in sensors) {
					if (sensors.hasOwnProperty(s)) {

						var values = [];
						angular.forEach(datetimes, function (dateTime) {

							var myRedObjects = $filter('filter')(result, {
									SensorCode : sensors[s].Code,
									DataTypeCode : datatypes[x].Code,
									DateTime : dateTime
								})[0];

							/* console.log(myRedObjects); */
							if (myRedObjects !== undefined) {
								values.push(myRedObjects.Value);
							} else {
								values.push(null);
							}
						});

						chartsFromDb[parameterName].data.push(values);

						chartsFromDb[parameterName].labels = datetimes;
						chartsFromDb[parameterName].series.push(sensors[s].Name + " [" + sensors[s].Description + "]");
					}

				}
			}

			if (!chartsFromDb) {
				chartsFromDb = {};
			}
		};

		$scope.charts = chartsFromDb;

		/* console.log(chartsFromDb); */

		/* var lineChartData = {
		labels : chartData.labels,
		datasets : [{
		label : chartData.series,
		fillColor : "rgba(255,255,255,0)",
		strokeColor : "rgba(16,133,135,1)",
		pointColor : "rgba(16,133,135,1)",
		pointStrokeColor : "#fff",
		pointHighlightFill : "#fff",
		pointHighlightStroke : "rgba(16,133,135,1)",
		data : chartData.data
		},{
		label : "SES 5.6",
		fillColor : "rgba(255,255,255,0)",
		strokeColor : "rgba(82,185,159,1)",
		pointColor : "rgba(82,185,159,1)",
		pointStrokeColor : "#fff",
		pointHighlightFill : "#fff",
		pointHighlightStroke : "rgba(82,185,159,1)",
		data : ["128.948", "130.369", "131.038", "125.867", "121.893", "119.656", "119.026", "119.737"]
		}, {
		label : "SES 6.7",
		fillColor : "rgba(255,255,255,0)",
		strokeColor : "rgba(242,175,62,1)",
		pointColor : "rgba(242,175,62,1)",
		pointStrokeColor : "#fff",
		pointHighlightFill : "#fff",
		pointHighlightStroke : "rgba(242,175,62,1)",
		data : ["127.473", "128.983", "129.327", "123.416", "118.829", "116.843", "117.190", "115.215"]
		}, {
		label : "SES 8.9",
		fillColor : "rgba(255,255,255,0)",
		strokeColor : "rgba(236,83,62,1)",
		pointColor : "rgba(236,83,62,1)",
		pointStrokeColor : "#fff",
		pointHighlightFill : "#fff",
		pointHighlightStroke : "rgba(236,83,62,1)",
		data : ["127.283", "125.147", "124.489", "116.783", "111.696", "110.563", "105.469", "104.332"]
		}
		]

		} */

		/* var ctx = document.getElementById("canvas").getContext("2d");
		window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive : true
		}); */

		/* window.onload = function () {
		var ctx = document.getElementById("canvas").getContext("2d");
		window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive : true
		});
		} */

	}).error(function (error) {

		console.log(error);

	});

	if (!chartsFromDb) {
		chartsFromDb = {};
	}

	/* }, 500); */
};

function NavigationSensoreCtrl(SensorService, $scope) {
	$scope.sensors = [];

	/*   $scope.sensors = [{
	"Name" : "SENSOREK 1"
	},{
	"Name" : "SENSOREK 2"
	},{
	"Name" : "SENSOREK 3"
	},{
	"Name" : "SENSOREK 4"
	}
	]; */

	// Call the async method and then do stuff with what is returned inside our own then function
	SensorService.async().then(function (d) {
		$scope.sensors = d;
	});

};

angular
.module("myApp")
.controller("MainCtrl", MainCtrl)
.controller("DashboardCtrl", DashboardCtrl)
.controller("NavigationSensoreCtrl", NavigationSensoreCtrl)
.controller("SensorChartsCtrl", SensorChartsCtrl);

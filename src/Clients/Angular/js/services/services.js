
function SensorService($http) {
	var sensors = [];

	var url = 'http://iteon.pl/pogoda/sensors.php' + "?SensorCode=" + "-1";

	/* 	$http.get(url).success(function (result) {
	return result;
	}).error(function (error) {
	console.log(error);
	});
	 */

	var myService = {
		async : function () {
			// $http returns a promise, which has a then function, which also returns a promise
			var promise = $http.get(url).then(function (response) {
					// The then function here is an opportunity to modify the response
					/* console.log(response); */
					// The return value gets picked up by the then in the controller.
					return response.data;
				});
			// Return the promise to the controller
			return promise;
		}
	};
	return myService;

};

function SensorDataService($http, $q) {

	var myService = {

		getSensorData : function (formData) {
			var url = 'http://iteon.pl/pogoda/sensorData.php?' + "SensorCode=" + formData.SensorCode + "&" + "StartDate=" + formData.StartDate + "&" + "EndDate=" + formData.EndDate;
			var d = $q.defer();
			// $http returns a promise, which has a then function, which also returns a promise
			var promise = $http.get(url).then(function (response) {
					var result = d.resolve(response.data);
					console.log("Response:");
					console.log(result);

					return result;
					/* return JSON.parse(response.data); */
				});
			// Return the promise to the controller
			/* return promise; */
			return d.promise;
		}
	};
	return myService;

};

angular
.module("myApp")
.factory("SensorService", SensorService)
.factory("SensorDataService", SensorDataService);

var services = angular.module('services', []);


services.factory('serviceController', ['$http', '$location', '$q', function($http, $location, $q) {

	var service = {

		loadInitialData: function() {
			// var path = $location.path();
			// var param = path.substring(path.lastIndexOf('/') + 1, path.length);
			var loadData = function() {

				// get select sources
					// var getData1 = $http.post('/api/getData1/', {
					// 	input1: '00001',
					// 	input2: 'ABCDE'
					// }).then(function(types) {
					// 	types = types.data.data;
					// 	console.log(types);
					// 	return types;
					// });
				
					var getData1 = function(){ return [1,2,3]};
					var getData2 = function(){ return [4,5,6]};
					var getData3 = function(){ return [7,8,9]};

				return $q.all([getData1, getData2, getData3]);
			}

			return loadData();
		},
		loadQuarterbackData: function() {
			var loadData = function() {
					var getData = function(){ return [1,2,3]};
				return $q.all([getData]);
			}
			return loadData();
		}
	}
	return service;
}]);
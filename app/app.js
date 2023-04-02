var app = angular.module('statPro', [
    'ngRoute',
    'headerController',
    'services',
    'oc.lazyLoad'
  ]);
  

// Custome service to trap any 401 responses from our API and direct user to login page
app.service('authInterceptor', function($q) {
  var service = this;

  service.responseError = function(response) {
      if (response.status == 401){
          window.location = "#!login";
      }
      return $q.reject(response);
  };
})

// Config app to use the authInterceptor service for all $http calls
app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}]);


  
  app.config(['$routeProvider',
    function($routeProvider) {
  
        $routeProvider.
        when('/', {
            templateUrl: 'app/templates/main_content.html',
            controller: 'MainController',
            resolve: {
              data: function(serviceController) {
                  return serviceController.loadInitialData();
              },
              loadDependencies: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load(['app/controllers/mainController.js']);
              }]
            }
        }).
        when('/qb', {
            templateUrl: 'app/templates/qb.html',
            controller: 'qbController',
            resolve: {
              data: function(serviceController) {
                return serviceController.loadQuarterbackData();
              },
              loadDependencies: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load(['../app/controllers/qbController.js','resources/styles/qb.css']);
              }]
            }
          }).
        otherwise({
            redirectTo: '/'
        });
    }
  ]);
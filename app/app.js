var app = angular.module('statPro', [
    'ngRoute',
    'headerController',
    'mainController',
    'qbController',
    'services'
  ]);
  
  
  app.config(['$routeProvider',
    function($routeProvider) {
  
        $routeProvider.
        when('/', {
            templateUrl: 'app/templates/main_content.html',
            controller: 'MainController',
            resolve: {
            data: function(serviceController) {
                return serviceController.loadInitialData();
            }
            }
        }).
        when('/qb', {
            templateUrl: 'app/templates/qb.html',
            controller: 'qbController',
            resolve: {
              data: function(serviceController) {
                return serviceController.loadQuarterbackData();
              }
            }
          }).
        otherwise({
            redirectTo: '/'
        });
    }
  ]);
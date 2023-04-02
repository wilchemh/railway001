var app = angular.module('statPro', [
    'ngRoute',
    'headerController',
    'services',
    'oc.lazyLoad'
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
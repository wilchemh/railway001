

angular.module('headerController', ['ngAnimate'])
    .controller('HeaderController', ['$scope', '$http', '$filter', '$location',
        function($scope, $http, $filter, $location) {

            $scope.errorThrown = false;
            $scope.successThrown = false;
            $scope.errorMessage = null;

            $scope.logout = function() {

                $http.post('api/auth/logout', {}).then(function(res) {

                    if (res.data.success === true) {

                        $scope.errorThrown = false;
                        $scope.errorMessage = null;

                        var response = res.data.data;
                        window.location.href = "/login.html";

                    } else {

                        $scope.errorThrown = true;
                        $scope.errorMessage = res.data.msg;

                    }

                });

            }

        }
    ]);
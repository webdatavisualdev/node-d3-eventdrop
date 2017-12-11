var app = angular.module("app", []);

app.controller("appCtrl", function($scope, $http) {
    $scope.smartList = [];
    $scope.leads = [];
    $scope.events = [];
    $scope.smart = 'choosen';

    $scope.init = function() {
        $http.get("api/saved_search").then(function (res) {
            $scope.smartList = res.data.data;
        });
    }

    $scope.chooseSmart = function() {
        if ($scope.smart !== 'choosen') {
            $http.get("api/lead", {params: {query: $scope.smart}}).then(function (res) {
                $scope.leads = res.data.data;
                $scope.leads.map(d => {
                    $http.get("api/activity", {params: {lead_id: d.id}}).then(function (res) {
                        $scope.events.push(res.data.data);
                        console.log($scope.events);
                    });
                });
            });
        }
    }

    $scope.init();
});

app.directive("eventDropChart", function($window) {
    return{
        restrict: "EA",
        template: "<svg width='850' height='200'></svg>",
        link: function(scope, elem, attrs){
            var salesDataToPlot=scope[attrs.chartData];
            var padding = 20;
            var pathClass = "path";
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;
                
            var d3 = $window.d3;
            var rawSvg = elem.find("svg")[0];
            var svg = d3.select(rawSvg);
        }
    };
});
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
        template: "<svg width='90vw' height='300'></svg>",
        link: function(scope, elem, attrs){
            var events = scope[attrs.eventData];
            var names = scope[attrs.nameData];
            var d3 = $window.d3;
            var rawSvg = elem.find("svg")[0];
            var svg = d3.select(rawSvg);
            var colors = d3.scaleOrdinal(d3.schemeCategory10);
            console.log(events);
                       
            var data = [];
            for (var i = 0 ; i < names.length ; i ++) {
                var innerData = [];
                events[i].map(d => {
                    innerData.push({date: new Date(d.date_created), html: d.body_html});
                });
                data.push({name: names[i].name, data: innerData});
            }

            var eventDropsChart = d3.chart.eventDrops()
                .date(d => d.date)
                .start(new Date('2016-08-08T15:05:15+00:00'))
                .eventLineColor((d, index) => colors(index))
                .mouseover(d => {
                });

            svg.datum(data)
                .call(eventDropsChart);
        }
    };
});
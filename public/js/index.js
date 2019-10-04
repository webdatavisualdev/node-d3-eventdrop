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
        $scope.leads = [];
        $scope.events = [];
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
        template: "<div id='drop_event'></div>",
        link: function(scope, elem, attrs){
            var events = scope[attrs.eventData];
            var names = scope[attrs.nameData];
            var d3 = $window.d3;
            var colors = d3.scaleOrdinal(d3.schemeCategory10);
            var eventColors = ['#aa3333', '#3333aa'];
            var formatTime = d3.timeFormat("%e %B, %Y");
                       
            var data = [];
            for (var i = 0 ; i < names.length ; i ++) {
                var innerData = [];
                events[i].map(d => {
                    if (d._type === 'Email' || d._type === 'Call') {
                        innerData.push({date: new Date(d.date_created), type: d._type === 'Email' ? 0 : 1, name: d.user_name, note: d._type === 'Call' ? d.note : d.body_text, duration: d._type === 'Call' ? d.duration : 0});                        
                    }
                });
                data.push({name: names[i].name, data: innerData});
            }

            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
          
            var eventDropsChart = d3.chart.eventDrops()
                .date(d => d.date)
                .start(new Date('2016-08-08T15:05:15+00:00'))
                .eventLineColor((d, index) => colors(index))
                .eventColor(d => eventColors[d.type])
                .mouseover(d => {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("<p class='note'>" + d.note + "</p>" + 
                        (d.duration > 0 
                            ? ("<p class='text-right'>" + formatDuration(d.duration) + "</p>") 
                            : "") + "<p class='text-right'>" + formatTime(d.date) + 
                            "</p><h4 class='text-right'>" + d.name + 
                            "</h4>")
                        .style("left", "10px")
                        .style("top", "10px");
                        // .style("left", (d3.event.pageX - 30) + "px")
                        // .style("top", (d3.event.pageY + 10) + "px");
                })
                .mouseout(d => {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            d3.select("#drop_event").datum(data)
                .call(eventDropsChart);

            d3.select("svg").attr("width", window.innerWidth - 200);

            function formatDuration(seconds) {
                return parseInt(seconds / 60) > 0 ? parseInt(seconds / 60) + " mins" : '' + parseInt(seconds % 60) > 0 ? parseInt(seconds % 60) + " secs" : '';
            }
        }
    };
});
(function(){
  var Graphics = {};
  Graphics.npm = {};

  Graphics.npm.downloads = function plot(anchor, info){
    MG.data_graphic({
      title: info.package,
      data: info.downloads,
      full_width: true,
      target: anchor,
      x_accessor: 'day',
      y_accessor: 'downloads'
    });
  };

  Graphics.npm.overview = function plot(anchor, modules){
    console.log(anchor, modules);
    var data = modules.map(function(module){
      return module.downloads;
    });
    var names = modules.map(function(module){
      return module.package;
    });

    MG.data_graphic({
      title: "modules",
      area: true,
      //chart_type: 'point',
      //description: "This line chart contains multiple lines.",
      data: data,
      animate_on_load: true,
      full_width: true,
      height: 300,
      target: anchor,
      legend: names,
      x_accessor: 'day',
      y_accessor: 'downloads',
      legend_target: '.legend',
      //aggregate_rollover: true
    });
  };

  Graphics.npm.totalDownloads = function plot(anchor, downloads){
    MG.data_graphic({
      title: "Total Downloads by Day",
      area: true,
      //chart_type: 'point',
      //description: "This line chart contains multiple lines.",
      data: downloads,
      animate_on_load: true,
      full_width: true,
      height: 300,
      target: anchor,
      x_accessor: 'day',
      y_accessor: 'downloads',
    });
  };

  var app = angular.module('app', ['ngMaterial']);

  app.factory('Request', function($http){
    function get(url){
      return new Promise(function(resolve, reject){
        $http({
          method: 'GET',
          url: url
        }).then(function (response) {
            resolve(response.data);
          }, function (err) {
            reject(err);
          });
      });
    };

    return {
      get: get
    };
  });

  app.factory('Github', function(Request){
    return github(Request);
  });

  app.factory('Npm', function(Request){
    return npm(Request);
  });

  app.directive('userNpmModules', function(Npm, Github){
    return {
      restrict: 'E',
      templateUrl: 'client/user-npm-modules.tpl.html',
      scope: {},
      controller: function($scope, $element){
        $scope.modules = [
          'shape-json',
          'shape-array',
          'difference-json',
          'brain-pact',
          'datamuse',
          'mock-realtime',
          'url-graph',
          'repute'
        ];
        $scope.loaded = false;

        var overview = angular.element($element).find('#overview')[0];
        var total = angular.element($element).find('#total')[0];
        Npm.modules($scope.modules)
        .then(function(response){
          Graphics.npm.overview(overview, response);
          var totalDownloads = Npm.totalDownloads();
          Graphics.npm.totalDownloads(total, totalDownloads);
          console.log('life cycle downloads: ', _.sumBy(totalDownloads, 'downloads'));
          $scope.loaded = true;
          $scope.$apply();
        });

        Github.getCommitsOnRepository('ansteh', 'shape-json')
        .then(function(response){
          console.log(response);
        })
        .catch(function(err){
          console.log(err);
        });
      }
    };
  });

  app.directive('npmModule', function(Npm){
    return {
      restrict: 'E',
      templateUrl: 'client/npm-module.tpl.html',
      scope: { name: "=" },
      controller: function($scope, $element){
        var anchor = angular.element($element).find('#downloads')[0];
        Graphics.npm.downloads(anchor, Npm.module($scope.name));

        /*Npm.downloads($scope.name)
        .then(function(downloads){
          Graphics.npm.downloads(anchor, downloads);
        })
        .catch(function(err){
          console.log(err);
        });*/
      }
    };
  });
}());

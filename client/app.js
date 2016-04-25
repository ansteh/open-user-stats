(function(){
  var Graphics = {};
  Graphics.npm = {};

  Graphics.npm.downloads = function plot(anchor, info){
    var data = info.downloads;
    MG.convert.date(data, 'day', '%Y-%m-%d');
    MG.data_graphic({
      title: info.package,
      //description: "dowloads of last month",
      data: data,
      full_width: true,
      target: anchor,
      x_accessor: 'day',
      y_accessor: 'downloads'
    });
  };

  Graphics.npm.overview = function plot(anchor, all){
    /*MG.data_graphic({
          title: "Multi-Line Chart",
          description: "This line chart contains multiple lines.",
          data: data,
          width: 600,
          height: 200,
          right: 40,
          target: '#fake_users2',
          legend: ['Line 1','Line 2','Line 3'],
          legend_target: '.legend'
      });*/
  };

  var app = angular.module('app', ['ngMaterial']);

  app.factory('Npm', function($http){
    function downloads(name){
      var url = 'https://api.npmjs.org/downloads/range/last-month/'+encodeURIComponent(name);
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
      downloads: downloads,
    };
  });

  app.directive('userNpmModules', function(){
    return {
      restrict: 'E',
      templateUrl: 'client/user-npm-modules.tpl.html',
      scope: {},
      controller: function($scope){
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
      }
    };
  });

  app.directive('npmModule', function(Npm){
    return {
      restrict: 'E',
      templateUrl: 'client/npm-module.tpl.html',
      scope: { name: "="},
      controller: function($scope, $element){
        var anchor = angular.element($element).find('#downloads')[0];
        console.log($scope.name);

        Npm.downloads($scope.name)
        .then(function(downloads){
          console.log(downloads);
          Graphics.npm.downloads(anchor, downloads);
        })
        .catch(function(err){
          console.log(err);
        });
      }
    };
  });
}());

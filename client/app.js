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

  Graphics.npm.overview = function plot(anchor, modules){
    console.log(anchor, modules);
    var data = modules.map(function(module){
      return MG.convert.date(module.downloads, 'day', '%Y-%m-%d');
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

  var app = angular.module('app', ['ngMaterial']);

  app.factory('Npm', function($http){

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

    function fillZero(number){
      return (number<10) ? '0'+number : number;
    };

    function today(){
      var now = new Date();
      return now.getFullYear()+'-'+fillZero(now.getMonth()+1)+'-'+fillZero(now.getDate());
    };

    function getDownloadsNpmUrl(name){
      return 'https://api.npmjs.org/downloads/range/2013-01-03:'+today()+'/'+encodeURIComponent(name);
    };

    function getModuleDownloads(name){
      //var url = 'https://api.npmjs.org/downloads/range/last-month/'+encodeURIComponent(name);
      var url = getDownloadsNpmUrl(name);
      return get(url);
    };

    function getModules(names){
      var downloads = [];
      names.forEach(function(name){
        downloads.push(getModuleDownloads(name));
      });
      return Promise.all(downloads);
    };

    return {
      downloads: getModuleDownloads,
      modules: getModules
    };
  });

  app.directive('userNpmModules', function(Npm){
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

        var overview = angular.element($element).find('#overview')[0];
        Npm.modules($scope.modules)
        .then(function(response){
          Graphics.npm.overview(overview, response);
        });
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

        Npm.downloads($scope.name)
        .then(function(downloads){
          //console.log(downloads);
          Graphics.npm.downloads(anchor, downloads);
        })
        .catch(function(err){
          console.log(err);
        });
      }
    };
  });
}());

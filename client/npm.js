var npm = function(Request){
  var modules = {};

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
    var url = getDownloadsNpmUrl(name);
    return Request.get(url)
    .then(function(module){
      MG.convert.date(module.downloads, 'day', '%Y-%m-%d');
      return module;
    });
  };

  function getModules(names){
    var downloads = [];
    names.forEach(function(name){
      downloads.push(getModuleDownloads(name));
    });
    return Promise.all(downloads)
    .then(function(downloads){
      downloads.forEach(function(module){
        modules[module.package] = module;
      });
      return downloads;
    });
  };

  function getModule(name){
    return modules[name];
  };

  function totalDownloadsByDay(){
    var downloads = _.reduce(_.values(modules), function(all, module){
      return _.concat(all, module.downloads);
    }, []);
    var groupedByDay = _.groupBy(downloads, 'day');
    var days = _.map(groupedByDay, function(group){
      return {
        day: group[0].day,
        downloads: _.sumBy(group, 'downloads')
      };
    });
    return days.sort(function(a, b){
      return b.day-a.day;
    });
  };

  return {
    downloads: getModuleDownloads,
    modules: getModules,
    module: getModule,
    totalDownloads: totalDownloadsByDay
  };
};

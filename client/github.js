var github = function(Request){
  var root = "https://api.github.com";

  var resolvePaths = function(paths){
    return _.chain([root])
      .concat(paths)
      .join("/")
      .value();
  };

  "https://api.github.com/repos/ansteh/shape-json/commits"

  var listCommitsOnRepository = function(owner, repo){
    return resolvePaths(["repos", owner, repo, "commits"]);
  };

  function promisify(func){
    var get = function(instance){
      if(_.isFunction(instance)){
        return instance;
      } else {
        return Request.get(instance);
      }
    };
    var wrap = _.curry(func);
  };

  return {
    getCommitsOnRepository: function(owner, repo){
      return Request.get(listCommitsOnRepository(owner, repo));
    }
  };
};

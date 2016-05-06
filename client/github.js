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
    var curried = _.curry(func);

    var get = function(param){
      var result = curried(param);
      if(_.isFunction(result)){
        return result;
      } else {
        return Request.get(result);
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

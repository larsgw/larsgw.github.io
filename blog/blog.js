function findByProp (array, prop, value, mod) {
  if (arguments.length > 2) {
    for (var index = 0; index < array.length; index++) {
      if ((typeof mod === 'function' ? mod.call(null, array[index][prop]) : array[index][prop]) === value) {
        return array[index]
      }
    }
  } else {
    for (var index = 0; index < array.length; index++) {
      if (array.hasOwnProperty(index)) {
        return array[index]
      }
    }
  }
}

function enlargeBloggerImg (url, size) {
  return url.replace(/\/s\d+\-c\//, '/s' + size + '-c/')
}

var data,
    cb = function (json) {
      data = json
    }

var app = angular.module('blogPage', ['ngRoute', 'ngSanitize'])

app.factory('Feed', ['$q', function ($q) {
  return {
    getData: function () {
      return $q(function (resolve) {
        resolve(data)
      })
    }
  }
}])

app.controller('blogController', ['$scope', 'Feed', function ($scope, Feed) {
  Feed.getData().then(function (data) {
    data.feed.entry = data.feed.entry.slice(0, 20)
    $scope.blog = data
  })
  
  $scope.enlargeBloggerImg = enlargeBloggerImg
  $scope.findByProp = findByProp
}])
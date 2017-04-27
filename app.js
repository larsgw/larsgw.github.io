var app = angular.module('homePage', ['ngRoute', 'ngSanitize'])

app.factory('Articles', ['$http', function ($http) {
  return {
    getData: function () {
      return $http.get('posts.json').then(function (response) {
        return response.data
      })
    }
  }
}])

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('')
  $routeProvider
    .when('/', {})
    .when('/:section/:article', {
      templateUrl: 'article.html',
      controller: 'articleController'
    })
}])

app.controller('homeController', ['$scope', 'Articles', function ($scope, Articles) {
  Articles.getData().then(function (data) {
    $scope.articles = data
  })
  
  $scope.getID = getID
  
  $scope.typeOf = function (value) {
    if (value === null) {
      return 'null'
    } else if(Array.isArray(value)) {
      return 'array'
    } else {
      return typeof value
    }
  }
}])

function findByProp (array, prop, value, mod) {
  if (arguments.length > 2) {
    for (var index = 0; index < array.length; index++) {
      if ((typeof mod === 'function' ? mod.call(null, array[index]) : array[index]) === value) {
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

function getID (title) {
  return (title || '').replace(/\W/g, '').toLowerCase()
}

app.controller('articleController',
  ['$scope', 'Articles', '$route', '$routeParams',
  function ($scope, Articles, $route, $routeParams) {
  
  var section = $routeParams.section
  
  Articles.getData().then(function (data) {
    var test = findByProp(
      data[section].sections,
      'title',
      $routeParams.article,
      function (section) {
        return getID(section.title)
      }
    )
    
    $scope.section = test
  })
  
  $scope.getID = getID
  
  $scope.typeOf = function (value) {
    if (value === null) {
      return 'null'
    } else if (Array.isArray(value)) {
      return 'array'
    } else {
      return typeof value
    }
  }
}])
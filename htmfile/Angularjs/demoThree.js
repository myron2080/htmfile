var app = angular.module('NewsPub', ['ngRoute']);
function routeConfig($routeProvider) {
    $routeProvider.
        when('/', {
            controller: 'ListController',
            templateUrl: 'test.html'
        }).
        when('/detail/:id', {
            controller: 'DetailController',
            templateUrl: 'detail.html'
        }).
        when('/edit/:id', {
            controller: 'EditController',
            templateUrl: 'edit.html'
        }).
        when('/list', {
            controller: 'ListController',
            templateUrl: 'test.html'
        }).
        when('/add', {
            controller: 'AddController',
            templateUrl: 'add.html'
        }).
        otherwise({
            redirectTo: '/'
        });
};

app.config(routeConfig);
/*
 function MyController($scope, $timeout) {
 var updateClock = function() {
 $scope.clock = new Date();
 $timeout(function() {
 updateClock();
 }, 1000);
 };
 updateClock();
 };
 app.config(MyController);*/

app.controller('timetest', function ($scope, $timeout, $parse, $interpolate) {

    //方法一：
    /* var updateClock = function() {
     $scope.clock = new Date();

     $timeout(function() {
     updateClock();
     }, 1000);
     };
     updateClock();*/

    //方法二：
    $scope.clock = {
        now: new Date()
    };
    var updateClock = function () {
        $scope.clock.now = new Date()
    };
    setInterval(function () {
        $scope.$apply(updateClock);
    }, 1000);
    updateClock();
});

app.controller('CityController', function ($scope) {
    $scope.cities = [
        {name: 'Seattle'},
        {name: 'San Francisco'},
        {name: 'Chicago'},
        {name: 'New York'},
        {name: 'Boston'}
    ];
});


/*
 app.directive('myDirective', function () {
 return {
 restrict: 'A',
 replace: true,
 scope: {
 myUrl: '@', //绑定策略
 myLinkText: '@' //绑定策略
 },
 template: '<a href="{{myUrl}}">' +
 '{{myLinkText}}</a>'
 };
 });
 */
app.directive('sidebox', function () {
    return {
        restrict: 'EA',
        scope: {
            title: '@'
        },
        transclude: true,
        template: '<div class="sidebox"><div class="content"><h2 class="header">{{ title }}</h2><span class="content" ng-transclude></span></div></div>'
    };
});
app.directive('myDirective', function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            myUrl: '=someAttr', // 经过了修改
            myLinkText: '@'
        },
        /* template: ' <div> <label>My Url Field:</label> <input type="text"ng-model="myUrl" /><a href="{{myUrl}}">{{myLinkText}}</a> </div>'*/
        template: ' <div> <label>My Url Field:</label> <input type="text"ng-model="myUrl" /><a href="{{myUrl}}">{{myLinkText}}</a> </div>'
    };
});
app.run(function ($rootScope, $timeout) {
    $rootScope.isDisabled = true;
    $timeout(function () {
        $rootScope.isDisabled = false;
    }, 5000);
});


var newsList = [{
    id: 1,
    title: 'title 1111',
    content: 'content 1111111',
    date: new Date()
}, {
    id: 2,
    title: 'title 2222',
    content: 'content 2222222',
    date: new Date()
}, {
    id: 3,
    title: 'title 3333',
    content: 'content 3333333',
    date: new Date()
}, {
    id: 4,
    title: 'title 4444',
    content: 'content 4444444',
    date: new Date()
}, {
    id: 3,
    title: 'title 5555',
    content: 'content 5555555',
    date: new Date()
}, {
    id: 3,
    title: 'title 6666',
    content: 'content 6666666',
    date: new Date()
}, {
    id: 3,
    title: 'title 7777',
    content: 'content 7777777',
    date: new Date()
}];

app.controller('ListController', function ($scope) {
    $scope.newsList = newsList;
});

app.controller('DetailController', function ($scope, $routeParams) {
    $scope.news = newsList[$routeParams.id - 1];
});

app.controller('AddController', function ($scope, $location) {
    $scope.title = '';
    $scope.content = '';
    $scope.add = function () {
        newsList.push({
            id: newsList.length + 1,
            title: $scope.title,
            content: $scope.content,
            date: new Date()
        });

        $location.path('list');
    }
});

app.controller('EditController', function ($scope, $routeParams, $location) {
    $scope.news = newsList[$routeParams.id - 1];
    $scope.update = function () {
        newsList[$routeParams.id - 1] = $scope.news;

        $location.path('list');
    }
})
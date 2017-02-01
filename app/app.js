'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.version',
    'hljs',
    'angular.filter',
    'ngAnimate'
]).
        config(['$routeProvider', function ($routeProvider) {
                $routeProvider.otherwise({redirectTo: '/view1'});
            }])
        .config(function (hljsServiceProvider) {
            hljsServiceProvider.setOptions({
                // replace tab with 4 spaces
                tabReplace: '    '
            });
        });

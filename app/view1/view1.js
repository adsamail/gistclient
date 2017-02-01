'use strict';
angular.module('myApp.view1', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/view1', {
                    templateUrl: 'view1/view1.html',
                    controller: 'View1Ctrl'
                });
            }])

        .controller('View1Ctrl', ['$scope', '$http', function ($scope, $http) {
                $scope.gists = []
                $scope.user = {avatar: "", name: "", email: "", username: ""} //We create an empty model (to illustrate)



                $scope.getGists = function (username) {

                    var rest = 'https://api.github.com/users/'


                    $http.get(rest + username).success(function (data, status, headers, config) {
                        if (data.login) {
                            //User exists!
                            $scope.user.avatar = data.avatar_url
                            $scope.user.name = data.name
                            $scope.user.email = data.email
                            $scope.user.username = username
                            //Fetch the gists for this user
                            $http.get(rest + username + '/gists').success(function (data, status, headers, config) {
                                $scope.gists = data
                                fetchSources($scope.gists)
                            })
                        }
                    })

                }

                function fetchSources(gists) {
                    gists.forEach(function (gist) {
                        Object.keys(gist.files).forEach(function (file) {
                            console.log(gist.files[file].raw_url)
                            gist.filesData = gist.filesData || []
                            var fileData = gist.files[file]


                            $http.get(fileData.raw_url).success(function (data, status, headers, config) {
                                fileData.source = escapeSource(data)
                                gist.filesData.push(fileData)
                            })
                        })

                        $http.get(gist.forks_url).success(function (data, status, headers, config) {
                            gist.forks = data
                        })
                    })


                }

                function escapeSource(source) {
                    return source.replace(/\'/g, '\"')
                }



                $scope.getGists('jookyboi')

            }])

        .directive('gist', function () {
            return {
                scope: {
                    gist: '='
                },
                controller: function ($scope, $element) {

                    $scope.expanded = false

                    $scope.color = function (text) {
                        return '#' + color(text)
                    }
                    $scope.toggle = function () {
                        $scope.expanded = !$scope.expanded
                    }
                    $scope.getFileType = function (filename) {
                        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : [filename];
                    }
                    $scope.getLanguage = function (file) {
                        if (file.language) {
                            return file.language
                        } else {
                            return $scope.getFileType(file.filename)[0]
                        }
                    }

                },
                restrict: 'E',
                templateUrl: 'partials/gist.html'
            };
        })

        .directive('info', function () {
            return {
                scope: {
                    user: '=',
                    gists: '=',
                    color: '&'
                },
                restrict: 'E',
                templateUrl: 'partials/info.html'
            };
        })

        .directive('tooltip', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    $(element).hover(function () {
                        // on mouseenter
                        $(element).tooltip('show');
                    }, function () {
                        // on mouseleave
                        $(element).tooltip('hide');
                    });
                }
            };
        })

        .directive('stopEvent', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    element.bind(attr.stopEvent, function (e) {
                        e.stopPropagation();
                    });
                }
            };
        })

        .animation('.slide', function () {
            var NG_HIDE_CLASS = 'ng-hide';
            return {
                beforeAddClass: function (element, className, done) {
                    if (className === NG_HIDE_CLASS) {
                        element.slideUp(done);
                    }
                },
                removeClass: function (element, className, done) {
                    if (className === NG_HIDE_CLASS) {
                        element.hide().slideDown(done);
                    }
                }
            }
        });
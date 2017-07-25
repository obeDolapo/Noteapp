(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'app/home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'app/login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'app/register/register.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', 'NotesService'];
    function run($rootScope, $location, $cookieStore, $http, NotesService) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        if(!localStorage.users) {
            $http.get('app/data/users.json').success(function(data) {
                localStorage.users = JSON.stringify(data.users);
                var notes = {};
                angular.forEach(data.users, function(user, index) {
                    var userNotes = [],
                        username = user.username;
                    for(var i=0; i < 30; i++) {
                        var title = 'Sample Note ' + (i+1) + ' for ' + username + ' !',
                            priority = i%3 + 1,
                            time = new Date();                    
                        time.setSeconds(time.getSeconds() + (i+1));
                        userNotes.push(NotesService.createNote(title, undefined, priority, time.getTime()));
                    }
                    notes[username] = userNotes;
                });
                localStorage.notes = JSON.stringify(notes);
            });
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();
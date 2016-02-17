'use strict';

var baseUrl = 'http://localhost:3000/api';
moment.locale('id');

/* Cari cara gimana bisa include file js lain 
tanpa perlu kita deklarasikann semua di index */

angular.module('Monitoring',[]);
angular.module('Authentication',[]);
angular.module('Penjadwalan',[]);

angular.module('App',[
	'Monitoring',
	'Authentication',
	'Penjadwalan',
	'ui.router',
	'ngCookies',
	'chart.js'
])

.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('monitoring', {
			url: '/',
			controller: 'HomeMonitoring',
			templateUrl: 'modules/monitoring/home.view.html'
		})
		.state('log', {
			url: '/log',
			controller: 'LogController',
			templateUrl: 'modules/monitoring/log.view.html'
		})
		.state('login', {
			url: '/login',
			controller: 'LoginController',
			templateUrl: 'modules/authentication/login.view.html'
		})
		.state('penjadwalan', {
			url: '/penjadwalan',
			templateUrl: 'modules/penjadwalan/penjadwalan.view.html',
			redirectTo: 'penjadwalan.praktikum'     // masih belum mau cari di google angular redirect to if access this page
		})
		.state('penjadwalan.praktikum', {
			url: '/praktikum',
			controller: 'PraktikumController',
			templateUrl: 'modules/penjadwalan/praktikum.view.html'
		})
		.state('penjadwalan.praktikum-tambahan', {
			url: '/praktikum-tambahan',
			controller: 'PraktikumTambahanController',
			templateUrl: 'modules/penjadwalan/praktikum-tambahan.view.html'
		});
})

.run(['$rootScope', '$location', '$cookieStore', '$http',
  function ($rootScope, $location, $cookieStore, $http) {
      // keep user logged in after page refresh
      $rootScope.globals = $cookieStore.get('globals') || {};
      if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
      }

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
          var restrictedPage = $.inArray($location.path(), ['/login','/','/log']) === -1;
          var loggedIn = $rootScope.globals.currentUser;
          if(restrictedPage && !loggedIn) {
              $location.path('/');
          }
      });
  }]);
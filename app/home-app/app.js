'use strict';
;(function () {
	angular.module('home', [
        'home.controllers',
        'ui.router',
    ])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
	    $urlRouterProvider.otherwise('/');
	    
	    $stateProvider
        .state('test', {
            url: '/test',
            templateUrl: 'templates/test.html',
            controller: 'TestCtrl',
        })
        
        
	}])
    .run(['$state', function($state){
        
    }]);
})();
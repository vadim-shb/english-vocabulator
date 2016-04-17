'use strict';

angular
    .module('webClient', [
        'ui.router'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/sign-in');

        $stateProvider
            .state('signIn', {
                url: '/sign-in',
                templateUrl: '/pages/sign-in/sign-in.html',
                controller: 'SignInController'
            })
            .state('dictionaries', {
                url: '/cabinet/dictionaries',
                templateUrl: '/pages/dictionaries/dictionaries.html',
                controller: 'DictionariesController'
            })
    });

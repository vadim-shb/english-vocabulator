'use strict';

angular
    .module('webClient', [
        'ui.router',
        'toaster'
    ])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authorizationHttpInterceptor');
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/sign-in');

        $stateProvider
            .state('signIn', {
                url: '/sign-in',
                templateUrl: '/pages/sign-in/sign-in.html',
                controller: 'SignInController'
            })
            .state('createWord', {
                url: '/cabinet/word/new',
                templateUrl: '/pages/edit-word/edit-word.html',
                controller: 'CreateWordController'
            })
            .state('learnCollections', {
                url: '/cabinet/learn-collections',
                templateUrl: '/pages/learn-collections/learn-collections.html',
                controller: 'LearnCollectionsController'
            })
            .state('learnCollection', {
                url: '/cabinet/learn-collection/{learnCollectionId}',
                templateUrl: '/pages/edit-learn-collection/edit-learn-collection.html',
                controller: 'EditLearnCollectionController'
            })
    });

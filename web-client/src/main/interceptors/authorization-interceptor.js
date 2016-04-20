'use strict';

angular.module('webClient').factory('authorizationHttpInterceptor', function($q, $injector) {
    return {
        request: function(config) {
            var accessToken = localStorage['accessToken'];
            if (accessToken) {
                config.headers.Authorization = accessToken;
            }
            return config;
        },
        responseError: function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
                $injector.get('userService').signOut();
            }
            return $q.reject(rejection);
        }
    };
});

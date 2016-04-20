'use strict';

angular.module('webClient').factory('userService', function($state) {

    return {
        signIn: function(accessToken, user) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
        },
        signOut: function() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            $state.go('signIn');
        },
        getUser: function() {
            return JSON.parse(localStorage.getItem('user'));
        }
    }

});

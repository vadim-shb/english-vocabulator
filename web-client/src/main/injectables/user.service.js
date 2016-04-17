'use strict';

angular.module('webClient').factory('userService', function() {

    return {
        signIn: function(accessToken, user) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
        },
        getUser: function() {
            return JSON.parse(localStorage.getItem('user'));
        }
    }

});

'use strict';

angular.module('webClient').controller('StudyMeaningsController', function($scope, $http, $stateParams, userService, studyService) {

    var unknownWords = buckets.Queue();
    var stepsToUnknownWordRepeat;
    
    function init() {
        refreshLearnCollection();
        generateStepsToUnknownWordRepeat();
    }

    function refreshLearnCollection() {
        $http.get('/api/user/' + userService.getUser().id + '/learn-collection/' + $stateParams.learnCollectionId)
            .then(function(response) {
                $scope.learnCollection = response.data.learnCollection;
                $scope.wordsInLearnCollection = response.data.wordsInLearnCollection;
                $scope.learnCollectionSize = $scope.wordsInLearnCollection.length;
                studyNextWord();
            });
    }

    function generateStepsToUnknownWordRepeat() {
        stepsToUnknownWordRepeat = Math.floor((Math.random() * 3) + 3);
    }
    
    function studyNextWord() {
        $scope.stage = 'CHOICE_STAGE';
        if (unknownWords.size() > 0) {
            stepsToUnknownWordRepeat -= 1;
            if (stepsToUnknownWordRepeat === 0) {
                $scope.studyingWord = unknownWords.dequeue();
                generateStepsToUnknownWordRepeat();
                return;
            }
        }
        
        var nextWordIndex = Math.floor((Math.random() * $scope.learnCollectionSize));
        $scope.studyingWord = $scope.wordsInLearnCollection[nextWordIndex];
    }

    $scope.knowWord = function(word) {
        switch ($scope.stage) {
            case 'CHOICE_STAGE':
                $scope.stage = 'CHECK_STAGE';
                break;
            case 'CHECK_STAGE':
                studyService.successMeaning(word);
                studyNextWord();
                break;
        }
    };

    $scope.doNotKnowWord = function(word) {
        studyService.failMeaning(word);
        unknownWords.add(word);
        studyNextWord();
    };

    init();
});
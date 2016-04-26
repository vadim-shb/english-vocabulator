'use strict';

angular.module('webClient').factory('studyService', function() {

    function loadResults() {
        var results = JSON.parse(localStorage.getItem('results'));
        if (!results) {
            results = [];
        }
        return results;
    }

    function saveResults(results) {
        localStorage.setItem('results', JSON.stringify(results));
        console.log(results);
    }

    function getResultForWord(results, wordId) {
        var result = results ? results.filter(function(result) {
            return result.wordId === wordId
        })[0] : undefined;
        if (!result) {
            result = {
                wordId: wordId,
                successMeaning: 0,
                successWrite: 0,
                successPronounce: 0,
                failMeaning: 0,
                failWrite: 0,
                failPronounce: 0
            };
            results.push(result);
        }
        return result;
    }
    
    function addResult(wordId, statistic) {
        var results = loadResults();
        var result = getResultForWord(results, wordId);
        result[statistic] += 1;
        saveResults(results);
    }

    return {
        successMeaning: function(word) {
            addResult(word.id, 'successMeaning');
        },
        successWrite: function(word) {
            addResult(word.id, 'successWrite');
        },
        successPronounce: function(word) {
            addResult(word.id, 'successPronounce');
        },
        failMeaning: function(word) {
            addResult(word.id, 'failMeaning');
        },
        failWrite: function(word) {
            addResult(word.id, 'failWrite');
        },
        failPronounce: function(word) {
            addResult(word.id, 'failPronounce');
        }
    }

});

(function () {
    'use strict';

    angular
        .module('app')
        .factory('NotesService', NotesService);

    NotesService.$inject = ['$timeout', '$filter', '$q'];
    function NotesService($timeout, $filter, $q) {

        var service = {};

        service.createNote = createNote;
        service.getNotesForUser = getNotesForUser;
        service.setNotesForUser = setNotesForUser;

        return service;

        function Note(title, content, priority, timestamp){
            this.title = title || chance.word({syllables: 5});
            this.content = content || chance.sentence({words: 50});
            this.priority = priority || 2;
            this.timestamp = timestamp || new Date().getTime();
            return this;
        }

        function createNote(title, content, priority, timestamp){
            return new Note(title, content, priority, timestamp);
        }

        function getNotes() {
            if(!localStorage.notes){
                localStorage.notes = JSON.stringify({});
            }

            return JSON.parse(localStorage.notes);
        }

        function setNotes(notes) {
            localStorage.notes = JSON.stringify(notes);
        }
        function getNotesForUser(username) {
            var deferred = $q.defer();
            deferred.resolve((function(){
                var notes = getNotes();
                return notes[username];
            })());
            return deferred.promise;
        }

        function setNotesForUser(username, notes) {
            var deferred = $q.defer();
            deferred.resolve((function(){
                var allnotes = getNotes();
                allnotes[username] = notes;
                setNotes(allnotes);
                return true;
            })());
            return deferred.promise;
        }
    }
})();
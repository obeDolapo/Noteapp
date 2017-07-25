angular.module('app')
.controller('HomeController', ['UserService', 'NotesService', 'FlashService', '$rootScope', '$scope', HomeController]);

function HomeController(UserService, NotesService, FlashService, $rootScope, $scope) {
        $scope.user = null;
        $scope.notes = [];
        $scope.noteSelection = [];
        $scope.username = $rootScope.globals.currentUser.username;
        
        initController();

        function initController() {
            loadCurrentUser();
            loadNotes();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($scope.username)
                .then(function (user) {
                    $scope.user = user;
                });
        }

        function loadNotes() {
            NotesService.getNotesForUser($scope.username)
            .then(function(notes){
                console.log(notes);
                $scope.notes = notes || [];
            });
        }

        $scope.selectNote = function(){
            $scope.$evalAsync(function($scope){
                $scope.selectingNote = true;
                console.log($scope.noteSelection);
                console.log('selectingNote', $scope.selectingNote);
            });
            };

        $scope.deleteNote = function(){
                $scope.selectingNote = false;
                console.log($scope.noteSelection);
                console.log('selectingNote', $scope.selectingNote);
                console.log('before deleting notes');
                console.log($scope.notes);
                $scope.selectionCount = 0;
                var selectedNotes = $scope.noteSelection;
                for (var i = selectedNotes.length - 1; i >= 0; i--){
                    if(selectedNotes[i]) {
                        $scope.notes.splice(i, 1);
                        $scope.noteSelection.splice(i, 1);
                        $scope.selectionCount++;
                    }
                }
                console.log('after deleting notes');
                console.log($scope.notes);
                NotesService.setNotesForUser($scope.username, $scope.notes)
                .then(function(){FlashService.Success($scope.selectionCount + ' Notes Deleted Successfully !', false, 3000);},
                function(){FlashService.Error('Error while deleting Notes!', false, 3000);});


        };

        $scope.removeNote = function($index, $event){
            $scope.notes.splice($index, 1)
            NotesService.setNotesForUser($scope.username, $scope.notes)
                .then(function(){FlashService.Success('Note Deleted Successfully !', false, 3000);},
                function(){FlashService.Error('Error while deleting Note!', false, 3000);});

        };

        $scope.editNote = function($index, $event){
            var currentNote = $scope.notes[$index];
            $scope.noteTitle = currentNote.title;
            $scope.noteContent = currentNote.content;
            $scope.notePriority = currentNote.priority;
            $scope.editingNote = true;
            $('#noteModal').modal('show');
            $scope.notes.splice($index, 1);
        };

        $scope.addNote = function(){
            $scope.noteTitle = "";
            $scope.noteContent = "";
            $scope.notePriority = 2;
            $scope.editingNote = false;
            $('#noteModal').modal('show');
        };

        $scope.saveNote = function(){
            console.log($scope.notePriority);
            $scope.notes.push(NotesService.createNote($scope.noteTitle, $scope.noteContent, $scope.notePriority));
            $('#noteModal').modal('hide');
            NotesService.setNotesForUser($scope.username, $scope.notes)
            .then(function(){FlashService.Success('Note Added!', false, 3000);},
                function(){FlashService.Error('Error while adding Note!', false, 3000);});
        };
    }

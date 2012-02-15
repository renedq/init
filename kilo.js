var db;
var jQT = $.jQTouch({
  icon: 'kilo.png',
  statusBar: 'black'
});

$(document).ready(function(){
  $('#createEntry form').submit(createEntry);
  var shortName = 'init';
  var version = '1.0';
  var displayName = 'init';
  var maxSize = 65536;
  db = openDatabase(shortName, version, displayName, maxSize);
  db.transaction(
    function (transaction) {
      transaction.executeSql(
        'CREATE TABLE IF NOT EXISTS init ' +
          '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'name TEXT NOT NULL, ' + 
            'score FLOAT NOT NULL);'
      );
    }
  );
  refreshEntries();
});

function refreshEntries() {
 // $('#home ul li:gt(0)').remove();
  db.transaction(
    function(transaction) {
      transaction.executeSql(
        'SELECT * FROM init ORDER BY id;', [], 
        function (transaction, result) {
          for (var i=0; i < result.rows.length; i++){
            var row = result.rows.item(i);
            var newEntryRow = $('#entryTemplate').clone();
            newEntryRow.removeAttr('id');
            newEntryRow.removeAttr('style');
            newEntryRow.data('entryId', row.id);
            newEntryRow.appendTo('#home ul');
            newEntryRow.find('.name').text(row.name);
            newEntryRow.find('.score').text(row.score);
            newEntryRow.find('.delete').click(function(){
              var clickedEntry = $(this).parent();
              var clickedEntryId = clickedEntry.data('entryId');
              deleteEntryById(clickedEntryId);
              clickedEntry.slideUp();
            });
          }
        },
        errorHandler
      );
    }
  );
}

function home() {
  refreshEntries();
}

function createEntry() {
  var name = $('#name').val();
  var score = $('#score').val();
  db.transaction(
    function (transaction) {
      transaction.executeSql(
        'INSERT INTO init (name, score) VALUES (?, ?);', 
        [name, score],
        function(){
          refreshEntries();
          jQT.goBack();
        },
        errorHandler
      );
    }
  );
  return false;
}

function errorHandler(transaction, error) {
  alert('Oops. Error was '+error.message+' (Code '+error.code+')');
  return true;
}

function deleteEntryById(id){
  db.transaction(
    function(transaction) {
      transaction.executeSql('DELETE FROM init WHERE id=?;', [id], null, errorHandler);
    }
  );
}

var db;
var token=0;
var round=1;
var jQT = $.jQTouch({
  icon: 'kilo.png',
  statusBar: 'black'
});

$(document).ready(function(){
  $('#createEntry form').submit(createEntry);
  $('#combat').bind('pageAnimationStart', combatList);

  var shortName = 'init';
  var version = '1.0';
  var displayName = 'init';
  var maxSize = 65536;
  db = openDatabase(shortName, version, displayName, maxSize);
  db.transaction(
    function (transaction) {
      transaction.executeSql(
        //'DROP TABLE init;' /*+
        'CREATE TABLE IF NOT EXISTS init ' +
          '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'name TEXT NOT NULL, ' + 
            'modifier INTEGER NOT NULL, ' +
            'score FLOAT NOT NULL);'
      );
    }
  );
  refreshEntries();
});

function nextPC() {
  if (token == ($('.token').length - 1)){
    setInitToken(1);
    round++;
    $('#round').text(round);
  } else {
    setInitToken(token + 1);
  }
}

function setInitToken(newValue) {
  $('#combat-list img.token').attr("src","images/token_blank.png");
  token = newValue;
  $($('#combat-list img.token').get(token)).attr("src","images/token.jpg");
}

function resetInitiative() {
  round=1;
  token=0;
  $('#combat-list img.token').attr("src","images/token_blank.png");
  $('#round').text(round);
}

function refreshEntries() {
  $('#body-list li:gt(0)').remove();
  db.transaction(
    function(transaction) {
      transaction.executeSql(
        'SELECT * FROM init ORDER BY score desc, modifier desc;', [], 
        function (transaction, result) {
          for (var i=0; i < result.rows.length; i++){
            var row = result.rows.item(i);
            var newEntryRow = $('#entryTemplate').clone();
            newEntryRow.removeAttr('id');
            newEntryRow.removeAttr('style');
            newEntryRow.data('entryId', row.id);
            newEntryRow.appendTo('#body-list');
            newEntryRow.find('.name').text(row.name);
            var mod = row.modifier;
            if (mod < 0) {
              newEntryRow.find('.modifier').text(mod);
            } else {
              newEntryRow.find('.modifier').text("+"+mod);
            }
            newEntryRow.find('.score').text(row.score);
            newEntryRow.find('.edit').click(function(){
              var clickedEntry = $(this).parent();
              var clickedEntryId = clickedEntry.data('entryId');
              deleteEntryById(clickedEntryId);
              clickedEntry.slideUp();
            });
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

function combatList(){
  $('#combat-list li:gt(0)').remove();
  $('#next').click(nextPC);
  $('#reset').click(resetInitiative);
  db.transaction(
    function(transaction) {
      transaction.executeSql(
        'SELECT * FROM init ORDER BY score desc, modifier desc;', [],
          function (transaction, result) {
            for (var i=0; i<result.rows.length; i++){
              var row = result.rows.item(i);
              var newEntryRow = $('#combatList').clone();
              newEntryRow.removeAttr('id');
              newEntryRow.removeAttr('style');
              newEntryRow.data('entryId', row.id);
              newEntryRow.appendTo('#combat-list');
              newEntryRow.find('.name').text(row.name);
              newEntryRow.find('.score').text(row.score);
              newEntryRow.find('.delay').click(function(){
                var clickedEntry = $(this).parent();
                var clickedEntryId = clickedEntry.data('entryId');
                  alert('Delay not implemented');
              });
            }
          },
          errorHandler
      );
      setInitToken(token);
    }
  );
}

function entryIsValid() {
  return $('#newpc').valid();
}

function createEntry() {
  if (entryIsValid()) {
    var name = $('#name').val();
    var modifier = $('#modifier').val();
    var score = $('#score').val();
    db.transaction(
      function (transaction) {
        transaction.executeSql(
          'INSERT INTO init (name, modifier, score) VALUES (?, ?, ?);', 
          [name, modifier, score],
          function(){
            refreshEntries();
            jQT.goBack();
          },
          errorHandler
        );
      }
    );
    $('#name').val("");
    $('#modifier').val("");
    $('#score').val("");
  }
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

function updateInitiative(id){
  db.transaction(
    function(transaction) {
      transaction.executeSql('UPDATE FROM init WHERE id=?;', [id], null, errorHandler);
    }
  );
}

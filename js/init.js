var db;
var token=0;
var round=1;
var jQT = $.jQTouch({
  icon: 'kilo.png',
  statusBar: 'black'
});

$(document).ready(function(){
  $('#createEntry form').submit(createEntry);
  //$('#combat').bind('pageAnimationStart', combatList);

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
  $('#home img.token').attr("src","images/token_blank.png");
  token = newValue;
  $($('#home img.token').get(token)).attr("src","images/token.jpg");
}

function resetInitiative() {
  round=1;
  token=0;
  $('#home img.token').attr("src","images/token_blank.png");
  $('#round').text(round);
}

function refreshEntries() {
  $('#body-list li:gt(0)').remove();
  $('#next').click(nextPC);
  $('#reset').click(resetInitiative);
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
            newEntryRow.find('.score').val(row.score);
            newEntryRow.find('.score').change(function(){
              var score = $(this).val();
              if (!isNumeric(score)) {
                score = 0;
              }
              var clickedEntry = $(this).parent();
              var clickedEntryId = clickedEntry.data('entryId');
              updateInitiative(clickedEntryId, score);
              refreshEntries();
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

function isNumeric(value){
  return (value - 0) == value && value.length > 0;
}

/*function combatList(){
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
}*/

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

function updateInitiative(id, score){
  db.transaction(
    function(transaction) {
      transaction.executeSql('UPDATE init SET score=? WHERE id = ? ;', [score, id]);
    }
  );
}

var db;
var token=1;
var round=1;
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
  createTable();
  refreshEntries();
});

function dropTable(){
  runSQL("DROP TABLE init;");
}

function createTable(){
  runSQL('CREATE TABLE IF NOT EXISTS init ' +
          '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
          'name TEXT NOT NULL, ' + 
          'modifier INTEGER NOT NULL, ' +
          'score FLOAT NOT NULL);');
}

function runSQL(SQL, vars, func){
  db.transaction(
    function (transaction){
      transaction.executeSql(SQL, vars, func, errorHandler);
    }
  );
}

function nextPC() {
  if ($('.token').length > 1){
    if (token >= ($('.token').length - 1)){
      setInitToken(0);
      round++;
      $('#round').text(round);
    } else {
      setInitToken(token + 1);
    }
  }
}

function setInitToken(newValue) {
  $('#home img.token').attr("src","images/token_blank.png");
  token = newValue;
  $($('#home img.token').get(token)).attr("src","images/token.jpg");
}

function resetInitiative() {
  round=1;
  token=1;
  $('#home img.token').attr("src","images/token_blank.png");
  $('#round').text(round);
}

function clear(){
  runSQL('UPDATE init SET score=0');
  refreshEntries();
}

function clearAll(){
  dropTable();
  createTable();
  token=1;
  round=1;
  $('#round').text(round);
  refreshEntries();
}

function refreshEntries() {
  $('#body-list li:gt(0)').remove();
  $('#next').click(nextPC);
  $('#reset').click(resetInitiative);
  $('#clear').click(clear);
  $('#clearAll').click(clearAll);
  runSQL('SELECT * FROM init ORDER BY score desc, modifier desc;', [], 
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
    }
  );
}

function isNumeric(value){
  return (value - 0) == value && value.length > 0;
}

function entryIsValid() {
  return $('#newpc').valid();
}

function createEntry() {
  if (entryIsValid()) {
    var name = $('#name').val();
    var modifier = $('#modifier').val();
    var score = $('#score').val();
    runSQL('INSERT INTO init (name, modifier, score) VALUES (?, ?, ?);', 
      [name, modifier, score],
      function(){
        refreshEntries();
        jQT.goBack();
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
  runSQL('DELETE FROM init WHERE id=?;', [id], null);
  refreshEntries();
}

function updateInitiative(id, score){
  runSQL('UPDATE init SET score=? WHERE id = ? ;', [score, id]);
}

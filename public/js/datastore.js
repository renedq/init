(function() {
  var shortName = 'init';
  var version = '1.01';
  var displayName = 'init';
  var maxSize = 65536;
  var db;

  this.eachPlayer = function(callback) {
    runSQL('SELECT * FROM init ORDER BY score desc, modifier desc;', [], 
      function (__, result) {
        for (var i=0; i < result.rows.length; i++){
          var row = result.rows.item(i);
          callback(row);
        }
      }
    );
  };

  this.__db = function() {
    if (!db) 
      db = openDatabase(shortName, version, displayName, maxSize);
    return db;
  };

  function runSQL(SQL, vars, callback){
    __db().transaction(
      function (transaction){
        transaction.executeSql(SQL, vars, callback, errorHandler);
      }
    );
  }

  function dropTable(){
    // FIXME Not tested
    runSQL("DROP TABLE init;");
  }

  function createTable(){
    // FIXME Not tested
    runSQL('CREATE TABLE IF NOT EXISTS init ' +
            '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'name TEXT NOT NULL, ' + 
            'modifier INTEGER NOT NULL, ' +
            'score FLOAT NOT NULL);');
  }

  function errorHandler(__, error) {
    alert('Oops. Error was '+error.message+' (Code '+error.code+')');
    return true;
  }
})();

(function() {
  var shortName = 'init-02';
  var version = '1.02';
  var displayName = 'init';
  var maxSize = 65536;
  var connection;
  this.datastore = {
    eachPlayer: eachPlayer,
    addPlayer: addPlayer,
    deletePlayer: deletePlayer,
    resetDatastore: resetDatastore,
    clearScores: clearScores,
    updateScore: updateScore,
    setValue: setValue,
    withValue: withValue
  };

  function eachPlayer(callback) {
    runSQL('SELECT * FROM init ORDER BY score desc, modifier desc;', [], 
      function (__, result) {
        for (var i=0; i < result.rows.length; i++){
          var row = result.rows.item(i);
          callback(row);
        }
      }
    );
  };

  function addPlayer(name, modifier, callback) {
    runSQL('INSERT INTO init (name, modifier, score) VALUES (?, ?, 0);', 
       [name, modifier], callback);
  }
  
  function deletePlayer(id) {
    runSQL('DELETE FROM init WHERE id=?;', [id]);
  }

  function resetDatastore(){
    runSQL("DROP TABLE IF EXISTS init;");
    runSQL("DROP TABLE IF EXISTS settings;");
    createAllTables();
  }

  function clearScores(callback) {
    runSQL('UPDATE init SET score=0', [], callback);
  };

  function updateScore(id, score) {
    runSQL('UPDATE init SET score=? WHERE id = ? ;', [score, id]);
  }

  function setValue(name, value) {
    runSQL('INSERT or REPLACE INTO settings(name, value) VALUES(?,?);', [name,value]);
  }

  function withValue(name, callback) {
    runSQL('SELECT value FROM settings WHERE name=?', [name], function(__, result){
      if (result.rows.length == 0){
        callback(undefined);
      } else {
        callback(result.rows.item(0).value);
      }
    });
  }

  function dbConn() {
    if (!connection) {
      connection = openDatabase(shortName, version, displayName, maxSize);
      createAllTables();
    }
    return connection;
  };

  function runSQL(SQL, vars, callback){
    dbConn().transaction(
      function (transaction){
        transaction.executeSql(SQL, vars, callback, errorHandler);
      }
    );
  }

  function createAllTables() {
    createTable('settings', 
      '(name TEXT NOT NULL PRIMARY KEY, ' + 
      'value INTEGER NOT NULL);'); 
    createTable('init', 
      '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
      'name TEXT NOT NULL, ' + 
      'modifier INTEGER NOT NULL, ' +
      'score FLOAT NOT NULL);');
  }

  function createTable(tableName, columns){
    runSQL('CREATE TABLE IF NOT EXISTS ' + tableName + columns);
  }

  function errorHandler(__, error) {
    alert('Oops. Error was '+error.message+' (Code '+error.code+')');
    return true;
  }
})();

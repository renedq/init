(function() {
  var shortName = 'init';
  var version = '1.01';
  var displayName = 'init';
  var maxSize = 65536;
  var connection;

  this.eachPlayer = function(callback) {
    createPlayerTable();
    runSQL('SELECT * FROM init ORDER BY score desc, modifier desc;', [], 
      function (__, result) {
        for (var i=0; i < result.rows.length; i++){
          var row = result.rows.item(i);
          callback(row);
        }
      }
    );
  };

  this.addPlayer = function(name, modifier, callback) {
    createPlayerTable();
    runSQL('INSERT INTO init (name, modifier, score) VALUES (?, ?, 0);', 
       [name, modifier], callback);
  }
  
  this.deletePlayer = function(id) {
    runSQL('DELETE FROM init WHERE id=?;', [id]);
  }

  // FIXME This needs a new name
  this.clearPlayers = function(){
    runSQL("DROP TABLE IF EXISTS init;");
    runSQL("DROP TABLE IF EXISTS settings;");
  }

  this.clearScores = function(callback) {
    runSQL('UPDATE init SET score=0', [], callback);
  };

  this.updateScore = function(id, score) {
    runSQL('UPDATE init SET score=? WHERE id = ? ;', [score, id]);
  }

  this.setRound = function(roundNum) {
    createTable('settings', 
      '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
      'round INTEGER NOT NULL);'); 
    runSQL('INSERT or REPLACE INTO settings(id, round) VALUES(0,?);', [roundNum]);
  }

  this.withRound = function(callback) {
    runSQL('SELECT round FROM settings', [], function(__, result){
      callback(result.rows.item(0).round);
    });
  }

  function dbConn() {
    if (!connection) 
      connection = openDatabase(shortName, version, displayName, maxSize);
    return connection;
  };

  function runSQL(SQL, vars, callback){
    dbConn().transaction(
      function (transaction){
        transaction.executeSql(SQL, vars, callback, errorHandler);
      }
    );
  }

  function createPlayerTable(){
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

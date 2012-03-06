(function() {
  var shortName = 'init';
  var version = '1.01';
  var displayName = 'init';
  var maxSize = 65536;
  var connection;

  this.eachPlayer = function(callback) {
    createTable();
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
    createTable();
    runSQL('INSERT INTO init (name, modifier, score) VALUES (?, ?, 0);', 
       [name, modifier], callback);
  }
  
  this.deletePlayer = function(id) {
    runSQL('DELETE FROM init WHERE id=?;', [id]);
  }

  this.clearPlayers = function(){
    runSQL("DROP TABLE IF EXISTS init;");
  }

  this.clearScores = function(callback) {
    runSQL('UPDATE init SET score=0', [], callback);
  };

  this.updateScore = function(id, score) {
    runSQL('UPDATE init SET score=? WHERE id = ? ;', [score, id]);
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

  function createTable(){
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

describe('Datastore', function() {
  var mockDB;
  beforeEach(function() {
    if (!mockDB) {
      mockDB = jasmine.createSpyObj('mock database', ['transaction']);
      spyOn(global, 'openDatabase').andReturn(mockDB);
    }
  });

  describe('when fetching the list of players', function() {
    var players, execFunc, mockTransaction;

    beforeEach(function() {
      players = [];
      eachPlayer(function(player) {
        players.push(player);
      });
      mockTransaction = jasmine.createSpyObj('mock transaction', ['executeSql']);
      _.each(mockDB.transaction.argsForCall, function(args) {
        execFunc = args[0];
        execFunc(mockTransaction);
      });
    });

    it('sorts by score and modifier descending', function() {
      var expectedSql = 'SELECT * FROM init ORDER BY score desc, modifier desc;';
      expect(mockTransaction.executeSql.argsForCall[1][0]).toEqual(expectedSql);
    });

    it('invokes the callback once for each player', function() {
      var mockData = [{id:0, name:"Carl", modifier:3, score:19}];
      var executeSqlCallback = mockTransaction.executeSql.argsForCall[1][2];
      executeSqlCallback('',{
        rows: {
          length: mockData.length, 
          item: function(i) { return mockData[i]; }
        }
      });

      expect(players).toEqual(mockData);
    });

    it('uses the error handler when running queries', function() {
      spyOn(global, 'alert');
      var handler = mockTransaction.executeSql.argsForCall[0][3];
      var error = {
        message: "bad",
        code: 1
      };
      expect(handler(1,error)).toBeTruthy();
      expect(global.alert).toHaveBeenCalledWith("Oops. Error was bad (Code 1)");
    });

    it('creates the table if it does not exist', function() {
      expect(mockTransaction.executeSql.argsForCall[0][0]).toMatch(/^CREATE TABLE IF NOT EXISTS init*./);
    });
  });
});

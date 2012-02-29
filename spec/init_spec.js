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
      execFunc = mockDB.transaction.argsForCall[0][0];
      mockTransaction = jasmine.createSpyObj('mock transaction', ['executeSql']);
      execFunc(mockTransaction);
    });

    it('sorts by score and modifier descending', function() {
      var expectedSql = 'SELECT * FROM init ORDER BY score desc, modifier desc;';
      expect(mockTransaction.executeSql.argsForCall[0][0]).toEqual(expectedSql);
    });

    it('invokes the callback once for each player', function() {
      var mockData = [{id:0, name:"Carl", modifier:3, score:19}];
      var executeSqlCallback = mockTransaction.executeSql.argsForCall[0][2];
      executeSqlCallback('',{
        rows: {
          length: mockData.length, 
          item: function(i) { return mockData[i]; }
        }
      });

      expect(players).toEqual(mockData);
    });
  });
});

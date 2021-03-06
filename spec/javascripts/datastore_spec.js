describe('Datastore', function() {
  var ds;
  beforeEach(function() {
    ds = datastore;
    ds.resetDatastore();
  });

  it('is empty by default', function() {
    expect(ds.getPlayers()).toEqual([]);
    expect(ds.getValue('nextID')).toEqual(1);
  });

  it('can add a new player to the datastore', function() {
    ds.addPlayer("Carl", 1);
    expect(ds.getPlayers()).toEqual([{id: 1, name: "Carl", modifier:1, score:0}]);
  });
  
  it('can update the score for a player', function() {
    ds.addPlayer("Carl", 1);
    ds.updateScore(1, 10);
    expect(ds.getPlayers()[0].score).toEqual(10);
  });

  it('can clear the players even if there arent any', function() {
    ds.resetDatastore();
    expect(ds.getPlayers()).toEqual([]);
  });

  it('can store key value pairs', function() {
    var mySetting;
    ds.setValue("mySetting",42);
    ds.withValue("mySetting", function(v) {
      mySetting = v;
    });
    expect(mySetting).toEqual(42);
  });

  it('values are undefined by default', function() {
    ds.withValue("not a setting", function(v) {
      expect(v).toBeUndefined();
    });
  });

  describe('when players are added', function() {
    beforeEach(function() {
      ds.addPlayer("Carl", 1);
      ds.updateScore(1, 10);

      ds.addPlayer("Bbraidingttton", -1);
      ds.updateScore(2, 11);

      ds.addPlayer("Billy", 7);
      ds.updateScore(3, 10);
    });
  
    it('the nextID will be incremented', function() {
      expect(ds.getValue('nextID')).toEqual(4);
    });

    it('can clear all the players scores', function() {
      ds.clearScores();
      var scores = _.pluck(ds.getPlayers(),'score');
      expect(scores).toEqual([0, 0, 0]);
    });

    it('can delete a single player', function() {
      ds.deletePlayer(1);
      expect(ds.getPlayers().length).toEqual(2);
    });
    
    it('sorts scores in descending order by score and then by modifier', function() {
      expect(ds.getPlayers()[0].name).toEqual("Bbraidingttton");
      expect(ds.getPlayers()[1].name).toEqual("Billy");
      expect(ds.getPlayers()[2].name).toEqual("Carl");
    });

    it('sorts a new player at the bottom', function() {
      ds.addPlayer("Herro", 6);
      expect(ds.getPlayers()[3].name).toEqual("Herro");
    });
  });
});

describe('Datastore', function() {
  afterEach(function() {
    clearPlayers();
  });

  function getPlayers() {
    var players = [];
    eachPlayer(function(player) {
      players.push(player);
    });
    return players;
  }

  it('is empty by default', function() {
    expect(getPlayers()).toEqual([]);
  });

  it('can add a new player to the datastore', function() {
    addPlayer("Carl", 1);
    expect(getPlayers()).toEqual([{id: 1, name: "Carl", modifier:1, score:0}]);
  });
  
  it('can update the score for a player', function() {
    addPlayer("Carl", 1);
    updateScore(1, 10);
    expect(getPlayers()[0].score).toEqual(10);
  });

  it('can clear the players even if there arent any', function() {
    clearPlayers();
    expect(getPlayers()).toEqual([]);
  });

  it('tracks the current round', function() {
    var round;
    setRound(42);
    withRound(function(r) {
      round = r;
    });
    expect(round).toEqual(42);
  });

  describe('when players are added', function() {
    beforeEach(function() {
      addPlayer("Carl", 1);
      updateScore(1, 10);

      addPlayer("Bbraidingttton", -1);
      updateScore(2, 11);

      addPlayer("Billy", 7);
      updateScore(3, 10);
    });

    it('sorts scores in descending order by score and then by modifier', function() {
      expect(getPlayers()[0].name).toEqual("Bbraidingttton");
      expect(getPlayers()[1].name).toEqual("Billy");
      expect(getPlayers()[2].name).toEqual("Carl");
    });

    it('can clear all the players scores', function() {
      clearScores();
      var scores = _.pluck(getPlayers(),'score');
      expect(scores).toEqual([0, 0, 0]);
    });

    it('can delete a single player', function() {
      deletePlayer(1);
      expect(getPlayers().length).toEqual(2);
    });
  });
});

(function() {
  this.datastore = {
    eachPlayer: eachPlayer,
    addPlayer: addPlayer,
    deletePlayer: deletePlayer,
    resetDatastore: resetDatastore,
    clearScores: clearScores,
    updateScore: updateScore,
    setValue: setValue,
    withValue: withValue,
    getPlayers: getPlayers,
    playerCount: function() {}
  };

  function eachPlayer(callback) {
    _.each(getPlayers(), function(player) {
      callback(player);
    });
  }

  function addPlayer(name, modifier, callback) {
    var players = getPlayers();
    players.push({id: players.length + 1, name: name, modifier: modifier, score: 0});
    store('players', players);
  }
  
  function deletePlayer(id) {
    var players = _.reject(getPlayers(), function (player){return player.id == id} );
    store('players', players);
  }

  function resetDatastore(){
    store('players', []);
  }

  function clearScores(callback) {
    mapPlayers(function(player) {
      player.score=0; 
    });
  };

  function updateScore(id, score) {
    mapPlayers(function(player) {
      if (player.id == id) {
        player.score=score;
      }
    });
  }

  function setValue(name, value) {
    var settings = fetch('settings', '{}');
    settings[name] = value;
    store('settings', settings);
  }

  function withValue(name, callback) {
    var settings = fetch('settings', '{}');
    callback(settings[name]);
  }

  function fetch(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key) || defaultValue);
  }

  function store(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  function getPlayers() {
    return fetch('players', "[]");
  }

  function mapPlayers(callback) {
    var players = getPlayers();
    if (callback) {
      _.each(players, callback);
      store('players', players);
    }
    return players;
  }
})();

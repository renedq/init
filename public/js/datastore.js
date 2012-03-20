(function() {
  this.datastore = {
    eachPlayer: eachPlayer,
    addPlayer: addPlayer,
    deletePlayer: deletePlayer,
    resetDatastore: resetDatastore,
    clearScores: clearScores,
    updateScore: updateScore,
    setValue: setValue,
    getValue: getValue,
    withValue: withValue,
    getPlayers: getPlayers
  };

  function eachPlayer(callback) {
    _.each(getPlayers(), function(player) {
      callback(player);
    });
  }

  function addPlayer(name, modifier, callback) {
    var players = getPlayers();
    var playerID = getValue('nextID');
    players.push({id: playerID, name: name, modifier: modifier, score: 0});
    setValue('currentPlayer', 0);    
    setValue('nextID', playerID + 1); 
    store('players', players);
  }
  
  function deletePlayer(id) {
    var players = _.reject(getPlayers(), function (player){return player.id == id} );
    setValue('currentPlayer', 0);
    store('players', players);
  }

  function resetDatastore(){
    setValue('nextID', 1);
    store('players', []);
  }

  function clearScores(callback) {
    mapPlayers(function(player) {
      player.score=0; 
    });
    setValue('currentPlayer', 0);
  };

  function updateScore(id, score) {
    mapPlayers(function(player) {
      if (player.id == id) {
        player.score=score;
      }
    });
  }

  function setValue(name, value) {
    var settings = getSettings();
    settings[name] = value;
    store('settings', settings);
  }

  function getValue (name) {
    return getSettings()[name];
  }

  function withValue(name, callback) {
    callback(getSettings()[name]);
  }

  function fetch(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key) || defaultValue);
  }

  function store(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  function getPlayers() {
    return fetch('players', "[]").sort(comparePlayers);
  }

  function comparePlayers(a, b){
    if (Number(a.score) > Number(b.score)){
      return -1;
    } else if (Number(a.score) < Number(b.score)) {
      return 1;
    } else {
      if (Number(a.modifier) < Number(b.modifier)){
        return 1;
      } else {
        return -1;
      }
    }
  }

  function getSettings() {
    return fetch('settings', '{}');
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

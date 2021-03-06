(function() {
  this.controller = {
    nextPC: nextPC,
    nextRound: nextRound
  }

  function nextPC() {
    var playerCount = datastore.getPlayers().length;
    if (playerCount > 0){
      incrementValue('currentPlayer', playerCount, function(currentPlayer){
        view.setCurrentPlayer(currentPlayer); 
        if (currentPlayer > playerCount) { nextRound(); }
      });
    }
  }

  function nextRound(){
    incrementValue('round');
    view.setRound(datastore.getValue('round'));
    datastore.setValue('currentPlayer', 1);
    view.setCurrentPlayer(1);
  }

  function incrementValue(name, max, callback) {
    datastore.withValue(name, function(value){
      value++;
      datastore.setValue(name, value);
      if (callback) {callback(value);}
    });
  }
})();

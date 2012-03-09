(function() {
  this.controller = {
    nextPC: nextPC,
    nextRound: nextRound
  }

  function nextPC() {
    var playerCount = datastore.getPlayers().length;
    if (playerCount > 0){
      incrementValue('currentPlayer', playerCount, function(currentPlayer){
        // view.setInitToken(currentPlayer); 
        if (currentPlayer > playerCount) { nextRound(); }
      });
    }
  }

  function nextRound(){
    incrementValue('round');
    datastore.setValue('currentPlayer', 1);
  }

  function incrementValue(name, max, callback) {
    datastore.withValue(name, function(value){
      value++;
      datastore.setValue(name, value);
      if (callback) {callback(value);}
    });
  }

  // FIXME Move to view
  function setInitToken(newValue) {
    view.clearCurrentToken();
    $($('#home img.token').get(newValue)).attr("src","images/token.jpg");
  }
})();

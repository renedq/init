(function() {
  this.controller = {
    nextPC: nextPC,
    nextRound: nextRound
  }

  function nextPC() {
    var playerCount = datastore.getPlayers().length;
    if (playerCount > 0){
      incrementValue('currentPlayer', playerCount, function(currentPlayer){
        console.log("Old currentPlayer nextPC: " + datastore.getValue('currentPlayer'));
        view.setInitToken(currentPlayer); 
        if (currentPlayer > playerCount) { nextRound(); }
      });
    }
    console.log("New currentPlayer nextPC: " + datastore.getValue('currentPlayer'));
    console.log("Round nextPC: " + datastore.getValue('round'));
  }

  function nextRound(){
    incrementValue('round');
    view.setRound(datastore.getValue('round'));
    datastore.setValue('currentPlayer', 1);
    view.setInitToken(1);
  }

  function incrementValue(name, max, callback) {
    datastore.withValue(name, function(value){
      console.log("Incrementing incrementValue: " + name);
      value++;
      datastore.setValue(name, value);
      if (callback) {callback(value);}
    });
  }

  // FIXME Move to view
  /*function setInitToken(newValue) {
    view.clearCurrentToken();
    $($('#home img.token').get(newValue)).attr("src","images/token.jpg");
    console.log("New token: " + newValue);
  }*/
})();

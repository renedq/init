(function() {
  this.view = {
    clearCurrentToken: clearCurrentToken, // FIXME Why is this public? Does it need to be?
    setRound: setRound,
    newPlayerName: newPlayerName,
    newPlayerModifier: newPlayerModifier,
    resetNewPlayerForm: resetNewPlayerForm,
    setInitToken: setInitToken,
    entryIsValid: entryIsValid
  };

  function clearCurrentToken() {
    $('#home img.token').attr("src","images/token_blank.png");
  }

  function setRound(round){
    $('#round').text(round);
  }

  function newPlayerName() {
    return $('#name').val();
  }

  function newPlayerModifier() {
    return $('#modifier').val(); 
  }

  function setInitToken(newValue) {
    view.clearCurrentToken();
    $($('#home img.token').get(newValue)).attr("src","images/token.jpg");
  }
  
  function resetNewPlayerForm() {
    $('#name').val("");
    $('#modifier').val("");
  }

  function entryIsValid() {
    return $('#newpc').valid();
  }
})();

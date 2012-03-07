(function() {
  this.view = {
    clearCurrentToken: clearCurrentToken,
    setRound: setRound,
    newPlayerName: newPlayerName,
    newPlayerModifier: newPlayerModifier,
    resetNewPlayerForm: resetNewPlayerForm,
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
  
  function resetNewPlayerForm() {
    $('#name').val("");
    $('#modifier').val("");
  }

  function entryIsValid() {
    return $('#newpc').valid();
  }
})();

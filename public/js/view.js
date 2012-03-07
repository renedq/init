(function() {
  this.view = {
    clearCurrentToken: clearCurrentToken,
    setRound: setRound
  };

  function clearCurrentToken() {
    $('#home img.token').attr("src","images/token_blank.png");
  }

  function setRound(round){
    $('#round').text(round);
  }
})();

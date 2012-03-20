(function() {
  var jQT = $.jQTouch({
    icon: 'kilo.png',
    statusBar: 'black'
  });

  $(document).ready(function(){
    $('#createEntry form').submit(newPlayerSubmitted);
    if (datastore.getValue('currentPlayer') == null){ datastore.setValue('currentPlayer', 0);}
    if (datastore.getValue('round') == null) { datastore.setValue('round', 1);}
    refreshEntries();
    view.setRound(datastore.getValue('round'));
    view.setCurrentPlayer(datastore.getValue('currentPlayer'));
  });

  function setRound(round){
    datastore.setValue('round',round);
    view.setRound(round);
  }

  function setCurrentPlayer(newValue) {
    view.clearCurrentPlayer();
    datastore.setValue('currentPlayer', newValue);
    $($('#home img.token').get(newValue)).attr("src","images/token.jpg");
  }

  function resetInitiative() {
    setRound(1);
    datastore.setValue('currentPlayer', 0);
    view.clearCurrentPlayer();
  }

  function clear(){
    datastore.clearScores(refreshEntries);
    datastore.setValue('token', 0);
    view.clearCurrentPlayer();
    setRound(1);
    refreshEntries();//FIXME should this be here?
  }

  function clearAll(){
    datastore.resetDatastore();
    setCurrentPlayer(1);
    setRound(1);
    refreshEntries();
  }

  function refreshEntries() {
    $('#body-list li:gt(0)').remove();
    $('#next').click(controller.nextPC);
    $('#reset').click(resetInitiative);
    $('#clear').click(clear);
    $('#clearAll').click(clearAll);
    datastore.eachPlayer(function(row) {
      var newEntryRow = $('#entryTemplate').clone();
      newEntryRow.removeAttr('id');
      newEntryRow.removeAttr('style');
      newEntryRow.data('entryId', row.id);
      newEntryRow.appendTo('#body-list');
      newEntryRow.find('.name').text(row.name);
      var mod = row.modifier;
      if (mod < 0) {
        newEntryRow.find('.modifier').text(mod);
      } else {
        newEntryRow.find('.modifier').text("+"+mod);
      }
      newEntryRow.find('.score').val(row.score);
      newEntryRow.find('.score').change(function(){
        var score = $(this).val();
        if (!isNumeric(score)) {
          score = 0;
        }
        var clickedEntry = $(this).parent();
        var clickedEntryId = clickedEntry.data('entryId');
        datastore.updateScore(clickedEntryId, score);
        refreshEntries();
      });
      newEntryRow.find('.delete').click(function(){
        var clickedEntry = $(this).parent();
        var clickedEntryId = clickedEntry.data('entryId');
        datastore.deletePlayer(clickedEntryId);
        $(this).parent().animate({ width: '0px'}, {duration: 500, complete: function() {$(this).remove();}});
      });
    });
  }

  function isNumeric(value){
    return (value - 0) == value && value.length > 0;
  }

  function newPlayerSubmitted() {
    if (view.entryIsValid()) {
      var name = view.newPlayerName();
      var modifier = view.newPlayerModifier(); 
      datastore.addPlayer(name, modifier);
      playerAdded();
    }
    return false;
  }

  function playerAdded() {
    view.resetNewPlayerForm();
    refreshEntries();
    jQT.goBack();
  }
})();

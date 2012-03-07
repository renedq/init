(function() {
  var token=0;
  var jQT = $.jQTouch({
    icon: 'kilo.png',
    statusBar: 'black'
  });

  $(document).ready(function(){
    $('#createEntry form').submit(createEntry);
    refreshEntries();
    datastore.withRound(setRound);
  });

  function nextPC() {
    if ($('.token').length > 1){
      if (token >= ($('.token').length - 1)){
        setInitToken(1);
        datastore.withRound(function(r) {
          setRound(r+1);
        });
      } else {
        setInitToken(token + 1);
      }
    }
  }

  function setRound(round){
    datastore.setRound(round);
    $('#round').text(round);
  }

  function setInitToken(newValue) {
    $('#home img.token').attr("src","images/token_blank.png");
    token = newValue;
    $($('#home img.token').get(token)).attr("src","images/token.jpg");
  }

  function resetInitiative() {
    setRound(1);
    token=0;
    $('#home img.token').attr("src","images/token_blank.png");
  }

  function clear(){
    datastore.clearScores(refreshEntries);
    setRound(1);
  }

  function clearAll(){
    datastore.resetDatastore();
    token=1;
    setRound(1);
    refreshEntries();
  }

  function refreshEntries() {
    $('#body-list li:gt(0)').remove();
    $('#next').click(nextPC);
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
        refreshEntries();
        clickedEntry.slideUp();
      });
    });
  }

  function isNumeric(value){
    return (value - 0) == value && value.length > 0;
  }

  function entryIsValid() {
    return $('#newpc').valid();
  }

  function createEntry() {
    if (entryIsValid()) {
      var name = $('#name').val();
      var modifier = $('#modifier').val();
      datastore.addPlayer(name, modifier, function(){
        refreshEntries();
        jQT.goBack();
      });
      $('#name').val("");
      $('#modifier').val("");
  }
    return false;
  }
})();

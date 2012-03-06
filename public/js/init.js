(function() {
  var token=0;
  var round=1; // FIXME Die die die
  var jQT = $.jQTouch({
    icon: 'kilo.png',
    statusBar: 'black'
  });

  $(document).ready(function(){
    $('#createEntry form').submit(createEntry);
    refreshEntries();
  });

  function nextPC() {
    if ($('.token').length > 1){
      if (token >= ($('.token').length - 1)){
        setInitToken(1);
        round++;
        $('#round').text(round);
      } else {
        setInitToken(token + 1);
      }
    }
  }

  function setInitToken(newValue) {
    $('#home img.token').attr("src","images/token_blank.png");
    token = newValue;
    $($('#home img.token').get(token)).attr("src","images/token.jpg");
  }

  function resetInitiative() {
    round=1;
    token=0;
    $('#home img.token').attr("src","images/token_blank.png");
    $('#round').text(round);
  }

  function clear(){
    clearScores(refreshEntries);
  }

  function clearAll(){
    resetDatastore();
    token=1;
    round=1;
    $('#round').text(round);
    refreshEntries();
  }

  function refreshEntries() {
    $('#body-list li:gt(0)').remove();
    $('#next').click(nextPC);
    $('#reset').click(resetInitiative);
    $('#clear').click(clear);
    $('#clearAll').click(clearAll);
    eachPlayer(function(row) {
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
        updateScore(clickedEntryId, score);
        refreshEntries();
      });
      newEntryRow.find('.delete').click(function(){
        var clickedEntry = $(this).parent();
        var clickedEntryId = clickedEntry.data('entryId');
        deletePlayer(clickedEntryId);
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
      addPlayer(name, modifier, function(){
        refreshEntries();
        jQT.goBack();
      });
      $('#name').val("");
      $('#modifier').val("");
  }
    return false;
  }

  function errorHandler(transaction, error) {
    alert('Oops. Error was '+error.message+' (Code '+error.code+')');
    return true;
  }
})();

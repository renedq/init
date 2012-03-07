describe('View', function() {
  it('can clear the current player token', function() {
    $('body').
      append($('<div id="home">').
        append($('<img class="token">')));
    view.clearCurrentToken();
    expect($('#home img.token').attr('src')).toEqual('images/token_blank.png');
  });

  it('can display the current round', function() {
    var div;
    $('body').append(div = $('<div id="round">'));
    view.setRound(42);
    expect(div.text()).toEqual("42");
  });
});

describe('View', function() {
  beforeEach(function() {
    //jsdom.load('public/index.html');
  });
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

  it('can reset the name and modifier', function() {
    var divName, divModifier;
    $('body').append(divName = $('<input id="name">foo</input>'));
    $('body').append(divModifier = $('<input id="modifier">bar</input>'));
    view.resetNewPlayerForm();
    expect(divName.val()).toEqual("");
    expect(divModifier.val()).toEqual("");
  });
});

describe('Init app', function() {
  beforeEach(function() {
    datastore.resetDatastore();
    datastore.setValue('currentPlayer', 1);
    datastore.setValue('round', 1);
  });

  it('will not increment currentPlayer if there are no PCs', function() {
    controller.nextPC();
    expect(datastore.getValue('currentPlayer')).toEqual(1);
  });
  
  describe('when there are players', function() {
    beforeEach(function() {
      datastore.addPlayer("Carl", 1);
      datastore.addPlayer("Billy", 2);
      datastore.addPlayer("Herro", 3);
      datastore.addPlayer("RaeKwon", 4);
    });
    
    it('allows the user to move to the first player in initative order', function() {
      controller.nextPC();
      expect(datastore.getValue('currentPlayer')).toEqual(1);
    });
    
    it('loops back to the beginning once we reach the bottom of the order', function() {
      _.times(5, controller.nextPC);
      expect(datastore.getValue('currentPlayer')).toEqual(1);
    });

    it('it increments the round when looping back to the top of the order', function() {
      _.times(5, controller.nextPC);
      expect(datastore.getValue('round')).toEqual(2);
    });

    it('it doesnt increment the round until after the last player in the order has a turn', function() {
      _.times(datastore.getPlayers().length, controller.nextPC);
      expect(datastore.getValue('round')).toEqual(1);
    });

    it('resets the round when a player is added to the player list', function() {
      _.times(2, controller.nextPC);
      expect(datastore.getValue('currentPlayer')).toEqual(2);
      datastore.addPlayer("Lagan",3);
      expect(datastore.getValue('currentPlayer')).toEqual(0);
      _.times(2, controller.nextPC);
      expect(datastore.getValue('currentPlayer')).toEqual(2);
      expect(datastore.getPlayers()[0].name).toEqual("RaeKwon");
    });
  });
});

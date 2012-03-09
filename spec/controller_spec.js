describe('Init app', function() {
  beforeEach(function() {
    datastore.resetDatastore();
    datastore.setValue('currentPlayer', 0);
    datastore.setValue('round', 1);
  });

  it('will not increment currentPlayer if there are no PCs', function() {
    controller.nextPC();
    expect(datastore.getValue('currentPlayer')).toEqual(0);
  });
  
  describe('when there are players', function() {
    beforeEach(function() {
      datastore.addPlayer("Carl", 1);
      datastore.addPlayer("Billy", 2);
    });
    
    it('allows the user to move to the first player in initative order', function() {
      controller.nextPC();
      expect(datastore.getValue('currentPlayer')).toEqual(1);
    });
    
    it('', function() {
      expect().toEqual();
    });

    it('loops back to the beginning once we reach the bottom of the order', function() {
      _.times(3, controller.nextPC);
      expect(datastore.getValue('currentPlayer')).toEqual(1);
    });

    it('it increments the round when looping back to the top of the order', function() {
      _.times(3, controller.nextPC);
      expect(datastore.getValue('round')).toEqual(2);
    });
  });
});

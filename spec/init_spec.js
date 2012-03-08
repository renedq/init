describe('Init app', function() {
  var playerCount = 0;
  var fakeStorage = {
    token: 0,
    round: 1
  };

  beforeEach(function() {
    spyOn(datastore, 'playerCount').andCallFake(function(callback) {
      callback(playerCount);
    });
    spyOn(datastore, 'withValue').andCallFake(function(key, callback) {
      callback(fakeStorage[key]);
    });
  });

  it('will not increment token if there are no PCs', function() {
    spyOn(datastore, 'setValue');
    controller.nextPC();
    expect(datastore.setValue).not.toHaveBeenCalled();
  });
  
  describe('when there are players', function() {
    beforeEach(function() {
      playerCount = 2;
      spyOn(datastore, 'setValue');
    });
    
    it('allows the user to move to the first player in initative order', function() {
      controller.nextPC();
      expect(datastore.setValue).toHaveBeenCalledWith('token', 1);
    });

    it('loops back to the beginning once we reach the bottom of the order', function() {
      fakeStorage.token = 2;
      controller.nextPC();
      expect(datastore.setValue).toHaveBeenCalledWith('token', 1);
    });

    it('it increments the round when looping back to the top of the order', function() {
      playerCount = 6;
      fakeStorage.token = 6;
      controller.nextPC();
      expect(datastore.setValue).toHaveBeenCalledWith('round', 2);
    });
  });
});

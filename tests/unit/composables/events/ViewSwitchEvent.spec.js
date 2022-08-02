import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';

describe('Test composable: ViewSwitchEvent', () => {
  describe('Test function: ViewSwitchEvent.emit', () => {
    it('Should be defined and return nothing', () => {
      expect(ViewSwitchEvent.emit).toBeDefined();
      expect(ViewSwitchEvent.emit('event')).toBeUndefined();
    });
  });

  describe('Test function: ViewSwitchEvent.off', () => {
    it('Should be defined and return nothing', () => {
      const fakeSubscription = { unsubscribe: () => {} };
      expect(ViewSwitchEvent.off).toBeDefined();
      expect(ViewSwitchEvent.off(fakeSubscription)).toBeUndefined();
    });
  });

  describe('Test function: ViewSwitchEvent.on', () => {
    it('Should be defined and return a subscription', () => {
      const subscription = ViewSwitchEvent.on(jest.fn());
      expect(ViewSwitchEvent.on).toBeDefined();
      expect(subscription).toBeDefined();
    });
  });
});

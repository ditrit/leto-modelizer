import UserSettings from 'src/models/UserSettings';

describe('Test class: UserSettings', () => {
  describe('Test constructor', () => {
    it('should use default values when called without parameter', () => {
      const userSettings = new UserSettings();

      expect(userSettings.displayType).toEqual('table');
      expect(userSettings.recordsByPage).toEqual(5);
    });

    it('should use default values when called with an empty object', () => {
      const userSettings = new UserSettings({});

      expect(userSettings.displayType).toEqual('table');
      expect(userSettings.recordsByPage).toEqual(5);
    });

    it('should use values from the parameter object', () => {
      const userSettings = new UserSettings({
        displayType: 'grid',
        recordsByPage: 6,
      });

      expect(userSettings.displayType).toEqual('grid');
      expect(userSettings.recordsByPage).toEqual(6);
    });
  });
});

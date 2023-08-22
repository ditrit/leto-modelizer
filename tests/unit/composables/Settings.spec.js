import { getUserSetting, setUserSetting } from 'src/composables/Settings';

describe('Test class: Settings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Test function: getUserSetting', () => {
    it('should return wanted key', () => {
      expect(getUserSetting('displayType')).toEqual('table');
      expect(getUserSetting('recordsByPage')).toEqual(5);
    });
  });

  describe('Test function: setUserSetting', () => {
    it('should return wanted key', () => {
      expect(getUserSetting('displayType')).toEqual('table');

      setUserSetting('displayType', 'grid');

      expect(getUserSetting('displayType')).toEqual('grid');
    });
  });
});

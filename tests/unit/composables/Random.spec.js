import { randomHexString } from 'src/composables/Random';

describe('Test composable: Random', () => {
  describe('Test function: randomHexString', () => {
    it('should return generated number', () => {
      window.crypto.getRandomValues = () => 0x16;
      const number = randomHexString(1);
      expect(number).toEqual('0');
    });
  });
});

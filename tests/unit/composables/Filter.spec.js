import { searchText } from 'src/composables/Filter';

describe('Test composable: Filter', () => {
  describe('Test function: searchText', () => {
    it('should return true without searched text', async () => {
      expect(searchText('abc', null)).toEqual(true);
      expect(searchText('abc', '')).toEqual(true);
      expect(searchText('abc', ' ')).toEqual(true);
    });

    it('should return true if searched text is contained in the text to be filtered', async () => {
      expect(searchText('abc', 'a')).toEqual(true);
      expect(searchText('abc', 'A')).toEqual(true);
      expect(searchText('abc', 'a b')).toEqual(true);
    });

    it('should return false if searched text is not contained in the text to be filtered', async () => {
      expect(searchText('abc', 'd')).toEqual(false);
      expect(searchText('abc', 'd e')).toEqual(false);
    });
  });
});

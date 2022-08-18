import {
  notEmpty,
  isGitRepositoryUrl,
} from 'src/composables/QuasarFieldRule';

describe('Test composable: InputRule', () => {
  const t = (key) => key;

  describe('Test function: notEmpty', () => {
    it('Should return true if not empty', () => {
      expect(notEmpty(t, 'a')).toBeTruthy();
    });

    it('Should return error if undefined', () => {
      expect(notEmpty(t)).toEqual('errors.empty');
    });

    it('Should return error if null', () => {
      expect(notEmpty(t, null)).toEqual('errors.empty');
    });

    it('Should return error if empty', () => {
      expect(notEmpty(t, '')).toEqual('errors.empty');
    });
  });

  describe('Test function: isGitRepositoryUrl', () => {
    it('Should return true on valid git url', () => {
      expect(isGitRepositoryUrl(t, 'git@test.com/test.git')).toBe(true);
      expect(isGitRepositoryUrl(t, 'http://test.com/test.git')).toBe(true);
      expect(isGitRepositoryUrl(t, 'https://test.com/test.git')).toBe(true);
      expect(isGitRepositoryUrl(t, 'https://github.com/ditrit/leto-modelizer.git')).toBe(true);
    });

    it('Should return error on invalid git url', () => {
      const key = 'errors.invalid.gitProvider.repository';
      expect(isGitRepositoryUrl(t, 'ftp://github.com/ditrit/leto-modelizer.git')).toEqual(key);
      expect(isGitRepositoryUrl(t, 'http://github.com/ditrit/leto-modelizer')).toEqual(key);
    });
  });
});

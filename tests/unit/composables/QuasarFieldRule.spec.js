import {
  notEmpty,
  isGitRepositoryUrl,
  isUniqueBranchName,
  isValidFileLabel,
  isUniqueFileLabel,
} from 'src/composables/QuasarFieldRule';

describe('Test composable: InputRule', () => {
  const t = (key) => key;

  describe('Test function: notEmpty', () => {
    it('should return true if not empty', () => {
      expect(notEmpty(t, 'a')).toBeTruthy();
    });

    it('should return error if undefined', () => {
      expect(notEmpty(t)).toEqual('errors.empty');
    });

    it('should return error if null', () => {
      expect(notEmpty(t, null)).toEqual('errors.empty');
    });

    it('should return error if empty', () => {
      expect(notEmpty(t, '')).toEqual('errors.empty');
    });
  });

  describe('Test function: isGitRepositoryUrl', () => {
    it('should return true on valid git url', () => {
      expect(isGitRepositoryUrl(t, 'http://test.com/test')).toBe(true);
      expect(isGitRepositoryUrl(t, 'https://test.com/test')).toBe(true);
      expect(isGitRepositoryUrl(t, 'https://github.com/ditrit/leto-modelizer')).toBe(true);
    });

    it('should return error on invalid git url', () => {
      const key = 'errors.invalid.gitProvider.repository';
      expect(isGitRepositoryUrl(t, 'git@github.com/ditrit/leto-modelizer.git')).toEqual(key);
      expect(isGitRepositoryUrl(t, 'ftp://github.com/ditrit/leto-modelizer.git')).toEqual(key);
      expect(isGitRepositoryUrl(t, 'http://github.com/ditrit/leto-modelizer.git')).toEqual(key);
    });
  });

  describe('Test function: isUniqueBranchName', () => {
    it('should return true without duplicated branch', () => {
      expect(isUniqueBranchName(t, [], 'test')).toBe(true);
      expect(isUniqueBranchName(t, [{ name: 'test2' }], 'test')).toBe(true);
    });

    it('should return string error message with duplicated branch', () => {
      const key = 'errors.git.branch.duplicate';
      expect(isUniqueBranchName(t, [{ name: 'test' }], 'test')).toEqual(key);
    });
  });

  describe('Test function: isValidFileLabel', () => {
    it('should return true on valid tree node label', () => {
      expect(isValidFileLabel(t, 'folderName')).toBe(true);
      expect(isValidFileLabel(t, 'app.tf')).toBe(true);
      expect(isValidFileLabel(t, 'my-file.tf')).toBe(true);
    });

    it('should return string error message on invalid tree node label', () => {
      const key = 'errors.invalid.fileExplorer.label';
      expect(isValidFileLabel(t, '/folderName')).toEqual(key);
      expect(isValidFileLabel(t, 'app/file.tf')).toEqual(key);
      expect(isValidFileLabel(t, 'folder/app.tf')).toEqual(key);
    });
  });

  describe('Test function: isUniqueFileLabel', () => {
    it('should return true without duplicated node label', () => {
      expect(isUniqueFileLabel(t, [], 'fileName')).toBe(true);
      expect(isUniqueFileLabel(t, [{ label: 'app.tf' }], 'fileName')).toBe(true);
      expect(isUniqueFileLabel(t, [{ label: 'folderA' }], 'folderB')).toBe(true);
    });

    it('should return string error message with duplicated node label', () => {
      const key = 'errors.fileExplorer.label.duplicate';
      expect(isUniqueFileLabel(t, [{ label: 'test' }], 'test')).toEqual(key);
    });
  });
});

import FileStatus from 'src/models/git/FileStatus';

describe('Test class: FileStatus', () => {
  describe('Test constructor', () => {
    it('should use default values when called with no parameter', () => {
      const fileStatus = new FileStatus();

      expect(fileStatus.matrix).toEqual('-1-1-1');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(true);
    });
  });

  describe('Test matrix', () => {
    it('000 should be untracked', () => {
      const fileStatus = new FileStatus({ headStatus: 0, workdirStatus: 0, stageStatus: 0 });

      expect(fileStatus.matrix).toEqual('000');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(true);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('003 should be deleted', () => {
      const fileStatus = new FileStatus({ headStatus: 0, workdirStatus: 0, stageStatus: 3 });

      expect(fileStatus.matrix).toEqual('003');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(true);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(true);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('020 should be new and untracked', () => {
      const fileStatus = new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 0 });

      expect(fileStatus.matrix).toEqual('020');
      expect(fileStatus.isNew).toEqual(true);
      expect(fileStatus.isUntracked).toEqual(true);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('022 should be added and staged', () => {
      const fileStatus = new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 2 });

      expect(fileStatus.matrix).toEqual('022');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(true);
      expect(fileStatus.isStaged).toEqual(true);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('023 should be added, staged and hasUnstagedChanged', () => {
      const fileStatus = new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 3 });

      expect(fileStatus.matrix).toEqual('023');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(true);
      expect(fileStatus.isStaged).toEqual(true);
      expect(fileStatus.hasUnstagedChanged).toEqual(true);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('100 should be deleted', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 0, stageStatus: 0 });

      expect(fileStatus.matrix).toEqual('100');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(true);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('101 should be deleted', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 0, stageStatus: 1 });

      expect(fileStatus.matrix).toEqual('101');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(true);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('103 should be hasUnstagedChanged and deleted', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 0, stageStatus: 3 });

      expect(fileStatus.matrix).toEqual('103');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(true);
      expect(fileStatus.isDeleted).toEqual(true);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('110 should be unstaged and deleted', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 1, stageStatus: 0 });

      expect(fileStatus.matrix).toEqual('110');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(true);
      expect(fileStatus.isUnstaged).toEqual(true);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('111 should be unmodified', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 1, stageStatus: 1 });

      expect(fileStatus.matrix).toEqual('111');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(true);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('113 should be hasUnstagedChanged', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 1, stageStatus: 3 });

      expect(fileStatus.matrix).toEqual('113');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(true);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('120 should be unstaged and deleted', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 2, stageStatus: 0 });

      expect(fileStatus.matrix).toEqual('120');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(true);
      expect(fileStatus.isUnstaged).toEqual(true);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('121 should be unstaged and hasUnstagedChanged', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 2, stageStatus: 1 });

      expect(fileStatus.matrix).toEqual('121');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(false);
      expect(fileStatus.hasUnstagedChanged).toEqual(true);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(true);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('122 should be staged and hasUnstagedChanged', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 2, stageStatus: 2 });

      expect(fileStatus.matrix).toEqual('122');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(true);
      expect(fileStatus.hasUnstagedChanged).toEqual(false);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });

    it('123 should be staged and hasUnstagedChanged', () => {
      const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 2, stageStatus: 3 });

      expect(fileStatus.matrix).toEqual('123');
      expect(fileStatus.isNew).toEqual(false);
      expect(fileStatus.isUntracked).toEqual(false);
      expect(fileStatus.isAdded).toEqual(false);
      expect(fileStatus.isStaged).toEqual(true);
      expect(fileStatus.hasUnstagedChanged).toEqual(true);
      expect(fileStatus.isDeleted).toEqual(false);
      expect(fileStatus.isUnstaged).toEqual(false);
      expect(fileStatus.isUnmodified).toEqual(false);
      expect(fileStatus.isIgnored).toEqual(false);
    });
  });

  describe('Test getters', () => {
    describe('Test getter: status', () => {
      it('should return staged status on staged file', () => {
        const fileStatus = new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 2 });

        expect(fileStatus.status).toEqual('file-status-staged');
      });

      it('should return modified status on file that has unstaged changes', () => {
        const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 2, stageStatus: 1 });

        expect(fileStatus.status).toEqual('file-status-modified');
      });

      it('should return untracked status on untracked file', () => {
        const fileStatus = new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 0 });

        expect(fileStatus.status).toEqual('file-status-untracked');
      });

      it('should return unmodified status on unmodified file', () => {
        const fileStatus = new FileStatus({ headStatus: 1, workdirStatus: 1, stageStatus: 1 });

        expect(fileStatus.status).toEqual('file-status-unmodified');
      });
    });
  });
});

import Branch from 'src/models/git/Branch';

describe('Test class: Branch', () => {
  describe('Test constructor', () => {
    it('Should use default values when called with no parameter', () => {
      const branch = new Branch();

      expect(branch.name).toBeNull();
      expect(branch.onLocal).toEqual(false);
      expect(branch.onRemote).toEqual(false);
      expect(branch.current).toEqual(false);
      expect(branch.remote).toEqual('origin');
    });

    it('Should use default values when called with an empty object', () => {
      const branch = new Branch({});

      expect(branch.name).toBeNull();
      expect(branch.onLocal).toEqual(false);
      expect(branch.onRemote).toEqual(false);
      expect(branch.current).toEqual(false);
      expect(branch.remote).toEqual('origin');
    });

    it('Should use values from the parameter object', () => {
      const branch = new Branch({
        name: 'name',
        onLocal: true,
        onRemote: true,
        current: true,
        remote: 'test',
      });

      expect(branch.name).toEqual('name');
      expect(branch.onLocal).toEqual(true);
      expect(branch.onRemote).toEqual(true);
      expect(branch.current).toEqual(true);
      expect(branch.remote).toEqual('test');
    });
  });

  describe('Test getters', () => {
    describe('Test getter: fullName', () => {
      it('Should return string with valid remote', () => {
        const branch = new Branch({
          name: 'name',
          onLocal: true,
          onRemote: true,
        });
        expect(branch.fullName).toEqual('origin/name');
      });
      it('Should return empty string with no remote', () => {
        const branch = new Branch({
          name: 'name',
          onLocal: true,
          onRemote: false,
        });
        expect(branch.fullName).toEqual('');
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: compare', () => {
      it('Should display current branch before other branches', () => {
        const currentBranch = new Branch({ current: true });
        const otherBranch = new Branch({ current: false });
        expect(currentBranch.compare(otherBranch)).toEqual(-1);
        expect(otherBranch.compare(currentBranch)).toEqual(1);
      });

      it('Should compare branches in alphabetical order', () => {
        const currentBranch = new Branch({ name: 'a' });
        const otherBranch = new Branch({ name: 'b' });

        expect(currentBranch.compare(currentBranch)).toEqual(0);
        expect(currentBranch.compare(otherBranch)).toEqual(-1);
        expect(otherBranch.compare(currentBranch)).toEqual(1);
      });
    });
  });
});

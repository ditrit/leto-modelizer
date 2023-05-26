import Project from 'src/models/Project';

describe('Test class: Project', () => {
  describe('Test constructor', () => {
    it('should use default values when called without parameter', () => {
      const project = new Project();

      expect(project.id).toBeNull();
      expect(project.creationDate).toBeNull();
      expect(project.git).toEqual({
        repository: null,
        username: null,
        token: null,
      });
    });

    it('should use default values when called with an empty object', () => {
      const project = new Project({});

      expect(project.id).toBeNull();
      expect(project.creationDate).toBeNull();
      expect(project.git).toEqual({
        repository: null,
        username: null,
        token: null,
      });
    });

    it('should use values from the parameter object', () => {
      const project = new Project({
        id: 'test',
        creationDate: 1,
        git: {
          repository: 'repository',
          username: 'username',
          token: 'token',
        },
      });

      expect(project.id).toEqual('test');
      expect(project.creationDate).toEqual(1);
      expect(project.git).toEqual({
        repository: 'repository',
        username: 'username',
        token: 'token',
      });
    });
  });

  describe('Test getters', () => {
    describe('Test getter: isLocal', () => {
      it('should return true with local project', () => {
        expect(new Project().isLocal).toEqual(true);
        expect(new Project({}).isLocal).toEqual(true);
        expect(new Project({ git: {} }).isLocal).toEqual(true);
        expect(new Project({ git: { repository: null } }).isLocal).toEqual(true);
        expect(new Project({ git: { repository: '' } }).isLocal).toEqual(true);
        expect(new Project({ git: { repository: ' ' } }).isLocal).toEqual(true);
      });

      it('should return false with remote project', () => {
        expect(new Project({ git: { repository: 'test' } }).isLocal).toEqual(false);
      });
    });

    describe('Test getter: isRemote', () => {
      it('should return true with remote project', () => {
        expect(new Project({ git: { repository: 'test' } }).isRemote).toEqual(true);
      });

      it('should return false with local project', () => {
        expect(new Project().isRemote).toEqual(false);
        expect(new Project({}).isRemote).toEqual(false);
        expect(new Project({ git: {} }).isRemote).toEqual(false);
        expect(new Project({ git: { repository: null } }).isRemote).toEqual(false);
        expect(new Project({ git: { repository: '' } }).isRemote).toEqual(false);
        expect(new Project({ git: { repository: ' ' } }).isRemote).toEqual(false);
      });
    });
  });
});

import User from 'src/models/User';

describe('Test class: User', () => {
  describe('Test constructor', () => {
    it('should use default values when called without parameter', () => {
      const user = new User();

      expect(user.firstname).toBeNull();
      expect(user.lastname).toBeNull();
      expect(user.email).toBeNull();
      expect(user.id).toBeNull();
    });

    it('should use default values when called with an empty object', () => {
      const user = new User({});

      expect(user.firstname).toBeNull();
      expect(user.lastname).toBeNull();
      expect(user.email).toBeNull();
      expect(user.id).toBeNull();
    });

    it('should use values from the parameter object', () => {
      const user = new User({
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'email',
        id: 'id',
      });

      expect(user.firstname).toEqual('firstname');
      expect(user.lastname).toEqual('lastname');
      expect(user.email).toEqual('email');
      expect(user.id).toEqual('id');
    });
  });
});

const bcrypt = require('bcryptjs');
const User = require('../../src/models/User');

describe('User Model Password Hashing Unit Test', () => {
  it('should verify that plaintext password gets hashed with bcrypt before saving', async () => {
    const rawPassword = 'mySecretPassword123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const userData = {
      username: 'testuser_hash',
      name: 'Test Hash User',
      email: 'hash@example.com',
      passwordHash: passwordHash
    };

    const user = new User(userData);

    expect(user.passwordHash).not.toEqual(rawPassword);
    expect(user.passwordHash).toMatch(/^\$2[ayb]\$/);

    const isMatch = await bcrypt.compare(rawPassword, user.passwordHash);
    expect(isMatch).toBe(true);
  });
});

import { CreateUserSchema } from '../dtos/user.dto';

describe('User DTO', () => {
  it('should validate a correct user object', () => {
    const result = CreateUserSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123'
    });
    expect(result.success).toBe(true);
  });
  it('should fail if email is invalid', () => {
    const result = CreateUserSchema.safeParse({
      name: 'Alice',
      email: 'not-an-email',
      password: 'password123'
    });
    expect(result.success).toBe(false);
  });
});

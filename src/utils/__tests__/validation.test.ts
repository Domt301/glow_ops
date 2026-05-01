import { displayNameSchema, signInSchema, signUpSchema } from '@/utils/validation';

describe('validation schemas', () => {
  it('accepts valid sign-up and sign-in credentials', () => {
    expect(signUpSchema.parse({ email: 'demo@glowops.app', password: 'password123' })).toEqual({
      email: 'demo@glowops.app',
      password: 'password123',
    });
    expect(signInSchema.parse({ email: 'demo@glowops.app', password: 'password123' })).toEqual({
      email: 'demo@glowops.app',
      password: 'password123',
    });
  });

  it('rejects invalid emails and short passwords', () => {
    expect(signUpSchema.safeParse({ email: 'demo', password: 'password123' }).success).toBe(false);
    expect(signInSchema.safeParse({ email: 'demo@glowops.app', password: 'short' }).success).toBe(
      false,
    );
  });

  it('bounds display names', () => {
    expect(displayNameSchema.safeParse('Alex').success).toBe(true);
    expect(displayNameSchema.safeParse('').success).toBe(false);
    expect(displayNameSchema.safeParse('a'.repeat(41)).success).toBe(false);
  });
});

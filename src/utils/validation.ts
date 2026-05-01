import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'At least 8 characters.'),
});

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'At least 8 characters.'),
});

export const displayNameSchema = z
  .string()
  .min(1, 'Pick a name.')
  .max(40, 'Keep it under 40 characters.');

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

import { validate } from 'class-validator';
import { UserRegisterDto, UserLoginDto } from './auth.dto';

describe('UserRegisterDto', () => {
  it('should validate a correct input', async () => {
    const dto = new UserRegisterDto();
    dto.firstname = 'John';
    dto.lastname = 'Doe';
    dto.email = 'john@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    const dto = new UserRegisterDto();
    dto.firstname = 'John';
    dto.lastname = 'Doe';
    dto.email = 'invalid-email';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });

  it('should fail if password is too short', async () => {
    const dto = new UserRegisterDto();
    dto.firstname = 'John';
    dto.lastname = 'Doe';
    dto.email = 'john@example.com';
    dto.password = 'short';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });
});

describe('UserLoginDto', () => {
  it('should validate correct login input', async () => {
    const dto = new UserLoginDto();
    dto.email = 'john@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when email is missing', async () => {
    const dto = new UserLoginDto();
    dto.email = '';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });
});

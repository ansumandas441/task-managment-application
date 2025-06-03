import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceRepository } from './user-service.respository';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto, UserRegisterDto } from './dto/auth.dto';
import * as passwordUtils from './utils/password-utils';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user-service.service';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserServiceRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserServiceRepository,
          useValue: {
            create: jest.fn(),
            findByEmailAddress: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserServiceRepository);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const dto: UserRegisterDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('hashedPassword');
      const user = {
        id: '123',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      repository.create.mockResolvedValue(user);

      const result = await service.register(dto);
      expect(result).toEqual(user);
      expect(repository.create).toHaveBeenCalledWith(dto, 'hashedPassword');
    });

    it('should return null if user creation fails', async () => {
      jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('hashedPassword');
      repository.create.mockResolvedValue(null);

      const result = await service.register({ email: 'a', firstname: 'b', lastname: 'c', password: '123' });
      expect(result).toBeNull();
    });

    it('should throw error if hashing or creation fails', async () => {
      jest.spyOn(passwordUtils, 'hashPassword').mockRejectedValue(new Error('fail'));

      await expect(
        service.register({ email: 'x', firstname: 'y', lastname: 'z', password: '123' }),
      ).rejects.toThrow(new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('login', () => {
    it('should return token on successful login', async () => {
      const dto: UserLoginDto = { email: 'user@example.com', password: 'password123' };
      const mockUser = {
        id: 'user-id',
        email: dto.email,
        firstname: 'firstname',
        lastname: 'lastname',
        password_hash: 'hashedPassword',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      repository.findByEmailAddress.mockResolvedValue(mockUser);
      jest.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('mock-token');

      const result = await service.login(dto);
      expect(result).toEqual({ accessToken: 'mock-token' });
    });

    it('should return null if user is not found', async () => {
      repository.findByEmailAddress.mockResolvedValue(null);

      const result = await service.login({ email: 'none', password: '123' });
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const user = {
        id: '1',
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'email@example.com',
        password_hash: 'wrongHash',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };
      repository.findByEmailAddress.mockResolvedValue(user);
      jest.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(false);

      const result = await service.login({ email: 'email@example.com', password: 'wrong' });
      expect(result).toBeNull();
    });

    it('should throw error if something fails', async () => {
      repository.findByEmailAddress.mockRejectedValue(new Error('unexpected'));

      await expect(service.login({ email: 'a', password: 'b' })).rejects.toThrow(
        new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});

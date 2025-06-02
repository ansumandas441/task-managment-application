import { 
  createParamDecorator, 
  ExecutionContext, 
  HttpException, 
  HttpStatus,
} from '@nestjs/common';

// export const GetUserClaims = createParamDecorator(
//   async (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
    
//     const authHeader = request.headers['authorization'];
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new HttpException('Unauthorized: No token provided', HttpStatus.UNAUTHORIZED);
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       throw new HttpException('Unauthorized: Invalid token format', HttpStatus.UNAUTHORIZED);
//     }

//     try {
//       const jwtService = new JwtService({
//         secret: process.env.JWT_SECRET,
//       });

//       // Verify token
//       const payload = await jwtService.verifyAsync(token);

//       const userClaims = new UserClaims();
//       userClaims.sub = payload.sub;
//       userClaims.email = payload.email;
//       userClaims.name = payload.name;

//       return userClaims;
//     } catch (error) {
//       throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
//     }
//   }
// );

export const GetUserClaims = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserClaims => {
    const request = ctx.switchToHttp().getRequest();
    const user = request['user'];
    
    if (!user) {
      throw new HttpException('User not found in request. Make sure AuthGuard is applied.', HttpStatus.UNAUTHORIZED);
    }

    return new UserClaims(user);
  }
);

export class UserClaims {
  sub: string;
  email?: string;
  name?: string

  constructor(payload: any) {
    this.sub = payload.sub;
    this.email = payload.email;
    this.name = payload.name;
  }

  getUserId(): string {
    return this.sub;
  }

  getName(): string | undefined {
    return this.name;
  }

  getEmail(): string | undefined {
    return this.email;
  }
}
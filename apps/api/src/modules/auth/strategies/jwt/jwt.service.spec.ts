import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: NestJwtService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { JwtController } from './jwt.controller';
import { JwtService } from './jwt.service';
import { CookieService } from 'src/common/utils/cookie.util';

describe('JwtController', () => {
  let controller: JwtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JwtController],
      providers: [
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: CookieService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<JwtController>(JwtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

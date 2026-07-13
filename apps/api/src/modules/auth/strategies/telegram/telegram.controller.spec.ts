import { Test, TestingModule } from '@nestjs/testing';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { CookieService } from 'src/common/utils/cookie.util';

describe('TelegramController', () => {
  let controller: TelegramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelegramController],
      providers: [
        {
          provide: TelegramService,
          useValue: { loginWithTelegram: jest.fn() },
        },
        {
          provide: CookieService,
          useValue: { setAuthCookies: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TelegramController>(TelegramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

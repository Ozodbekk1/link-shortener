import type { Response } from 'express';
import { CookieService } from './cookie.util';

describe('CookieService', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('scopes development auth cookies to localtest.me and its subdomains', () => {
    process.env.NODE_ENV = 'development';
    const cookie = jest.fn();
    const response = { cookie } as unknown as Response;

    new CookieService().setAuthCookies(
      response,
      'access-token',
      'refresh-token',
    );

    expect(cookie).toHaveBeenCalledTimes(2);
    expect(cookie).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      'access-token',
      expect.objectContaining({
        domain: '.localtest.me',
        secure: false,
        sameSite: 'lax',
      }),
    );
  });

  it('keeps production cookies scoped to uurl.uz', () => {
    process.env.NODE_ENV = 'production';
    const cookie = jest.fn();
    const response = { cookie } as unknown as Response;

    new CookieService().setAuthCookies(
      response,
      'access-token',
      'refresh-token',
    );

    expect(cookie).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      'access-token',
      expect.objectContaining({
        domain: '.uurl.uz',
        secure: true,
        sameSite: 'none',
      }),
    );
  });
});

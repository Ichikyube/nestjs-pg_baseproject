import { AuthErrorInterceptor } from './auth-error.interceptor';

describe('AuthErrorInterceptor', () => {
  it('should be defined', () => {
    expect(new AuthErrorInterceptor()).toBeDefined();
  });
});

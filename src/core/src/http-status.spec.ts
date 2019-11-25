import {HttpStatus} from './http-status';

describe('HttpStatus', () => {

  it('should find http status object from a http status code', async () => {
    const result = HttpStatus.getValueOf(200);
    expect(result).toBeDefined();
    expect(result.getCode()).toBe(200);
    expect(result.getReasonPhrase()).toEqual('OK');
  });

  it('should not find http status object from a http status code', async () => {
    const result = HttpStatus.getValueOf(800);
    expect(result).toBeUndefined();
  });
});

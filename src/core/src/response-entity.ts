import {HttpStatus} from './http-status';

export class ResponseEntity<T> {
  // TODO add headers field
  private readonly code: number;
  private readonly body?: T;

  constructor(httpStatus: HttpStatus,
              body?: T) {
    this.code = httpStatus.getCode();
    this.body = body;
  }

  static ok<T>(body: T): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.OK, body);
  }

  static internalServerError(): ResponseEntity<string> {
    return this.httpStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }

  static httpStatus(httpStatus: HttpStatus): ResponseEntity<string> {
    return new ResponseEntity(httpStatus, httpStatus.getReasonPhrase());
  }

  getCode(): number {
    return this.code;
  }

  getBody(): T | undefined {
    return this.body;
  }
}

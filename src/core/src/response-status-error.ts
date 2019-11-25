export class ResponseStatusError extends Error {
  constructor(readonly statusCode: number,
              readonly message: string) {
    super(message);

    // Set the prototype explicitly
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ResponseStatusError.prototype);
  }
}

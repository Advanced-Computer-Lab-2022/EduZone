import Exception from './Exception';

export default class BadRequestBodyException extends Exception {
  constructor(message: string) {
    super(message, 400);
  }
}

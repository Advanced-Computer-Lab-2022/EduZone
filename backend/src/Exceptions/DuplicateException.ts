import Exception from './Exception';

export default class DuplicateException extends Exception {
  constructor(message: string) {
    super(message, 409);
  }
}

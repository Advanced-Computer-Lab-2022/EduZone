import Exception from './Exception';

export default class BadRequestBody extends Exception {
  constructor(message: string) {
    super(message, 400);
  }
}

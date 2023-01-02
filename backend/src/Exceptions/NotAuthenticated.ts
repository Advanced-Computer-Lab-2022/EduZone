import Exception from './Exception';

export default class NotAuthenticated extends Exception {
  constructor(message: string) {
    super(message, 401);
  }
}

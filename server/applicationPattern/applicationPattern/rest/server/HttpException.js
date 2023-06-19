class HttpException {}

class BadRequestHttpException extends HttpException {
  constructor(message) {
    super();
    this.code = 400;
    this.message = message;
  }
}

module.exports = BadRequestHttpException;

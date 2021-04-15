const Validator = require('./validator');
const { check } = require('express-validator');

class ForgetPasswordValidator extends Validator {
  handle() {
    return [check('email').isEmail().withMessage('فیلد ایمیل معتبر نیست')];
  }
}

module.exports = new ForgetPasswordValidator();

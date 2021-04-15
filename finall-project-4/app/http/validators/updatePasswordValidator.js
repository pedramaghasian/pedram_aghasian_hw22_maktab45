const Validator = require('./validator');
const { check } = require('express-validator');

class UpdatePasswordValidator extends Validator {
  handle() {
    return [
      check('new-password')
        .isLength({ min: 6, max: 30 })
        .withMessage(
          'فیلد پسورد نمیتواند کمتر از 6 کاراکتر و بیشتر از 30 باشد'
        ),
    ];
  }
}

module.exports = new UpdatePasswordValidator();

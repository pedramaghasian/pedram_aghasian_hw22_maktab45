const Controller = require('../controller');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

class RegisterController extends Controller {
  getRegister(req, res) {
    
    res.render('home/auth/register', {
      
      captcha: this.recaptcha.render(),
      title: 'صفحه عضویت',
    });
    console.log(req.flash())
  }

  async postRegister(req, res, next) {
    if (Object.entries(req.files).length === 0) {
      req.flash('errors', 'لطفا عکس خود را انتخاب کنید');
      return res.redirect('/auth/register');
    }
    await this.recaptchaValidation(req, res);
    const result = await this.validationData(req, res);
    if (result) return this.register(req, res, next);
    return res.redirect('/auth/register');
  }

  register(req, res, next) {
    passport.authenticate('local.register', {
      successRedirect: '/user',
      failureRedirect: '/auth/register',
      failureFlash: true,
    })(req, res, next);
  }
}
module.exports = new RegisterController();

const Controller = require('../controller');
const passport = require('passport');
const User = require('app/models/user');
const PasswordReset = require('app/models/password-reset');
const uniqueString = require('unique-string');
const nodemailer = require('nodemailer');

class ForgetPasswordController extends Controller {
  getPasswordReset(req, res) {
    res.render('home/auth/password/email', {
      messages: req.flash('errors'),
      captcha: this.recaptcha.render(),
      title: ' فراموشی کلمه عبور',
    });
  }

  async sendPasswordResetLink(req, res, next) {
    await this.recaptchaValidation(req, res);
    const result = await this.validationData(req, res);
    if (result) return this.sendResetLink(req, res);
    return res.redirect('/auth/password/reset');
  }

  async sendResetLink(req, res, next) {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('errors', 'چنین کاربری وجود ندارد');
      return this.back(req, res);
    }

    const newPasswordReset = new PasswordReset({
      email: req.body.email,
      token: uniqueString(),
    });

    let pReset = await newPasswordReset.save();
    if (pReset) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pedramaghasian@gmail.com',
          pass: 'pedram007',
        },
      });
      const mailOptions = {
        from: 'pedramaghasian@gmail.com',
        to: req.body.email,
        subject: 'Reset password',
        html: `<h1> Reset password</h1>
        <p>for resete to your password please click on the Link</p>
        <a href="http://localhost:3000/auth/password/reset/${pReset.token}"> LINK</a>
       `,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          req.flash('errors', 'عملیات با شکست مواجه شد لطفا مجددا تلاش نمایید');
          console.log(err);
          this.back(req, res);
        } else {
          console.log('email send : ' + info.response);
          req.flash('success', 'ایمیل بازیابی رمز عبور با موفقیت انجام شد');
          res.redirect('/');
        }
      });
    }
  }
}

module.exports = new ForgetPasswordController();

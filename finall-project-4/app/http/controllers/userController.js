const Controller = require('./controller');
const User = require('../../models/user');
const Article = require('../../models/article');
const bcrypt = require('bcrypt');
const fileHelper = require('../../../util/file');
const fs = require('fs')




class UserController extends Controller {
  getUser(req, res) {
    User.findOne({ _id: req.session.passport.user }).then((user) => {
      if (!user) {
        req.flash('errors', 'چنین کابری وجود ندارد');
        return res.redirect('/');
      }
      Article.find({ user_id: user._id }, [], {
        $orderby: { created_at: -1 },
      }).then((articles) => {
        if (articles) {
          return res.render('home/user/singleUser', { user, articles });
        }
        return res.render('home/user/singleUser', { user, articles: [] });
      });
    });
  }

  async postEdit(req, res) {
    const result = await this.validationData(req, res);
    if (result) return this.postEditPanel(req, res);
    return this.back(req, res);
  }
  async postEditPanel(req, res) {
    let image;
    let gender;
    const oldUser = await User.findOne({ _id: req.body.userId });
    if (Object.entries(req.files).length !== 0) {
      fileHelper.deleteFile(oldUser.image)
      image = req.files.image[0].path;
    } else {
      image = oldUser.image;
    }
    if (req.body.gender !== 'none') {
      gender = req.body.gender;
    } else {
      gender = oldUser.gender;
    }

    User.updateOne(
      { _id: req.body.userId },
      {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        gender: gender,
        image: image,
      }
    )
      .then((result) => {
        // console.log(result);
        return res.redirect('/user');
      })
      .catch((e) => {
        console.log(e);
        return res.redirect('/user');
      });
  }

  async postPassword(req, res) {
    const result = await this.validationData(req, res);
    if (result) return this.postEditPasswordPanel(req, res);
    return this.back(req, res);
  }

  postEditPasswordPanel(req, res) {
    User.findOne({ _id: req.body.userId })
      .then((user) => {
        if (!user) {
          req.flash('errors', 'چنین کاربری وجود ندارد ابتدا ثبت نام کنید');
          return res.redirect('/');
        }
        bcrypt.compare(req.body.oldPassword, user.password).then((match) => {
          const newPass = req.body.newPassword;
          if (match) {
            bcrypt.hash(newPass, bcrypt.genSaltSync(15)).then((hash) => {
              if (hash) {
                return user.updateOne({ $set: { password: hash } }).then(() => {
                  req.logout();
                  res.clearCookie('remember_token');
                  res.redirect('/auth/login');
                });
              }
            });
          } else {
            req.flash('errors', 'کلمه  عبور قبلی شما درست نمیباشد');
            return res.redirect(`/`);
          }
        });
      })
      .catch(() => {
        req.flash('errors', 'مشکلی پیش آمده لطفا مجددا تلاش فرمایید');
        return res.redirect('/');
      });
  }

  deletePanel(req, res) {

    User.findOne({_id: req.body.userId })
      .then(user=>{
        if (!user) {
          req.flash('errors', 'همچین کاربری وجود ندارد');
          return this.back(req,res)
        }

        user.deleteOne().then(() => {
          fs.unlink(user.image, (err) => {
            if (err) {
              throw new Error(err);
            }
          });
    
          req.logout();
          res.clearCookie('remember_token');
          res.redirect('/auth/login');
        });

      }).catch(e=>{
        console.log(e)
        return this.back(req,res)
      })

  }
}

module.exports = new UserController();

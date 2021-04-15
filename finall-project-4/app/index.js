const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const Helpers = require('./helper');
const RememberLogin = require('app/http/middleware/rememberLogin');

class Application {
  constructor() {
    this.setupExpress();
    this.setMongoConnection();
    this.setConfig();
    this.setMulter();
    this.setRouters();
  }

  setupExpress() {
    app.listen(config.port, () =>
      console.log(`Listening on port ${config.port}`)
    );
  }

  setMongoConnection() {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.database.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  setConfig() {
    require('app/passport/passport-local');
    require('app/passport/passport-google');
    app.use(express.static(config.layout.public_dir));
    app.set('view engine', config.layout.view_engine);
    app.set('views', config.layout.view_dir);
    app.use(config.layout.ejs.expressLayouts);
    app.set('layout extractScripts', config.layout.ejs.extractScripts);
    app.set('layout extractStyles', config.layout.ejs.extractStyles);
    app.set('layout', config.layout.ejs.master);

    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );
    app.use(session({ ...config.session }));
    app.use(cookieParser('mysecretKey'));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(RememberLogin.handle);
    app.use((req, res, next) => {
      // set user - isAuthenticated() on every req
      app.locals = new Helpers(req, res).getObjects();
      res.locals.messages = req.flash();

      next();
    });
  }

  setMulter() {
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.fieldname == 'image') {
          cb(null, './public/uploade-image/profile');
        } else if (file.fieldname == 'article-image') {
          cb(null, './public/uploade-image/article-image');
        } else if (file.fieldname == 'upload') {
          cb(null, './public/uploade-image/upload');
        }
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
      },
    });
    const fileFilter = (req, file, cb) => {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
    app.use(
      multer({ storage: storage, fileFilter: fileFilter }).fields([
        { name: 'image', maxCount: 1 },
        { name: 'article-image', maxCount: 1 },
        { name: 'upload', maxCount: 1 },
      ])
    );
  }

  setRouters() {
    app.use(require('./routes/web'));
    app.use(require('./routes/api'));
  }
}

module.exports = Application;

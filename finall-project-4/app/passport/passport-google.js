const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('app/models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new googleStrategy(
    {
      clientID: config.service.google.client_key,
      clientSecret: config.service.google.secret_key,
      callbackURL: config.service.google.callback,
    },
    (token, refreshToken, profile, done) => {
      User.findOne({ email: profile.emails[0].value })
        .then((user) => {
          if (user) return done(null, user);
          const newUser = new User({
            name: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            password: profile.id,
            image:`${profile.photos[0].value}`,
            gender:'male',
            phone:0912000000
          });
          newUser.save((err) => {
            if (err) throw err;
            done(null, newUser);
          });
        })
        .catch((err) => {
          return done(err);
        });
      console.log(profile)
    }
  )
);

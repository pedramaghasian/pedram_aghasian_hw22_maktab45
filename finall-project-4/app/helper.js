const moment = require('moment-jalaali');
moment.loadPersian({ usePersianDigits: true });

class Helpers {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  getObjects() {
    return {
      auth: this.auth(),
      date: this.date,
      path:this.req.url,
    };
  }

  auth() {
    return {
      check: this.req.isAuthenticated(),
      user: this.req.user,
    };
  }

  date(time) {
    return moment(time);
  }
}

module.exports = Helpers;

const Controller = require('./controller');
const Article = require('../../models/article');
const User = require('../../models/user');

class HomeController extends Controller {
  async index(req, res) {
    let users = await User.find({}).sort({ createdAt: -1 }).limit(4);

    let page = req.query.page || 1;

    Article.paginate(
      {},
      { page, populate: 'user_id', sort: { createdAt: -1 }, limit: 6 }
    ).then((articles) => {
      if (articles) {
        return res.render('home/index', {
          articles: articles.docs,
          pagination: articles,
          users,
        });
      }
      return res.render('home/index', {
        articles: [],
        pagination: articles,
        users,
      });
    });
  }
}

module.exports = new HomeController();

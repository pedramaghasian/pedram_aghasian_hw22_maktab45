const Controller = require('./controller');
const Article = require('../../models/article');
const User = require('../../models/user');

class HomeController extends Controller {
  getNewArticle(req, res) {
    User.findOne({ _id: req.session.passport.user }).then((user) => {
      if (!user) {
        req.flash('errors', 'چنین کابری وجود ندارد');
        return res.redirect('/');
      }

      return res.render('home/article/newarticle', { userr: user });
    });
  }

  getMyArticle(req, res) {
    let page = req.query.page || 1;
    User.findOne({ _id: req.session.passport.user }).then((user) => {
      if (!user) {
        req.flash('errors', 'چنین کابری وجود ندارد');
        return res.redirect('/');
      }
      Article.paginate(
        { user_id: user._id },
        { page, sort: { createdAt: -1 }, limit: 3 }
      ).then((articles) => {
        if (articles) {
          return res.render('home/article/myarticle', {
            articles: articles.docs,
            pagination: articles,
          });
        }
        return res.render('home/article/myarticle', { articles: [] });
      });
    });
  }

  getSingleArticle(req, res) {
    Article.findOne({ _id: req.params.id }).then((article) => {
      if (!article) {
        req.flash('errors', 'چنین مقاله ای وجود ندارد');
        return this.back(req, res);
      }

      return res.render('home/article/singlearticle', { article });
    });
  }

  postCkeditor(req, res) {
    const image = req.files['upload'];

    // console.log(image[0]);
    res.json({
      uploaded: 1,
      fileName: image[0].originalname,
      // url: `${image[0].destination}/${image[0].filename}`.substring(8),
      url: `/${image[0].path.replace('public/', '')}`,
    });
  }
  postArticle(req, res) {
    let image;

    User.findOne({ _id: req.body.userId })
      .then((user) => {
        if (!user) {
          req.flash('errors', 'چنین کاربری یافت نشد');
          return this.back(req, res);
        }
        if (Object.entries(req.files).length !== 0) {
          image = req.files['article-image'][0].path;
        }
        const article = new Article({
          title: req.body.title,
          description1: req.body.description1,
          description2: req.body.editor,
          user_id: req.body.userId,
          image,
        });
        article.save((err, result) => {
          if (err) {
            req.flash('errors', 'عملیات با شکست مواجه شد');
            console.log(err);
            return this.back(req, res);
          }

          return res.redirect('/article/myarticle');
        });
      })
      .catch((err) => {
        console.log(err);

        req.flash('errors', 'عملیات با شکست مواجه شد');
        return this.back(req, res);
      });
  }

  getEdit(req,res){
    Article.findOne({_id:req.params.id})
    .then(article=>{

      res.render('home/article/editarticle',{article})
    })
  }
  postEdit(req,res){


    Article.findOne({_id:req.body.articleId}).then(article=>{
      if(!article){
        req.flash('errors', 'چنین مقاله ای یافت نشد');
        return this.back(req, res);
      }
      if(req.body.title){
        article.title=req.body.title
      }
      if(req.body.description1){
        article.description1=req.body.description1

      }
      if(req.body.editor){
        article.description2=req.body.editor

      }
      if (Object.entries(req.files).length !== 0) {
        article.image = req.files['article-image'][0].path;
      } else {
        article.image = article.image;
      }
      return article.save((err,result)=>{
        if(err){
          console.log(err)
          return this.back(req,res)
        }
        return res.redirect('/article/myarticle')

      })

    })
    

  }

  deleteArticle(req,res){
    Article.deleteOne({_id:req.body.articleId})
    .then(result=>{
      return res.redirect('/article/myarticle')
    })
  }
}

module.exports = new HomeController();

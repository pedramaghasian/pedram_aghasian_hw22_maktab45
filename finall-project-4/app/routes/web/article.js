const express = require('express');
const router = express.Router();

//controllers
const articleController = require('app/http/controllers/articleController');

//routes
router.get('/myarticle',articleController.getMyArticle)
router.get('/',articleController.getNewArticle)
router.post('/', articleController.postArticle);
router.post('/ckeditor', articleController.postCkeditor);
router.post('/edit', articleController.postEdit);
router.post('/delete',articleController.deleteArticle)
router.get('/edit/:id', articleController.getEdit);


router.get('/:id',articleController.getSingleArticle)


module.exports = router;

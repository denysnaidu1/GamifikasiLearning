import express from 'express';

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(123);
  //res.render('index', { title: 'Express' });
});

export default router;

//exports.indexRouter = router;


//bina agung, tanya ambil dimana sumber aqua
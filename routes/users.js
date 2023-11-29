import express from 'express'
//import getUsers from '../controllers/auth/auth.js';

var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log(123);
  try{
    // var t = await getUsers();
    // res.json(t);
  }catch(err){
    console.log(err);
    next(err);
  }
});

export default router;
//module.exports = router;

import express from 'express'
import loginUtils from '../controllers/auth/auth.js';
import {LoginModel} from '../models/userModel.js'
import responseModel from '../models/responseModel.js';
import constants from '../utils/constants.js';
import {plainToClass, plainToInstance} from 'class-transformer';

var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log('materi');
  try{
    var t = await loginUtils.getUsers();
    res.json(t);
  }catch(err){
    console.log(err.message);
    next(err);
  }
});

router.post('/login',async function(req,res,next){
     var result = new responseModel();
     try{
          const model = plainToInstance(LoginModel,req.body);
          result.message = await loginUtils.login(model);
          if(result.message!=constants.STATUS_OK){
               throw result.message;
          }
     }catch(err){
          result.message = err.message??err;
          result.statusCode = constants.STATUS_CODE_VALIDATION_ERROR;
     }
     res.end(JSON.stringify(result));
})


router.post('/register',async function(req,res,next){
     var result = new responseModel();
     try{
          const model = plainToInstance(LoginModel,req.body);
          result.message = await loginUtils.register(model);
          if(result.message!=constants.STATUS_OK){
               throw result.message;
          }
     }catch(err){
          result.message = err.message??err;
          result.statusCode = constants.STATUS_CODE_VALIDATION_ERROR;
     }
     res.end(JSON.stringify(result));
})

export default router;

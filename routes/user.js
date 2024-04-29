import express from 'express'
import responseModel from '../models/responseModel.js';
import userUtils from '../controllers/user.controller.js';
import UserViewModel from '../viewModels/userViewModel.js';
import { plainToInstance } from 'class-transformer';
//import getUsers from '../controllers/auth/auth.js';

var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  var result = new responseModel();
  try{
    result.body = await userUtils.getUsers();
  }catch(exc){
    result.message = exc;
  }
  res.end(JSON.stringify(result));

});

router.get('/detail/:nisn',async function(req,res,next){
  var result = new responseModel();
  try{
    var userNisn = req.params.nisn;
    result.body = await userUtils.getUserDetails(userNisn);
  }catch(exc){
    result.message = exc;
  }
  res.end(JSON.stringify(result));
});

router.post('/submit',async function(req,res,next){
  var result = new responseModel();
  try{
    const model = plainToInstance(UserViewModel, req.body);
    result.message = await userUtils.submitUser(model);
  }catch(exc){
    result.message = exc;
    console.log(exc);
  }
  console.log(result);
  res.end(JSON.stringify(result));
});


export default router;
//module.exports = router;

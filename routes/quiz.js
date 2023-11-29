import express from 'express'
// import quizUtils from '../controllers/quiz.js';
import quizUtils from '../controllers/quiz.controller.js';
import userQuizUtils from '../controllers/userquiz.controller.js';
import {QuizModel} from '../models/quizModel.js'
import responseModel from '../models/responseModel.js';
import constants from '../utils/constants.js';
import {plainToClass, plainToInstance} from 'class-transformer';

var router = express.Router();

//GET: All Quiz and QuizQuestion
router.get('/',async function(req,res,next){
     var result = new responseModel();
     try{
          result.body = await quizUtils.getAllQuiz();
     }catch(exc){
          result.message = exc;
     }
     res.end(JSON.stringify(result));
})

//Get: Quiz Question detail
//Include quiz options and quiz
router.get('/detail/:id',async function(req,res,next){
     var result = new responseModel();
     try{
          var quizId = req.params.id;
          result.body = await quizUtils.getQuizDetails(quizId);
     }catch(exc){
          result.message = exc;
     }
     res.end(JSON.stringify(result));
})

router.get('/leaderboard', async function(req, res, next) {
  var result = new responseModel();
  try{
    result.body = await userQuizUtils.getLeaderBoards();
  }catch(exc){
     result.message = exc;
  }
  res.end(JSON.stringify(result));
});

export default router;

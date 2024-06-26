import express from 'express'
// import quizUtils from '../controllers/quiz.js';
import quizUtils from '../controllers/quiz.controller.js';
import userQuizUtils from '../controllers/userquiz.controller.js';
import { QuizModel } from '../models/quizModel.js'
import responseModel from '../models/responseModel.js';
import constants from '../utils/constants.js';
import { plainToClass, plainToInstance } from 'class-transformer';
import { QuizViewModel } from '../viewModels/quizViewModel.js';

var router = express.Router();

//GET: All Quiz and QuizQuestion
router.get('/admin/', async function (req, res, next) {
     var result = new responseModel();
     try {
          result.body = await quizUtils.getAllQuiz();
     } catch (exc) {
          result.message = exc;
     }
     res.end(JSON.stringify(result));
})

//Get: Quiz Question detail
//Include quiz options and quiz
router.get('/detail/:quizId', async function (req, res, next) {
     var result = new responseModel();
     try {
          var quizId = req.params.quizId;
          result.body = await quizUtils.getQuizDetails(quizId);
     } catch (exc) {
          result.message = exc;
     }
     res.end(JSON.stringify(result));
})

router.post('/submit',async function(req,res,next){
     var result = new responseModel();
     try{
          const model = plainToInstance(QuizViewModel,req.body);
          const username = req.headers.username;
          if(!username){
               throw "Invalid headers"
          }
          var submitResult = await quizUtils.submitQuiz(model,username);
          result.message = submitResult.message;
          result.body = submitResult.data;
          if(result.message!=constants.STATUS_OK){
               throw result.message;
          }      
     }catch(exc){
          result.message = exc;
          result.statusCode = constants.STATUS_CODE_VALIDATION_ERROR;
     }
     res.end(JSON.stringify(result));

});

router.post('/admin/submit',async function(req,res,next){
     var result = new responseModel();
     try{
          const model = plainToInstance(QuizViewModel,req.body);
          console.log(model);
          result.message = await quizUtils.submitQuizAdmin(model);
          if(result.message!=constants.STATUS_OK){
               throw result.message;
          }
     }catch(exc){
          console.log(exc);
          result.message = exc;
          result.statusCode = constants.STATUS_CODE_VALIDATION_ERROR;
     }
     res.end(JSON.stringify(result));

});

router.get('/leaderboard', async function (req, res, next) {
     var result = new responseModel();
     try {
          //const materiCode = req.params.materiCode;
          result.body = await userQuizUtils.getLeaderBoards();
     } catch (exc) {
          result.message = exc;
     }
     res.end(JSON.stringify(result));
});


router.get('/leaderboard/:materiCode', async function (req, res, next) {
     var result = new responseModel();
     try {
          const materiCode = req.params.materiCode;
          result.body = await userQuizUtils.getLeaderBoardsByMateri(materiCode);
          console.log(result.body);
     } catch (exc) {
          result.message = exc;
     }
     res.end(JSON.stringify(result));
});

export default router;

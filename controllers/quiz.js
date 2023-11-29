import { query } from '../config/db_config.js';
import constants from '../utils/constants.js';
import responseModel from '../models/responseModel.js';
import BaseModel from '../models/baseModel.js';

export default class quizUtils {

     static async getLeaderBoard(){
          var data = await query(
               `SELECT * FROM UserQuiz
               Order by TotalScore desc`
          )

          return data;
     }
     
     static async getQuizMateri (materiId){
          const data = await query(
               `SELECT * FROM Quiz
               Where MateriId=${materiId} and IsDeleted=0`
          );

          return data;
     }


     static async getQuizDetails(quizId){
          const data = await query(
               `Select * from QuizQuestion A
               INNER JOIN QuizQuestionDetail B ON B.QuizQuestionId = A.Id and B.IsDeleted!=1
               where A.IsDeleted!=1 AND A.QuizId=${quizId}`
          );

          //data = data.map(r=>({}))
          return data;
     }
     static async getQuizList(){
          const data = await query(
               `Select * from Quiz
               Where IsDeleted!=1`
          );

          return data;
     }
}
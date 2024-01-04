import db from "../models/index.js";

const Quiz = db.Quiz;
const QuizQuestion = db.QuizQuestion;
export default class quizUtils {

  static async getAllQuiz() {
    return await Quiz.findAll({
      include: ["quizQuestions"],
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
  }

  static async getQuizDetails(quizId) {
    return await Quiz.findAll({
      include: [
        {
          association:"quizQuestions",
          attributes:["Id","Question"],
          required:true,
          where:{
            IsDeleted:false
          },
          include:[
            {
              association:"quizQuestionDetails",
              required:true,
              attributes:["Id","Choice","Description","IsAnswer"],
              where:{
                IsDeleted: false
              }
            }
          ]
        }
      ],
      attributes:["Id","MateriId","Title","TimeLimit"],
      where: { Id: quizId}
     })
     .then((data)=>{
          return data;
     })
     .catch((err)=>{
          return err;
     })
  }

  static async saveQuiz(quizViewModel){
    try{
      await Quiz
      .findByPk(quizViewModel.Id)
      .then((data)=>{
        if(!data) throw "Invalid Quiz";

        
      })
      .catch((err)=>{
        throw err;
      })
    }catch(err){
      return err;
    }
  }
}
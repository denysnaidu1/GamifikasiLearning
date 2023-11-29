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
    return await QuizQuestion.findAll({
      include: ["quizQuestionDetails","quiz"],
      where: { QuizId: quizId }
     })
     .then((data)=>{
          return data;
     })
     .catch((err)=>{
          return err;
     })
  }
}
import db from "../models/index.js";
import constants from "../utils/constants.js";

const Quiz = db.Quiz;
const QuizQuestion = db.QuizQuestion;
const UserQuiz = db.UserQuiz;
const UserQuizDetail = db.UserQuizDetail;
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
          association: "materi",
          attributes: ["Title"]
        },
        {
          association: "quizQuestions",
          attributes: ["Id", "Question"],
          required: true,
          where: {
            IsDeleted: false
          },
          include: [
            {
              association: "quizQuestionDetails",
              required: true,
              attributes: ["Id", "Choice", "Description", "IsAnswer"],
              where: {
                IsDeleted: false
              }
            }
          ]
        }
      ],
      attributes: ["Id", "MateriId", "Title", "TimeLimit"],
      where: { Id: quizId }
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      })
  }

  static async saveQuiz(quizViewModel) {
    try {
      await Quiz
        .findByPk(quizViewModel.Id)
        .then(async (data) => {
          if (!data) throw "Invalid Quiz";

          var dbUserQuizDetails = [];
          var totalQuestion = quizViewModel.quizQuestions.length;
          var correctCount = 0;
          quizViewModel.quizQuestions.forEach(question => {
            var selectedAnswer = question.quizQuestionDetails.find(r => r.isSelected).Choice;
            var correctAnswer = question.quizQuestionDetails.find(r => r.IsAnswer).Choice;
            correctCount += (selectedAnswer == correctAnswer ? 1 : 0);
            var model = {
              QuizQuestionId: question.Id,
              Answered: selectedAnswer
            };
            dbUserQuizDetails.push(model);
          });

          var totalScore = correctCount / totalQuestion * 10;

          var userQuizModel = {
            QuizId: quizViewModel.Id,
            TotalScore: totalScore,
            TotalCorrect: correctCount,
            FinishedTime: Date.now(),
            CreatedBy: 'test',
            CreatedDate: Date.now(),
            IsDeleted: false,
            userQuizDetails: dbUserQuizDetails
          };

          await UserQuiz.create(
            userQuizModel,{
              include:["userQuizDetails"]
            }
          );
        })
        .catch((err) => {
          console.log(err);
          throw err;
        })
    } catch (err) {
      return err;
    }

    return constants.STATUS_OK;
  }
}
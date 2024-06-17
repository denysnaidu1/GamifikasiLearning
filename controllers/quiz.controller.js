import { literal } from "sequelize";
import db from "../models/index.js";
import constants from "../utils/constants.js";

const Quiz = db.Quiz;
const QuizQuestion = db.QuizQuestion;
const QuizQuestionDetail = db.QuizQuestionDetail;
const UserQuiz = db.UserQuiz;
const UserQuizDetail = db.UserQuizDetail;
const sequelize = db.sequelize;
export default class quizUtils {

  static async getAllQuiz() {
    return await Quiz.findAll({
      where: {
        IsDeleted: false
      }
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

  static async submitQuiz(quizViewModel,username) {
    const result = {data:null,message:constants.STATUS_OK};
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

          var totalScore = correctCount / totalQuestion * 100;
          result.data = {totalScore:totalScore};
          var userQuizModel = {
            QuizId: quizViewModel.Id,
            TotalScore: totalScore,
            TotalCorrect: correctCount,
            FinishedTime: Date.now(),
            CreatedBy: username,
            CreatedDate: Date.now(),
            IsDeleted: false,
            userQuizDetails: dbUserQuizDetails
          };

          await UserQuiz.create(
            userQuizModel, {
            include: ["userQuizDetails"]
          }
          );
        })
        .catch((err) => {
          throw err;
        })
    } catch (err) {
      result.message = err;
    }

    return result;
  }

  static async create(quizViewModel) {
    try {
      await Quiz.findOne({
        where: {
          MateriId: quizViewModel.MateriId,
          Title: quizViewModel.Title,
          IsDeleted: false
        }
      })
        .then(async (data) => {
          if (data) throw "Quiz with the same materi and title is already exist";

          if (quizViewModel.quizQuestions.length == 0) {
            throw "Please create a question for this quiz";
          }

          const t = await sequelize.transaction();
          try {
            var quizModel = {
              MateriId: quizViewModel.MateriId,
              Title: quizViewModel.Title,
              TimeLimit: quizViewModel.TimeLimit,
              CreatedBy: 'test',
              CreatedDate: literal('CURRENT_TIMESTAMP'),
              IsDeleted: false
            };

            var quiz = await Quiz.create(
              quizModel,
              { transaction: t }
            );

            for (let question of quizViewModel.quizQuestions) {
              var questionModel = {
                QuizId: quiz.Id,
                Question: question.Question,
                CreatedBy: 'test',
                CreatedDate: literal('CURRENT_TIMESTAMP'),
                IsDeleted: false
              };

              var quizQuestion = await QuizQuestion.create(
                questionModel,
                { transaction: t }
              );

              for (let detail of question.quizQuestionDetails) {
                var detailModel = {
                  QuizQuestionId: quizQuestion.Id,
                  Choice: detail.Choice,
                  Description: detail.Description,
                  IsAnswer: detail.IsAnswer,
                  IsDeleted: false
                };

                var quizQuestionDetail = await QuizQuestionDetail.create(
                  detailModel,
                  { transaction: t }
                );
              }
            }

            await t.commit();

          } catch (err) {
            await t.rollback();
            throw err;
          }
        })
        .catch((err) => {
          throw err;
        })
    } catch (err) {
      return err;
    }
    return constants.STATUS_OK;
  }

  static async update(quizViewModel) {
    try{
      const t = await sequelize.transaction();
      try {
        await Quiz
          .findByPk(quizViewModel.Id, { transaction: t })
          .then(async (data) => {
            if (!data) throw "Invalid  Quiz";
  
            if (quizViewModel.mode == constants.FORM_MODE_DELETE) {
              data.IsDeleted = true;
            }
            else {
              data.MateriId = quizViewModel.MateriId;
              data.Title = quizViewModel.Title;
              data.TimeLimit = quizViewModel.TimeLimit;
            }
  console.log(data);
            await data.save({ transaction: t });
  
            for (let question of quizViewModel.quizQuestions) {
              await QuizQuestion
                .findByPk(question.Id, { transaction: t })
                .then(async (questionModel) => {
                  if (question.mode == constants.FORM_MODE_DELETE) {
                    questionModel.IsDeleted = true;
                  }
                  else {
                    questionModel.Question = question.Question;
                  }
  
                  await questionModel.save({ transaction: t });
  
                  for (let detail of question.quizQuestionDetails) {
                    await QuizQuestionDetail
                      .findByPk(detail.Id, { transaction: t })
                      .then(async (detailModel) => {
                        if (detail.mode == constants.FORM_MODE_DELETE) {
                          detailModel.IsDeleted = true;
                        }
                        else {
                          detailModel.IsDeleted = false;
                        }
  
                        detailModel.Choice = detail.Choice;
                        detailModel.Description = detail.Description;
                        detailModel.IsAnswer = detail.IsAnswer;
  
                        await detailModel.save({ transaction: t });
                      })
                      .catch((err) => {
                        throw err;
                      })
                  }
                })
                .catch((err) => {
                  throw err;
                })
            }
          })
          .catch((err) => {
            throw err;
          })
      } catch (err) {
        await t.rollback();
        throw err;
      }

      await t.commit();
    }catch(err){
      return err;
    }

    return constants.STATUS_OK;
  }

  static async submitQuizAdmin(quizViewModel) {
    try {
      if (quizViewModel.mode == constants.FORM_MODE_CREATE) {
        return await this.create(quizViewModel);
      }
      else {
        return await this.update(quizViewModel);
      }
    } catch (err) {
      return err;
    }
  }
}
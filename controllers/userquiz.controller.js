import db from "../models/index.js";
import QuizModel from "../models/quiz.model.js";

const UserQuiz = db.UserQuiz;
export default class userQuizUtils {
  static async getLeaderBoards() {
    return await UserQuiz.findAll()
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
  }

  static async getLeaderBoards() {
    return await UserQuiz.findAll({
      include: [
        {
          association: "quiz",
          attributes: ["Title","TimeLimit"],
          order:[
               ["quiz","TotalScore","DESC"]
          ]
        },
      ],
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
  }
}

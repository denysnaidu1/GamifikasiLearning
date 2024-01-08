import { literal } from "sequelize";
import db from "../models/index.js";
import QuizModel from "../models/quiz.model.js";

const materi = db.Materi;
export default class materiUtils {

  static async getMateriByCode(materiCode){
    return await materi.findOne({
      where:{Name:materiCode},
      include:[
        {
          model:materi,as:'children',
          attributes:["Name","Title","Content"],
          where:{
            IsDeleted:false
          }
        }
      ]
    })
    .then((data)=>{
      return data;
    })
    .catch((err)=>{
      return err;
    })
  }
  static async getLeaderBoardsByMateri(materiCode) {
    return await materi.findAll({
      include: [
        {
          association: "quiz",
          attributes: ["Title","TimeLimit"],
          required:true,
          order: [
            ["quiz", "TotalScore", "DESC"]
          ],
          include: [
            {
              association: "materi",
              attributes:[],
              required:true,
              where:{
                Name:materiCode
              }
            }
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

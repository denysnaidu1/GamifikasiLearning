import { literal } from "sequelize";
import db from "../models/index.js";
import QuizModel from "../models/quiz.model.js";

const UserQuiz = db.UserQuiz;
const quiz = db.Quiz;
const materi = db.Materi;
export default class userQuizUtils {

  // static async getLeaderBoardsByMateri(materiCode) {
  //   return await quiz.count({
  //     include:[
  //       {
  //         association: "materi",
  //         required:true,
  //         where:{
  //           Name:materiCode
  //         }
  //       }
  //     ]
  //   })
  //   .then(async (count)=>{
  //     await UserQuiz.findAll({
  //       include: [
  //         {
  //           association: "quiz",
  //           attributes: ["Title","TimeLimit"],
  //           required:true,
  //           order: [
  //             ["quiz", literal("TotalScore"), "DESC"]
  //           ],
  //           include: [
  //             {
  //               association: "materi",
  //               attributes:[],
  //               required:true,
  //               where:{
  //                 Name:materiCode
  //               }
  //             }
  //           ]
  //         },
  //       ],
  //     })
  //       .then((data) => {
  //         return data;
  //       })
  //       .catch((err) => {
  //         return err;
  //       });
  //   })
  //   .catch((err)=>{
  //     return err;
  //   });
  //   return await UserQuiz.findAll({
  //     include: [
  //       {
  //         association: "quiz",
  //         attributes: ["Title","TimeLimit"],
  //         required:true,
  //         order: [
  //           ["quiz", "TotalScore", "DESC"]
  //         ],
  //         include: [
  //           {
  //             association: "materi",
  //             attributes:[],
  //             required:true,
  //             where:{
  //               Name:materiCode
  //             }
  //           }
  //         ]
  //       },
  //     ],
  //   })
  //     .then((data) => {
  //       return data;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }

  static async getLeaderBoardsByMateri(materiCode) {
    var result = null;
    await materi.findOne({
      attributes: ["Id"],
      where: {
        Name: materiCode,
        IsDeleted: false
      }
    })
      .then(async (data) => {
        var materiId = data.Id;
        await quiz.count({
          include: [
            {
              association: "materi",
              required: true,
              where: {
                Name: materiCode,
                [Op.or]: [{ ParentMateriId: materiId }],
                IsDeleted: false
              }
            }
          ]
        })
          .then(async (count) => {
            await UserQuiz.findAll({
              include: [
                {
                  association: "quiz",
                  attributes: ["Title", "TimeLimit"],
                  required: true,
                  order: [
                    ["quiz", literal("TotalScore"), "DESC"]
                  ],
                  where: {
                    IsDeleted: false
                  },
                  include: [
                    {
                      association: "materi",
                      attributes: [],
                      required: true,
                      where: {
                        Name: materiCode,
                        [Op.or]: [{ ParentMateriId: materiId }]
                      }
                    }
                  ]
                },
              ],
              where: {
                IsDeleted: false
              }
            })
              .then((data) => {
                result = data;
              })
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        result = err;
      })


    return result;
  }

  static async getLeaderBoards() {
    return await UserQuiz.findAll({
      include: [
        {
          association: "quiz",
          attributes: ["Title", "TimeLimit"],
          order: [
            ["quiz", "TotalScore", "DESC"]
          ],
          where: {
            IsDeleted: false
          }
        },
      ],
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
}

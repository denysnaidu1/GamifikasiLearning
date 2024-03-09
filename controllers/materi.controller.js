import { literal } from "sequelize";
import db from "../models/index.js";
import QuizModel from "../models/quiz.model.js";
import constants from "../utils/constants.js";

const Materi = db.Materi;
export default class materiUtils {

  static async getAllMateries() {
    return await Materi.findAll({
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

  static async getAdminMateriDetails(id) {
    return await Materi.findByPk(id, {
      include: [
        {
          model: Materi, as: 'subMateries',
          required: true,
          where: {
            IsDeleted: false
          },
        }
      ]
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      })
  }

  static async create(materiViewModel){
    try {
      await Materi.findOne({
        where: {
          Name: materiViewModel.Name,
          ParentMateriId: materiViewModel.ParentMateriId,
          IsDeleted: false
        }
      })
        .then(async (data) => {
          if (data) throw "The Materi with the same name already exist";

          const t = await sequelize.transaction();
          try {
            var materiModel = {
              ParentMateriId: materiViewModel.ParentMateriId,
              Name: materiViewModel.Name,
              Title: materiViewModel.Title,
              //Content: quizViewModel.TimeLimit,
              CreatedBy: 'test',
              CreatedDate: literal('CURRENT_TIMESTAMP'),
              IsDeleted: false
            };

            var materi = await Materi.create(
              materiModel,
              {transaction:t}
            );

            for(let subMateri of materi.subMateries){
              var subMateriModel = {
                ParentMateriId: materi.Id,
                Name: subMateri.Name,
                Title: subMateri.Title,
                //Content: quizViewModel.TimeLimit,
                CreatedBy: 'test',
                CreatedDate: literal('CURRENT_TIMESTAMP'),
                IsDeleted: false
              };

              await Materi.create(
                subMateriModel,
                {transaction:t}
              );
  
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

  static async update(materiViewModel){

  }

  static async submit(materiViewModel){
    try{
      if(materiViewModel.mode == constants.FORM_MODE_CREATE){
        return await this.create(materiViewModel);
      }
      else{
        return await this.update(materiViewModel);
      }
    }catch(err){
      return err;
    }
  }

  static async getMateriDetails(materiCode) {
    return await Materi.findOne({
      where: { Name: materiCode },
      include: [
        {
          model: materi, as: 'subMateries',
          attributes: ["Name", "Title", "Content"],
          required: false,
          where: {
            IsDeleted: false
          },
          include: [
            {
              association: "quizes",
              attributes: ["Id", "Title", "TimeLimit",],
              where: {
                IsDeleted: false
              }
            }
          ]
        },
        {
          association: "quizes",
          attributes: ["Id", "Title", "TimeLimit",],
          where: {
            IsDeleted: false
          }
        }
      ]
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      })
  }
  static async getLeaderBoardsByMateri(materiCode) {
    return await Materi.findAll({
      include: [
        {
          association: "quiz",
          attributes: ["Title", "TimeLimit"],
          required: true,
          order: [
            ["quiz", "TotalScore", "DESC"]
          ],
          include: [
            {
              association: "materi",
              attributes: [],
              required: true,
              where: {
                Name: materiCode
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
          attributes: ["Title", "TimeLimit"],
          order: [
            ["quiz", "TotalScore", "DESC"]
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

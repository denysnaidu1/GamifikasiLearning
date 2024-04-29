import { literal } from "sequelize";
import db from "../models/index.js";
import QuizModel from "../models/quiz.model.js";
import constants from "../utils/constants.js";

const Materi = db.Materi;
const sequelize = db.sequelize;
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

  static async create(materiViewModel) {
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
              Content: materiViewModel.Content,
              CreatedBy: 'test',
              CreatedDate: literal('CURRENT_TIMESTAMP'),
              IsDeleted: false
            };

            var materi = await Materi.create(
              materiModel,
              { transaction: t }
            );

            console.log(materi.Id);

            for (let subMateri of materiViewModel.subMateries) {
              var subMateriModel = {
                ParentMateriId: materi.Id,
                Name: subMateri.Name,
                Title: subMateri.Title,
                Content: subMateri.Content,
                CreatedBy: 'test',
                CreatedDate: literal('CURRENT_TIMESTAMP'),
                IsDeleted: false
              };

              await Materi.create(
                subMateriModel,
                { transaction: t }
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

  static async update(materiViewModel) {
    try {
      const t = await sequelize.transaction();
      try {
        await Materi
          .findByPk(materiViewModel.Id, { transaction: t })
          .then(async (data) => {
            if (!data) throw "Invalid  Materi";

            if (materiViewModel.mode == constants.FORM_MODE_DELETE) {
              data.IsDeleted = true;
            }
            else {
              data.Name = materiViewModel.Name;
              data.ParentMateriId = materiViewModel.ParentMateriId;
              data.Content = materiViewModel.Content;
              data.Title = materiViewModel.Title;
            }

            await data.save({ transaction: t });

            for (let subMateri of materiViewModel.subMateries) {
              if (subMateri.mode == constants.FORM_MODE_CREATE) {
                await Materi
                  .findOne({
                    where: {
                      Name: subMateri.Name,
                      ParentMateriId: subMateri.ParentMateriId,
                      IsDeleted: false
                    }
                  }, { transaction: t })
                  .then(async (subMateriModel) => {
                    if (subMateriModel) {
                      subMateriModel.ParentMateriId = data.Id;
                      await subMateriModel.save({ transaction: t });
                    }
                    else {
                      var subMateriModel = {
                        ParentMateriId: data.Id,
                        Name: subMateri.Name,
                        Title: subMateri.Title,
                        Content: subMateri.Content,
                        CreatedBy: 'test',
                        CreatedDate: literal('CURRENT_TIMESTAMP'),
                        IsDeleted: false
                      };

                      await Materi.create(
                        subMateriModel,
                        { transaction: t }
                      );
                    }
                  })
              }
              else {
                await Materi
                  .findByPk(subMateri.Id, { transaction: t })
                  .then(async (subMateriModel) => {
                    if (!subMateriModel) throw `Invalid  SubMateri ${subMateri.Name}`;

                    if (subMateri.mode == constants.FORM_MODE_DELETE) {
                      subMateriModel.IsDeleted = true;
                    }
                    else {
                      subMateriModel.Name = materiViewModel.Name;
                      subMateriModel.Content = materiViewModel.Content;
                      subMateriModel.Title = materiViewModel.Title;
                    }

                    await subMateriModel.save({ transaction: t });
                  })
                  .catch((err) => {
                    throw err;
                  })
              }

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
    } catch (err) {
      return err;
    }

    return constants.STATUS_OK;
  }

  static async submit(materiViewModel) {
    try {
      if (materiViewModel.mode == constants.FORM_MODE_CREATE) {
        return await this.create(materiViewModel);
      }
      else {
        return await this.update(materiViewModel);
      }
    } catch (err) {
      return err;
    }
  }

  static async getMateriDetails(materiCode) {
    return await Materi.findOne({
      where: { Name: materiCode },
      include: [
        {
          model: Materi, as: 'subMateries',
          attributes: ["Name", "Title", "Content"],
          required: false,
          where: {
            IsDeleted: false
          },
          include: [
            {
              association: "quizes",
              attributes: ["Id", "Title", "TimeLimit"],
              required: false,
              where: {
                IsDeleted: false
              }
            }
          ]
        },
        {
          association: "quizes",
          attributes: ["Id", "Title", "TimeLimit"],
          required: false,
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

import { literal, Op } from "sequelize";
import db from "../models/index.js";
import constants from "../utils/constants.js";

const Users = db.Users;
export default class userUtils {

  static async getUsers() {
    return await Users.findAll({
      where: {
        isDeleted: false
      }
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      })
  }

  static async getUserDetails(nik) {
    return await Users.findOne({
      attributes: ["UserId", "NIK", "FullName", "IsDeleted"],
      where: {
        NIK: nik
      }
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      })
  }

  static async create(userViewModel) {
    try {
      await Users.findOne({
        where: {
          NIK: userViewModel.NIK
        }
      })
        .then(async (data) => {
          if (data) throw "User NIK already registered";

          var userModel = {
            NIK: userViewModel.NIK,
            FullName: userViewModel.FullName,
            Password: userViewModel.Password,
            IsDeleted: false
          }

          await Users.create(
            userModel
          );
        })
        .catch((err) => {
          throw err;
        })

    } catch (err) {
      return err;
    }
    return constants.STATUS_OK;
  }

  static async update(userViewModel) {
    try {
      await Users
        .findByPk(userViewModel.UserId)
        .then(async (data) => {
          if (!data) throw "Invalid User";

          await Users.findOne({
            where: {
              NIK: userViewModel.NIK,
              [Op.not]: [{ UserId: userViewModel.UserId }]
            }
          })
            .then(async (row) => {
              if (row) throw "User NIK already registered";

              if (userViewModel.mode == constants.FORM_MODE_DELETE) data.IsDeleted = true;
              data.NIK = userViewModel.NIK;
              data.FullName = userViewModel.FullName;
              data.Password = userViewModel.Password;

              await data.save();
            })
            .catch((err) => {
              throw err;
            })
        })
        .catch((err) => {
          throw err;
        })

    } catch (err) {
      return err;
    }
    return constants.STATUS_OK;
  }

  static async submitUser(userViewModel) {
    try {
      if (userViewModel.mode == constants.FORM_MODE_CREATE) {
        return await this.create(userViewModel);
      }
      else {
        return await this.update(userViewModel);
      }
    } catch (err) {
      return err;
    }
  }

  static async getMateriDetails(materiCode) {
    return await materi.findOne({
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
    return await materi.findAll({
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

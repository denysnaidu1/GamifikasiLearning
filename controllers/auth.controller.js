import { literal, Op } from "sequelize";
import db from "../models/index.js";
import constants from "../utils/constants.js";

const Users = db.Users;
export default class authUtils {

  static async login(loginModel) {
    console.log(loginModel);
    var result = { data: null, message: constants.STATUS_OK };
    try {
      await Users.findOne({
        attributes: ["NISN","IsAdmin"],
        where: {
          NISN: loginModel.username,
          Password: loginModel.password
        }
      })
        .then((data) => {
          if (!data) throw "Invalid nisn/password";

          result.data = data;
        })
    } catch (err) {
      result.message = err;
    }

    return result;
  }
}

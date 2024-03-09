import { query } from '../../config/db_config.js';
import constants from '../../utils/constants.js';

export default class loginUtils {

     static async getUsers(){
          const data = await query(
               "SELECT * FROM Users"
          )
          console.log(data);
          return data;
     }
     
     static async login (loginModel){
          let result = constants.STATUS_OK;
          const data = await query(
               `SELECT * FROM Users
               Where NIK=${loginModel.username} AND password=${loginModel.password} AND IsDeleted=0`
          );
          if(!data || data.length==0) result = "Invalid username/password";
          else{
               
          }
          return result;
     }
     
     static async register(loginModel){
          let result=constants.STATUS_OK;
          let errArr=[];
          try{
               //#region Field Validation
               if(!loginModel.username){
                    errArr.push("Username is required");
               }
               if(!loginModel.password){
                    errArr.push("Password is required");
               }
               if(!loginModel.name){
                    errArr.push("Name is required");
               }
               
               if(errArr.length>0){
                    throw errArr.join(", ");
               }
               //#endregion

               const existingData = await query(
                    `SELECT * FROM Users
                    Where NIK = '${loginModel.username}'`
               );

               if(existingData.length>0){
                    throw "Username already exist";
               }

               const data = await insert(
                    `INSERT INTO Users
                    VALUES (null,'${loginModel.username}','${loginModel.name}','${loginModel.password}')`
               );

               console.log(data);
     
          }catch(err){
               result = err.message??err;
          }
          
          return result;
     }
}
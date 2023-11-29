import mysql from 'mysql2/promise'
import constants from '../utils/constants.js';


const db = await mysql.createConnection({
     host:"localhost",
     user:"root",
     password:"12345678",
     database:"elearning"
});


async function query(query,params){
     const [rows] = await db.execute(query);
     return rows;
}

async function insert(query){
     let result=constants.STATUS_OK;
     await db.query(query,null,(err,results,fields)=>{
          if(err){
               result = err;
          }
     })
     return result;
}

export {query,insert};
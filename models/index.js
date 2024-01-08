import { default as dbConfig } from "../db_config.js";
import { Sequelize } from "sequelize";
import QuizModel from "./quiz.model.js";
import UserQuizModel from "./userquiz.model.js";
import MateriModel from "./materi.model.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: 3306,
  pool: dbConfig.pool,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const quizModel = new QuizModel(sequelize,Sequelize);
db.Quiz = quizModel.Quiz;
db.QuizQuestion = quizModel.QuizQuestion;
db.QuizQuestionDetail = quizModel.QuizQuestionDetail;

const userQuizModel = new UserQuizModel(sequelize,Sequelize);
db.UserQuiz = userQuizModel.UserQuiz;
db.UserQuizDetail = userQuizModel.UserQuizDetail;

const materiModel = new MateriModel(sequelize,Sequelize);
db.Materi = materiModel.Materi;

db.Materi.hasMany(db.Quiz,{as:"quizes"});
db.Quiz.belongsTo(db.Materi,{
     foreignKey:"MateriId",
     as:"materi"
});

db.Quiz.hasMany(db.QuizQuestion,{as:"quizQuestions"});
db.QuizQuestion.belongsTo(db.Quiz,{
     foreignKey:"QuizId",
     as:"quiz"
});

db.Quiz.hasMany(db.UserQuiz,{as:"userQuiz"});
db.UserQuiz.belongsTo(db.Quiz,{
     foreignKey:"QuizId",
     as:"quiz"
});

db.UserQuiz.hasMany(db.UserQuizDetail,{as:"userQuizDetails"});
db.UserQuizDetail.belongsTo(db.UserQuiz,{
     foreignKey:"UserQuizId",
     as:"userQuiz"
});



db.QuizQuestion.hasMany(db.QuizQuestionDetail,{as:"quizQuestionDetails"});
db.QuizQuestionDetail.belongsTo(db.QuizQuestion,{
     foreignKey:"QuizQuestionId",
     as:"quizQuestion"
});


export default db;

export default class UserQuizModel {
  constructor(sequelize, DataTypes) {
    this.UserQuiz = this.#UserQuiz(sequelize, DataTypes);
    this.UserQuizDetail = this.#UserQuizDetail(sequelize,DataTypes);
  }

  #UserQuiz = (sequelize, DataTypes) => {
    return sequelize.define("UserQuiz", {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      QuizId: {
        type: DataTypes.BIGINT,
      },
      TotalScore: {
        type: DataTypes.DOUBLE,
      },
      TotalCorrect:{
        type: DataTypes.INTEGER,
      },
      FinishedTime: {
        type: DataTypes.DATE,
      },
      CreatedBy: {
        type: DataTypes.STRING,
      },
      CreatedDate: {
        type: DataTypes.DATE,
      },
      EditedBy: {
        type: DataTypes.STRING,
      },
      EditedDate: {
        type: DataTypes.DATE,
      },
      DeletedBy: {
        type: DataTypes.STRING,
      },
      DeletedDate: {
        type: DataTypes.DATE,
      },
      IsDeleted: {
        type: DataTypes.BOOLEAN,
      },
    });
  };

  #UserQuizDetail = (sequelize,DataTypes)=>{
    return sequelize.define("UserQuizDetail",{
      Id:{
        type: DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement: true,
      },
      UserQuizId:{
        type:DataTypes.BIGINT,
      },
      QuizQuestionId:{
        type:DataTypes.BIGINT
      },
      Answered:{
        type:DataTypes.STRING
      }
    })
  }

}

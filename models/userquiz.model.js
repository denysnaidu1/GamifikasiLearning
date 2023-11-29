export default class UserQuizModel {
  constructor(sequelize, DataTypes) {
    this.UserQuiz = this.#UserQuiz(sequelize, DataTypes);
  }

  #UserQuiz = (sequelize, DataTypes) => {
    return sequelize.define("UserQuiz", {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      QuizId: {
        type: DataTypes.BIGINT,
      },
      TotalScore: {
        type: DataTypes.DOUBLE,
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

}

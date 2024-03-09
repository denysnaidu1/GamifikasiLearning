export default class QuizModel {
  constructor(sequelize, DataTypes) {
    this.Quiz = this.#Quiz(sequelize, DataTypes);
    this.QuizQuestion = this.#QuizQuestion(sequelize, DataTypes);
    this.QuizQuestionDetail = this.#QuizQuestionDetail(sequelize, DataTypes);
  }

  #Quiz = (sequelize, DataTypes) => {
    return sequelize.define("Quiz", {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      MateriId: {
        type: DataTypes.BIGINT,
      },
      Title: {
        type: DataTypes.STRING,
      },
      TimeLimit: {
        type: DataTypes.INTEGER,
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

  #QuizQuestion = (sequelize, DataTypes) => {
    return sequelize.define("QuizQuestion", {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      QuizId: {
        type: DataTypes.BIGINT,
      },
      Question: {
        type: DataTypes.STRING,
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

  #QuizQuestionDetail = (sequelize, DataTypes) => {
    return sequelize.define("QuizQuestionDetail", {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      QuizQuestionId: {
        type: DataTypes.BIGINT,
      },
      Choice: {
        type: DataTypes.CHAR,
      },
      Description: {
        type: DataTypes.STRING,
      },
      IsAnswer: {
        type: DataTypes.BOOLEAN,
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
      }
    });
  };
}
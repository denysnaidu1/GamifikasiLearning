export default class MateriModel {
  constructor(sequelize, DataTypes) {
    this.Materi = this.#Materi(sequelize, DataTypes);
    //this.QuizQuestion = this.#QuizQuestion(sequelize, DataTypes);
    //this.QuizQuestionDetail = this.#QuizQuestionDetail(sequelize, DataTypes);
  }

  #Materi = (sequelize, DataTypes) => {
    return sequelize.define("Materi", {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement:true
      },
      Name: {
        type: DataTypes.STRING,
      },
      ParentMateriId: {
        type: DataTypes.BIGINT,
      },
      Title: {
        type: DataTypes.STRING,
      },
      Content: {
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
}

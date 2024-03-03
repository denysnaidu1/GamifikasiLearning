export default class UserModel {
  constructor(sequelize, DataTypes) {
    this.User = this.#User(sequelize, DataTypes);
  }

  #User = (sequelize,DataTypes)=>{
    return sequelize.define("Users",{
      UserId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      NIK: {
        type: DataTypes.STRING,
      },
      FullName: {
        type: DataTypes.STRING,
      },
      Password:{
        type:DataTypes.STRING
      },
      IsDeleted:{
        type: DataTypes.BOOLEAN
      }
    })
  }
}

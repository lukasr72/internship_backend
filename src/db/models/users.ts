import { DataTypes, Model, Sequelize } from "sequelize";
import { USER_ROLE, USER_ROLES } from "../../utils/enums";
import { Models } from "../index";
import { PatientModel } from "./patients";

export class UserModel extends Model {
  id: number
  name: string
  role: USER_ROLE
  patientID: number
  patient: PatientModel
}

export default (sequelize: Sequelize, modelName: string) => {
  UserModel.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...USER_ROLES),
        allowNull: false,
      },
      // foreign keys
      patientID: {
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: false,
      timestamps: false,
      sequelize,
      modelName,
      tableName: 'users'
    }
  );

  (UserModel as any).associate = (models: Models) => {
    UserModel.belongsTo(models.Patient, { foreignKey: 'patientID' })
  }

  return UserModel
}
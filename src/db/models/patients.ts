import { DataTypes, Model, Sequelize } from "sequelize";
import { GENDER } from "../../utils/enums";
import { Models } from "../index";
import { DiagnoseModel } from "./diagnoses";

export class PatientModel extends Model {
  id: number
  firstName: string
  lastName: string
  birthdate: string
  weight: number
  height: number
  identificationNumber: string
  gender: GENDER

  //FK
  diagnoseID: number
  diagnose: DiagnoseModel
}

export default (sequelize: Sequelize, modelName: string) => {
  PatientModel.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    identificationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(GENDER)),
      allowNull: false
    },
    diagnoseID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    paranoid: false,
    timestamps: false,
    sequelize,
    modelName,
    tableName: 'patients',
  });

  (PatientModel as any).associate = (models: Models) => {
    PatientModel.belongsTo(models.Diagnose, { foreignKey: 'diagnoseID' })
    PatientModel.hasOne(models.User, { foreignKey: 'id' })
  }

  return PatientModel
}
import { DataTypes, Model, Sequelize } from "sequelize";
import { DiagnoseModel } from "./diagnoses";
import { Models } from "../index";
import { SUBSTANCES_TIMEUNIT } from "../../utils/enums";

export class SubstanceModel extends Model {
  id: number
  name: string
  timeUnit: string
  halfLife: number

  // foreign keys
  diagnoses: DiagnoseModel[]
}

export default (sequelize: Sequelize, modelName: string) => {
  SubstanceModel.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timeUnit: {
      type: DataTypes.ENUM(...Object.values(SUBSTANCES_TIMEUNIT)),
      allowNull: false
    },
    halfLife: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    paranoid: false,
    timestamps: false,
    sequelize,
    modelName,
    tableName: 'substances',
  });

  (SubstanceModel as any).associate = (models: Models) => {
    SubstanceModel.hasMany(models.Diagnose, { foreignKey: 'substanceID' })
  }

  return SubstanceModel
}
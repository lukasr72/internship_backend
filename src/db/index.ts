import { Sequelize } from "sequelize";
import * as database from '../../config/database'
import { forEach } from "lodash";
import definePatient from "./models/patients";
import defineDiagnose from "./models/diagnoses";
import defineSubstance from "./models/substances";
import defineUser from "./models/users";

const env = process.env.NODE_ENV
const { url, options } = (database as any)[env]

const sequelize = new Sequelize(url, options)

sequelize
  .authenticate()
  .then(() => console.log('Database connection has been established successfully'))
  .catch((err) => console.log(`Unable to coonect to database ${err.messages}`))


const modelsBuilder = (instance: Sequelize) => ({
  Substance: defineSubstance(instance, 'substance'),
  Diagnose: defineDiagnose(instance, 'diagnose'),
  Patient: definePatient(instance, 'patient'),
  User: defineUser(instance, 'user')
})


const buildModels = () => {
  const models = modelsBuilder(sequelize)

  forEach(models, (model: any) => {
    if (model.associate) {
      model.associate(models)
    }
  })

  return models
}

const models = buildModels()
type Models = typeof models

export type { Models }
export { models }
export default sequelize
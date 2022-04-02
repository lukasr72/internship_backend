import { Options } from 'sequelize'

// eslint-disable-next-line import/prefer-default-export
export const development = {
	url: process.env.POSTGRESQL_URL,
	options: <Options>{
		minifyAliases: true,
		logging: false,
		pool: {
			max: 4
		}
	}
}

export const production = {
	url: process.env.POSTGRESQL_PROD_URL,
	options: <Options>{
		minifyAliases: true,
		logging: false,
		pool: {
			max: 4
		}
	}
}

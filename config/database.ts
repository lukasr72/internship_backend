import { Options } from 'sequelize'

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

export const test = {
	url: process.env.POSTGRESQL_TEST_URL,
	options: <Options>{
		minifyAliases: true,
		logging: false,
		pool: {
			max: 4
		}
	}
}

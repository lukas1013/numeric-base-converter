module.exports = env => ({
	plugins: {
		'postcss-preset-env': {
			stage: 4
		},
		'cssnano': {}
	},
	map: env === 'production' ? false : 'inline'
})
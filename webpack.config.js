const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => ({
	mode: env.production ?? 'development',
	output: {
		filename: '[name].[chunkhash].chunk.js',
		path: path.resolve(__dirname, 'static/js'),
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
			   exclude: /node_modules/,
			   use: ['babel-loader']
			},
			{
				test: /\.html$/,
				use: 'html-loader']
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: './index.html'
		})
	],
	devServer: {
		compress: true,
		port: 3000,
		onListening: server => {
			const port = server.listeningApp.address().port;
			console.log(`Linstening on port ${port}`);
		},
		overlay: {
			warnings: true,
			errors: true
		},
		watchContentBase: true
	},
	resolve: { 
		mainFiles: ['index'],
		extensions: ['.js']
	},
	watch: true,
	watchOptions: {
		ignored: /node_modules/
	},
	stats: {
		colors: true
	}
	//target: 'web'
});
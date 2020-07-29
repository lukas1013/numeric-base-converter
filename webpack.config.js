const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = env => {
	const isProductionEnv = env.NODE_ENV === 'production'
	
	return {
		mode: env.NODE_ENV,
		entry: {
			main: './src/index.js',
			vendor: ['react', 'react-dom']
		},
		output: {
			filename: 'static/js/[name].[hash:8].js',
			path: isProductionEnv ? __dirname + '/build' : undefined,
			pathinfo: !isProductionEnv,
			chunkFilename: 'static/js/[id].[contenthash:8].chunk.js'
		},
		optimization: {
			splitChunks: {
				chunks: 'all'
			},
			runtimeChunk: {
				name: entry => `runtime-${entry.name}`
			},
			minimize: isProductionEnv,
			minimizer: [
				new TerserPlugin(),
				new OptimizeCssAssetsPlugin()
			]
		},
		module: {
			rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env', '@babel/preset-react'],
							plugins: ['@babel/plugin-transform-runtime']
						}
					},
					{
						loader: 'eslint-loader',
						options: {
							cache: false,
							failOnWarning: false
						}
					}
				]
			},
				{
					test: /\.html$/,
					use: ['html-loader']
				},
				{
					test: /\.css$/,
					use: [{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: true,
							hmr: !isProductionEnv,
							reloadAll: true
						}
					},
						'css-loader'
					]
				}]
		},
		plugins: [
			new CleanWebpackPlugin(),
			new HtmlPlugin({
				template: path.resolve(__dirname, 'public', 'index.html'),
				filename: './index.html'
			}),
			new MiniCssExtractPlugin({
				filename: 'static/css/[name].[contenthash:8].css',
				chunkFilename: 'static/css/[id].[contenthash:8].chunk.css'
			})
		],
		devServer: {
			contentBase: isProductionEnv ? path.resolve(__dirname, 'build') : path.resolve(__dirname, 'public'),
			compress: true,
			port: 3000,
			onListening: server => {
				const port = server.listeningApp.address().port;
				console.log(`Linstening on port ${port}`);
			},
			hot: true,
			//stats: 'normal',
			open: true, //open browser
			overlay: {
				warnings: true,
				errors: true
			},
			watchContentBase: true
		},
		resolve: {
			mainFiles: ['index'],
			extensions: ['.js'],
			symlinks: false
		},
		watch: !isProductionEnv,
		watchOptions: {
			ignored: /node_modules/
		},
		stats: {
			colors: true
		}
		//target: 'web'
	}
}
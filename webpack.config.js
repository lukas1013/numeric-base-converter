const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { SourceMapDevToolPlugin } = require('webpack');

module.exports = env => {
	const isProductionEnv = env.NODE_ENV === 'production'
	
	return {
		mode: env.NODE_ENV,
		entry: {
			main: './src/index.js', /*default*/
		},
		output: {
			filename: 'static/js/[name].[hash:8].js',
			path: isProductionEnv ? __dirname + '/build' : undefined,
			pathinfo: !isProductionEnv,
			chunkFilename: 'static/js/[id].[contenthash:8].chunk.js',
			globalObject: 'this'
		},
		optimization: {
			moduleIds: 'hashed',
			splitChunks: {
				chunks: 'all',
				name: !isProductionEnv,
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						chunks: 'all'
					}
				}
			},
			runtimeChunk: 'single',
			minimize: isProductionEnv,
			minimizer: [
				new TerserPlugin(),
				new OptimizeCssAssetsPlugin()
			],
			mangleWasmImports: true,
			noEmitOnErrors: true
		},
		devtool: false,
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
					},
					'source-map-loader'
				]
			},
				{
					test: /\.html$/,
					use: ['html-loader']
				},
				{
					test: /\.css$/,
					use: [ isProductionEnv ? {
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: true,
							hmr: !isProductionEnv,
							reloadAll: true
						}
					} : 'style-loader',
						'css-loader'
					]
				}]
		},
		plugins: [
			new CleanWebpackPlugin(),
			new SourceMapDevToolPlugin({
				exclude: /node_modules/,
				filename: '[file].map'
			}),
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
			contentBase: path.resolve(__dirname, 'public'),
			compress: true,
			port: 3000,
			onListening: server => {
				const port = server.listeningApp.address().port;
				console.log(`Linstening on port ${port}`);
			},
			hot: true,
			stats: 'errors-warnings',
			open: true, //open browser
			overlay: {
				warnings: false,
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
		}
	}
}
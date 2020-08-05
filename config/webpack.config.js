const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const PWAManifestPlugin = require('webpack-pwa-manifest');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { SourceMapDevToolPlugin } = require('webpack');

module.exports = env => {
	const isProductionEnv = env.NODE_ENV === 'production'
	
	return {
		mode: env.NODE_ENV,
		context: path.resolve(__dirname, '..'),
		entry: {
			main: './src/index.js', /*default*/
		},
		output: {
			filename: 'static/js/[name].[hash:8].js',
			path: isProductionEnv ? path.resolve(__dirname, '..', 'build') : undefined,
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
				new TerserPlugin({
					sourceMap: true
				}),
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
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								config: { path: path.resolve(__dirname) }
							}
						}
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
				favicon: path.resolve(__dirname, '..','public','assets','favicon.ico'),
				template: path.resolve(__dirname, '..', 'public', 'index.html'),
				filename: 'index.html'
			}),
			new MiniCssExtractPlugin({
				filename: 'static/css/[name].[contenthash:8].css',
				chunkFilename: 'static/css/[id].[contenthash:8].chunk.css'
			}),
			new WorkboxPlugin.GenerateSW({
				swDest: './service-worker.js', /*default*/
				cleanupOutdatedCaches: true,
				clientsClaim: true,
				inlineWorkboxRuntime: false,
				/*mode: env.NODE_ENV -- default*/
				skipWaiting: true
			}),
			new PWAManifestPlugin({
				filename: 'manifest.webmanifest',
				inject: true,
				includeDirectory: true,
				fingerprints: false,
				crossorigin: 'use-credentials',
				short_name: 'Base Converter',
				name: 'Numeric Base Converter',
				description: 'A simple numeric base converter made with Reactjs',
				icons: [
					{
						src: path.resolve(__dirname, '..', 'public', 'assets', 'icon-192x192.png'),
						size: 192,
						purpose: 'maskable'
					},
					{
						src: path.resolve(__dirname, '..', 'public', 'assets', 'icon-192x192.png'),
						size: 192
					},
					{
						src: path.resolve(__dirname, '..', 'public', 'assets', 'icon-512x512.png'),
						size: 512
					},
					{
						src: path.resolve(__dirname, '..', 'public', 'assets', 'apple-touch-icon.png'),
						size: 180,
						ios: true
					},
					{
						src: path.resolve(__dirname, '..', 'public', 'assets' , 'apple-touch-icon.png'),
						size: 180,
						ios: 'startup'
					}
				],
				start_url: '/',
				background_color: '#000',
				display: 'standalone',
				theme_color: '#141314'
			})
		],
		devServer: {
			contentBase: path.resolve(__dirname, '..', 'public'),
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
		watch: !isProductionEnv
	}
}
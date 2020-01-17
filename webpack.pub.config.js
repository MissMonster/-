const path =  require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const  UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('css/[name]-one.css');
const extractLESS = new ExtractTextPlugin('css/[name]-two.css');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
    mode: "none",
    entry:{
        app:path.join(__dirname,'./src/main.js'),
        // index:path.join(__dirname,'./src/js/index.js'),
        vendors: ['jquery'] 
    },    
        //关闭 webpack 的性能提示	    
    performance: {		    
        hints:false	    
    },
    devServer: {
        contentBase:'src',
        open: true,
        publicPath: '/',
        historyApiFallback: true,
        // host: '192.168.3.109',
        port: 8080, 
        proxy: {
            '/User': { 
                target: 'http://115.29.230.26:8888',
                secure: false, 
                pathRewrite: { '^/User': '/User' },
                changeOrigin: true
            }
        },
        // hot: true
    },    
    optimization: {
		splitChunks: {
            chunks: "all",
			cacheGroups: {
				// commons: {
                //     chunks: "initial",
                //     minChunks: 2,
                //     name: "commons",
				// 	maxInitialRequests: 5, // The default limit is too small to showcase the effect
				// 	minSize: 3000 // This is example is too small to create commons chunks
                // },
                'jquery':{
                    test: /jquery/, // 直接使用 test 来做路径匹配
                    chunks: "initial",
                    name: "jquery",
                    enforce: true,
                },
                'react':{
                    test: /react/, // 直接使用 test 来做路径匹配
                    chunks: "initial",
                    name: "react",
                    enforce: true,
                },
                'axios':{
                    test: /axios/, // 直接使用 test 来做路径匹配
                    chunks: "initial",
                    name: "axios",
                    enforce: true,
                },
                'antd-mobile':{
                    test: /antd-mobile/, // 直接使用 test 来做路径匹配
                    chunks: "initial",
                    name: "antd-mobile",
                    enforce: true,
                },
			}
        },
        minimizer: [
            new UglifyJsPlugin({
              uglifyOptions: {
                warnings: false,
                parse: {},
                compress: {},
                mangle: true, // Note `mangle.properties` is `false` by default.
                output: null,
                toplevel: false,
                nameCache: null,
                ie8: false,
                keep_fnames: false,
              },
            }),
        ],
    },
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'js/[name].js'
    },
    plugins:[
        new htmlWebpackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html',
            minify: {
                collapseWhitespace: true, // 合并多余的空格
                removeComments: true, // 移除注释
                removeAttributeQuotes: true // 移除 属性上的双引号
              }
        }),
        new CleanWebpackPlugin(),
        extractCSS,
        extractLESS,
        new OptimizeCssAssetsPlugin(), // 压缩CSS文件的插件
    ],
    module:{
        rules:[
            {test: /\.css$/,
                include: /node_modules/,
                 use: extractCSS.extract({
                fallback: "style-loader",
                use:[
                    {loader: 'css-loader', options: {modules:false}
                    }
                ],
                publicPath: '../' // 指定抽取的时候，自动为我们的路径加上 ../ 前缀
                })
              },
              {test: /\.css$/,
                exclude: /node_modules/,
                 use: extractCSS.extract({
                fallback: "style-loader",
                use:[
                    {loader: 'css-loader', options: {modules:true}
                    }
                ],
                publicPath: '../' // 指定抽取的时候，自动为我们的路径加上 ../ 前缀
                })
              },
            {test: /\.less$/, use: extractLESS.extract({
                fallback: "style-loader",
                use: ["css-loader","less-loader"],
                publicPath: '../' // 指定抽取的时候，自动为我们的路径加上 ../ 前缀
                })
              },
            {test:/\.(gif|jpg|png)$/,use:'url-loader?limit=1000&name=img/[hash:5]-[name].[ext]'},
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader?limit=500&name=fonts/[hash:5]-[name].[ext]' },
            {test:/\.jsx?$/,use:'babel-loader',exclude:/node_modules/},
        ]
    }
}